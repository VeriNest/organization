//13
use std::{env, sync::Arc};

use axum::{extract::Query, middleware, response::IntoResponse, routing::{get, put}, Extension, Json, Router};
use validator::Validate;



use crate::{db::UserExt, dtos::{FilterUserBoard, FilterUserDto, NameUpdateDto, RequestQueryDto, Response, RoleUpdateDto, TrustPointRequestDto, UserData, UserListResponseDto, UserPasswordUpdateDto, UserResponseDto}, error::{ErrorMessage, HttpError}, middleware::{role_check, JWTAuthMiddeware}, models::usermodel::UserRole, service::referral::generate_referral_link, utils::password, AppState};


pub fn users_handler() -> Router {
    Router::new()
        .route(
            "/me", 
            get(get_me)
            .layer(middleware::from_fn(|state, req, next| {
                role_check(state, req, next, vec![UserRole::Admin, UserRole::User])
            }))
    )
    .route(
        "/users", 
        get(get_users)
        .layer(middleware::from_fn(|state, req, next| {
            role_check(state, req, next, vec![UserRole::User, UserRole::Admin])
        }))
    )
    .route("/name", put(update_user_name))
    .route("/role", put(update_user_role))
    .route("/password", put(update_user_password))
    .route(
        "/trust_point", 
        put(update_trust_point)
        .layer(middleware::from_fn(|state, req, next| {
            role_check(state, req, next, vec![UserRole::User, UserRole::Admin])
        }))
    )
    .route(
        "/leaderboard", 
        get(get_leaderboard)
    )
    .route(
        "/referral-link", 
        get(get_referral_link)
    )
    .route(
        "/referral-stats", 
        get(get_referral_stats)
    )
    .route(
        "/referral-status", 
        get(check_referral_status)
    )
}



