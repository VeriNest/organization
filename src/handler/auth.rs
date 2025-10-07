//12
use std::sync::Arc;

use axum::{extract::Query, http::{header, HeaderMap}, response::{IntoResponse, Redirect}, routing::{get, post}, Extension, Json, Router};
use axum_extra::extract::cookie::Cookie;
use chrono::{Utc, Duration};
use validator::Validate;
use uuid::Uuid;

use crate::{db::UserExt, dtos::{FilterUserDto, ForgotPasswordRequestDto, LoginUserDto, RegisterUserWithReferralDto, ResetPasswordRequestDto, Response, UserData, UserLoginResponseDto, UserResponseDto, VerifyEmailQueryDto}, error::{ErrorMessage, HttpError}, mail::mails::{send_forgot_password_email, send_verification_email, send_welcome_email}, service::referral::generate_referral_code, utils::{password, token}, AppState};

pub fn auth_handler() -> Router {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/verify", get(verify_email))
        .route("/forgot-password", post(forgot_password))
        .route("/reset-password", post(reset_password))
}

pub async fn register(
    Extension(app_state): Extension<Arc<AppState>>,
    Json(body): Json<RegisterUserWithReferralDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    // Check if user already used a referral code before
    let existing_user = app_state.db_client
        .get_user(None, None, Some(&body.email), None)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    if existing_user.is_some() {
        return Err(HttpError::bad_request("Email already registered"));
    }

    // Check if referral code exists and get referrer
    let mut referrer_id: Option<Uuid> = None;
    if let Some(ref code) = body.referral_code {
        if let Some(referrer) = app_state.db_client
            .get_user_by_referral_code(code)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))? 
        {
            // Prevent self-referral
            if referrer.email == body.email {
                return Err(HttpError::bad_request("Cannot refer yourself"));
            }
            referrer_id = Some(referrer.id);
        } else {
            return Err(HttpError::bad_request("Invalid referral code"));
        }
    }

    // Create user
    let hashed_password = password::hash(&body.password)
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let verification_token = uuid::Uuid::new_v4().to_string();
    let token_expires_at = Utc::now() + Duration::hours(24);

    let user = app_state.db_client
        .save_user(
            body.name,
            body.username,
            body.email,
            hashed_password,
            verification_token.clone(),
            token_expires_at,
        )
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    // Generate and save referral code for the new user
    let referral_code = generate_referral_code();
    let user_with_code = app_state.db_client
        .update_user_referral_code(user.id, referral_code.clone())
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    // Process referral if applicable
    if let Some(ref_id) = referrer_id {
        // Add points to referrer
        let updated_referrer = app_state.db_client
            .add_referral_points(ref_id, 10)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;

        // Increment referral count
        let _ = app_state.db_client
            .increment_referral_count(ref_id)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;

        // Create referral record
        let _ = app_state.db_client
            .create_referral_record(ref_id, user.id, 10)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;

        tracing::info!(
            "Referral successful: {} referred {} (+10 points)",
            updated_referrer.username,
            user_with_code.username
        );
    }

    // Send verification email
    send_verification_email(&user.email, &user.username,&verification_token)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let filtered_user = FilterUserDto::filter_user(&user_with_code);
    
    Ok(Json(UserResponseDto {
        status: "success".to_string(),
        data: UserData { user: filtered_user },
    }))
}

pub async fn login(
    Extension(app_state): Extension<Arc<AppState>>,
    Json(body): Json<LoginUserDto>
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
       .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let result = app_state.db_client
        .get_user(None, None, Some(&body.email), None)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user = result.ok_or(HttpError::bad_request(ErrorMessage::WrongCredentials.to_string()))?;

    let password_matched = password::compare(&body.password, &user.password)
        .map_err(|_| HttpError::bad_request(ErrorMessage::WrongCredentials.to_string()))?;

    if password_matched {
        let token = token::create_token(
            &user.id.to_string(), 
            &app_state.env.jwt_secret.as_bytes(), 
            app_state.env.jwt_maxage
        )
        .map_err(|e| HttpError::server_error(e.to_string()))?;

        let cookie_duration = time::Duration::minutes(app_state.env.jwt_maxage * 60);
        let cookie = Cookie::build(("token", token.clone()))
            .path("/")
            .max_age(cookie_duration)
            .http_only(true)
            .build();

        let response = axum::response::Json(UserLoginResponseDto {
            status: "success".to_string(),
            token,
        });

        let mut headers = HeaderMap::new();

        headers.append(
            header::SET_COOKIE,
            cookie.to_string().parse().unwrap(), 
        );

        let mut response = response.into_response();
        response.headers_mut().extend(headers);

        Ok(response)
    } else {
        Err(HttpError::bad_request(ErrorMessage::WrongCredentials.to_string()))
    }
}

pub async fn verify_email(
    Query(query_params): Query<VerifyEmailQueryDto>,
    Extension(app_state): Extension<Arc<AppState>>
) -> Result<impl IntoResponse, HttpError> {
    query_params.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let result = app_state.db_client
        .get_user(None, None, None, Some(&query_params.token))
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user = result.ok_or(HttpError::unauthorized(ErrorMessage::InvalidToken.to_string()))?;

    if let Some(expires_at) = user.token_expires_at {
        if Utc::now() > expires_at {
            return Err(HttpError::bad_request("Verification token has expired".to_string()))?;
        }
    } else {
        return Err(HttpError::bad_request("Invalid verification token".to_string()))?;
    }

    app_state.db_client.verifed_token(&query_params.token).await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let send_welcome_email_result = send_welcome_email(&user.email, &user.username).await;

    if let Err(e) = send_welcome_email_result {
        eprintln!("Failed to send welcome email: {}", e);
    }

    let token = token::create_token(
        &user.id.to_string(), 
        app_state.env.jwt_secret.as_bytes(),
        app_state.env.jwt_maxage 
    ).map_err(|e| HttpError::server_error(e.to_string()))?;

    let cookie_duration = time::Duration::minutes(app_state.env.jwt_maxage * 60);
    let cookie = Cookie::build(("token", token.clone()))
        .path("/")
        .max_age(cookie_duration)
        .http_only(true)
        .build();

    let mut headers = HeaderMap::new();

    headers.append(
        header::SET_COOKIE,
        cookie.to_string().parse().unwrap() 
    );

    let frontend_url = format!("https://verinest-frontend.vercel.app/login");

    let redirect = Redirect::to(&frontend_url);

    let mut response = redirect.into_response();

    response.headers_mut().extend(headers);

    Ok(response)
}

pub async fn forgot_password(
    Extension(app_state): Extension<Arc<AppState>>,
    Json(body): Json<ForgotPasswordRequestDto>
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
       .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let result = app_state.db_client
            .get_user(None, None, Some(&body.email), None)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user = result.ok_or(HttpError::bad_request("Email not found!".to_string()))?;

    let verification_token = uuid::Uuid::new_v4().to_string();
    let expires_at = Utc::now() + Duration::minutes(30);

    let user_id = uuid::Uuid::parse_str(&user.id.to_string()).unwrap();

    app_state.db_client
        .add_verifed_token(user_id, &verification_token, expires_at)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let reset_link = format!("https://verinest-frontend.vercel.app/reset-password?token={}", &verification_token);

    let email_sent = send_forgot_password_email(&user.email, &reset_link, &user.username).await;

    if let Err(e) = email_sent {
        eprintln!("Failed to send forgot password email: {}", e);
        return Err(HttpError::server_error("Failed to send email".to_string()));
    }

    let response = Response {
        message: "Password reset link has been sent to your email.".to_string(),
        status: "success",
    };

    Ok(Json(response))
}

pub async fn reset_password(
    Extension(app_state): Extension<Arc<AppState>>,
    Json(body): Json<ResetPasswordRequestDto>
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let result = app_state.db_client
        .get_user(None, None, None, Some(&body.token))
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user = result.ok_or(HttpError::bad_request("Invalid or expired token".to_string()))?;

    if let Some(expires_at) = user.token_expires_at {
        if Utc::now() > expires_at {
            return Err(HttpError::bad_request("Verification token has expired".to_string()))?;
        }
    }else {
        return Err(HttpError::bad_request("Invalid verification token".to_string()))?;
    }

    let user_id = uuid::Uuid::parse_str(&user.id.to_string()).unwrap();

    let hash_password = password::hash(&body.new_password)
            .map_err(|e| HttpError::server_error(e.to_string()))?;

    app_state.db_client
        .update_user_password(user_id.clone(), hash_password)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    app_state.db_client
        .verifed_token(&body.token)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let response = Response {
        message: "Password has been successfully reset.".to_string(),
        status: "success",
    };

    Ok(Json(response))
}