pub async fn get_me(
    Extension(_app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>
) -> Result<impl IntoResponse, HttpError> {

    let filtered_user = FilterUserDto::filter_user(&user.user);

    let response_data = UserResponseDto {
        status: "success".to_string(),
        data: UserData {
            user: filtered_user,
        }
    };

    Ok(Json(response_data))
}

pub async fn get_users(
    Query(query_params): Query<RequestQueryDto>,
    Extension(app_state): Extension<Arc<AppState>>
) -> Result<impl IntoResponse, HttpError> {
    query_params.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let page = query_params.page.unwrap_or(1);
    let limit = query_params.limit.unwrap_or(10);
    
    let users = app_state.db_client
        .get_users(page as u32, limit)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user_count = app_state.db_client
        .get_user_count()
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let response = UserListResponseDto {
        status: "success".to_string(),
        users: FilterUserBoard::filter_users(&users),
        results: user_count,
    };

    Ok(Json(response))
}

pub async fn update_user_name(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
    Json(body): Json<NameUpdateDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
       .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let user = &user.user;

    let user_id = uuid::Uuid::parse_str(&user.id.to_string()).unwrap();

    let result = app_state.db_client.
        update_user_name(user_id.clone(), &body.name)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let filtered_user = FilterUserDto::filter_user(&result);

    let response = UserResponseDto {
        data: UserData {
            user: filtered_user,
        },
        status: "success".to_string(),
    };

    Ok(Json(response))
}

pub async fn update_user_role(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(auth_user): Extension<JWTAuthMiddeware>,  // Renamed for clarity
    Json(body): Json<RoleUpdateDto>,
) -> Result<impl IntoResponse, HttpError> {
    // Validate input
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    // Verify requesting user is admin
    if auth_user.user.role != UserRole::Admin {
        return Err(HttpError::unauthorized("Only Admins can update roles"));
    }

    // Prevent self-demotion
    if auth_user.user.id == body.target_user_id && body.role != UserRole::Admin {
        return Err(HttpError::unauthorized("Admins cannot remove their own admin status"));
    }

    // Update target user
    let updated_user = app_state.db_client
        .update_user_role( body.target_user_id, body.role)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    Ok(Json(UserResponseDto {
        status: "success".to_string(),
        data: UserData {
            user: FilterUserDto::filter_user(&updated_user),
        },
    }))
}

pub async fn update_user_password(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
    Json(body): Json<UserPasswordUpdateDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
       .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let user = &user.user;

    let user_id = uuid::Uuid::parse_str(&user.id.to_string()).unwrap();

    let result = app_state.db_client
        .get_user(Some(user_id.clone()), None, None, None)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user = result.ok_or(HttpError::unauthorized(ErrorMessage::InvalidToken.to_string()))?;

    let password_match = password::compare(&body.old_password, &user.password)
            .map_err(|e| HttpError::server_error(e.to_string()))?;

    if !password_match {
        return Err(HttpError::bad_request("Old password is incorrect".to_string()));
    }

    let hash_password = password::hash(&body.new_password)
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    app_state.db_client
        .update_user_password(user_id.clone(), hash_password)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let response = Response {
        message: "Password updated Successfully".to_string(),
        status: "success",
    };

    Ok(Json(response))

}

pub async fn update_trust_point (
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
    Json(body): Json<TrustPointRequestDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let user_id = user.user.id;

    let updated_user = app_state.db_client
        .update_trust_point(user_id, body.score_to_add)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let filtered_user = FilterUserDto::filter_user(&updated_user);

    let response = UserResponseDto {
        status: "success".to_string(),
        data: UserData {
            user: filtered_user,
        }
    };

    Ok(Json(response))

}

pub async fn get_leaderboard(
    Extension(app_state): Extension<Arc<AppState>>,
    Query(query_params): Query<RequestQueryDto>
) -> Result<impl IntoResponse, HttpError> {
    query_params.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let limit = query_params.limit.unwrap_or(100);

    let users = app_state.db_client
        .get_users_by_trustscore(limit as i64)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let leaderboard = FilterUserBoard::filter_users(&users);

    let response = UserListResponseDto {
        status: "success".to_string(),
        users: leaderboard,
        results: limit as i64
    };

    Ok(Json(response))
}

pub async fn get_referral_link(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>
) -> Result<impl IntoResponse, HttpError> {
    
    let user_id = user.user.id;

    let app_url = env::var("APP_URL").expect("APP_URL is expected");

    let user = app_state.db_client
        .get_user(Some(user_id), None, None, None)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?
        .ok_or(HttpError::server_error("User not Found"))?;

    let referral_code = user.referral_code
        .ok_or(HttpError::bad_request("No referral code found"))?;

    let referral_link = generate_referral_link(&app_url, &referral_code);

    Ok(Json(serde_json::json!({
        "status": "success",
        "data": {
            "referral_code": referral_code,
            "referral_link": referral_link
        }
    })))
}

pub async fn get_referral_stats(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
) -> Result<impl IntoResponse, HttpError> {
    let user_id = user.user.id;
    
    let stats = app_state.db_client
        .get_user_referral_stats(user_id)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    Ok(Json(serde_json::json!({
        "status": "success",
        "data": {
            "total_referrals": stats.total_referrals,
            "total_points_earned": stats.total_points_earned,
            "successful_referrals": stats.successful_referrals
        }
    })))
}

pub async fn check_referral_status(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
) -> Result<impl IntoResponse, HttpError> {
    let user_id = user.user.id;
    
    let referral = app_state.db_client
        .get_referral_by_referee(user_id)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let referrer_info = if let Some(ref referral) = referral {
        let referrer = app_state.db_client
            .get_user(Some(referral.referrer_id), None, None, None)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?
            .ok_or(HttpError::server_error("Referrer not found"))?;
        
        Some(serde_json::json!({
            "referrer_name": referrer.name,
            "referrer_username": referrer.username,
            "points_earned": referral.points_awarded,
            "referred_at": referral.created_at
        }))
    } else {
        None
    };

    Ok(Json(serde_json::json!({
        "status": "success",
        "data": {
            "was_referred": referral.is_some(),
            "referral_info": referrer_info
        }
    })))
}
