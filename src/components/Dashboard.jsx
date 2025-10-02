import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "../utils/AuthHandlers.js";

// Import SVG icons
import dashboardIcon from "/assets/dashboard.svg";
import propertiesIcon from "/assets/properties.svg";
import walletIcon from "/assets/wallet.svg";
import transactionsIcon from "/assets/transactions.svg";
import rewardIcon from "/assets/reward.svg";
import settingsIcon from "/assets/settings.svg";
import helpIcon from "/assets/help.svg";
import logoutIcon from "/assets/logout.svg";
import userIcon from "/assets/user.svg";
import verinestlogo2 from "/assets/verinestlogo2.svg";
import eyeOpen from "/assets/eye-open.svg";
import eyeClosed from "/assets/eye-closed.svg";

// Import new components
import TwitterMissionPopup from "./TwitterMissionPopup.jsx";
import RealEstateQuiz from "./RealEstateQuiz.jsx";
import ComingSoon from "./ComingSoon.jsx";

export default function Dashboard() {
	const { user, setUser, fetchUser } = useAuth();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("Dashboard");
	const [missionTab, setMissionTab] = useState("General");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [balanceVisible, setBalanceVisible] = useState(true);
	const [currentStreak, setCurrentStreak] = useState(0);
	const [maxStreak, setMaxStreak] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isTwitterPopupOpen, setIsTwitterPopupOpen] = useState(false);
	const [isQuizOpen, setIsQuizOpen] = useState(false);
	const [completedMissions, setCompletedMissions] = useState([]);
	const [lastLoginTime, setLastLoginTime] = useState(null);
	const [claimedDays, setClaimedDays] = useState([]);
	const [todayClaimed, setTodayClaimed] = useState(false);

	// Sidebar menu items with SVG icons
	const menuItems = [
		{ name: "Dashboard", icon: dashboardIcon },
		{ name: "Properties", icon: propertiesIcon },
		{ name: "Wallet", icon: walletIcon },
		{ name: "Transactions", icon: transactionsIcon },
		{ name: "Reward", icon: rewardIcon },
		{ name: "Settings", icon: settingsIcon },
		{ name: "Help/Support", icon: helpIcon },
	];

	// Calculate reward for a specific day
	const calculateReward = (day) => {
		return day === 7 ? 10 : 5;
	};

	// Add trust points to user
	const addTrustPoints = useCallback(
		async (points) => {
			try {
				if (!user || !user.id) {
					console.log("User data not available yet");
					return false;
				}

				const token = localStorage.getItem("token");
				const response = await fetch(
					"https://verinest.up.railway.app/api/users/trust_point",
					{
						method: "PUT",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({
							user_id: user.id,
							score_to_add: points,
						}),
					}
				);

				if (response.ok) {
					const result = await response.json();
					setUser((prev) => ({
						...prev,
						trust_score: result.data.user.trust_score,
					}));

					return true;
				} else {
					console.error(
						"Failed to update trust score:",
						await response.text()
					);
					return false;
				}
			} catch (error) {
				console.error("Error updating trust score:", error);
				return false;
			}
		},
		[setUser, user]
	);

	// Check login status and update streak
	const updateLoginStatus = useCallback(() => {
		const now = new Date();
		const today = now.toDateString();
		const lastLogin = localStorage.getItem("lastLogin");
		const storedStreak = parseInt(
			localStorage.getItem("currentStreak") || "0"
		);
		const storedMaxStreak = parseInt(
			localStorage.getItem("maxStreak") || "0"
		);
		const lastClaimedDate = localStorage.getItem("lastClaimedDate");

		let newStreak = storedStreak;

		// Check if user already logged in today
		if (lastLogin) {
			const lastLoginDate = new Date(JSON.parse(lastLogin));
			const lastLoginDay = lastLoginDate.toDateString();

			if (lastLoginDay === today) {
				// User already logged in today
				setCurrentStreak(storedStreak);
				setLastLoginTime(lastLoginDate);
				return;
			}

			// Check if consecutive login
			const yesterday = new Date(now);
			yesterday.setDate(yesterday.getDate() - 1);
			const yesterdayString = yesterday.toDateString();
			const lastLoginDayString = lastLoginDate.toDateString();

			if (lastLoginDayString === yesterdayString) {
				// Consecutive login
				newStreak = storedStreak + 1;
			} else {
				// Broken streak
				newStreak = 1;
			}
		} else {
			// First login
			newStreak = 1;
		}

		// Update streak values
		setCurrentStreak(newStreak);
		localStorage.setItem("currentStreak", newStreak.toString());

		// Update max streak if needed
		if (newStreak > storedMaxStreak) {
			setMaxStreak(newStreak);
			localStorage.setItem("maxStreak", newStreak.toString());
		}

		// Update last login time
		localStorage.setItem("lastLogin", JSON.stringify(now));
		setLastLoginTime(now);

		// Check if today's reward already claimed
		if (lastClaimedDate === today) {
			setTodayClaimed(true);
		}
	}, []);

	// Claim daily reward
	const claimDailyReward = async (day) => {
		try {
			const points = calculateReward(day);
			const success = await addTrustPoints(points);

			if (success) {
				// Mark day as claimed
				const today = new Date().toDateString();
				localStorage.setItem("lastClaimedDate", today);
				setTodayClaimed(true);
				setClaimedDays((prev) => [...prev, day]);

				// Show success message
				// alert(`Successfully claimed ${points} VTS!`);
			} else {
				alert("Failed to claim reward. Please try again.");
			}
		} catch (error) {
			console.error("Error claiming reward:", error);
			alert("An error occurred while claiming your reward.");
		}
	};

	// Fetch user data from API
	const initializeUserData = useCallback(async () => {
		try {
			setLoading(true);
			const data = await fetchUser();
			if (!data) {
				// console.log("Error is here");
				navigate("/login");
				return;
			}
			const storedStreak = parseInt(
				localStorage.getItem("currentStreak") || "0"
			);
			const storedMaxStreak = parseInt(
				localStorage.getItem("maxStreak") || "0"
			);
			const lastLogin = localStorage.getItem("lastLogin");
			const lastClaimedDate = localStorage.getItem("lastClaimedDate");
			const today = new Date().toDateString();

			setCurrentStreak(storedStreak);
			setMaxStreak(storedMaxStreak);
			setLastLoginTime(
				lastLogin ? new Date(JSON.parse(lastLogin)) : null
			);
			setTodayClaimed(lastClaimedDate === today);

			updateLoginStatus();
		} catch (err) {
			setError(err.message);
			console.error("Error initializing user:", err);
			navigate("/login");
		} finally {
			setLoading(false);
		}
	}, [fetchUser, navigate, updateLoginStatus]);

	// Initialize user data on component mount
	useEffect(() => {
		initializeUserData();
	}, [initializeUserData]);

	const toggleBalanceVisibility = () => {
		setBalanceVisible(!balanceVisible);
	};
	const handleLogout = () => {
		handleSignOut({ setUser, navigate });
	};
	const handleTwitterMission = () => {
		setIsTwitterPopupOpen(true);
	};

	const handleTwitterComplete = async () => {
		const success = await addTrustPoints(5);
		if (success) {
			setCompletedMissions((prev) => [...prev, "twitter"]);
			setIsTwitterPopupOpen(false);
			alert("Successfully claimed 5 VTS for Twitter mission!");
		} else {
			alert("Failed to claim Twitter mission reward. Please try again.");
		}
	};

	const handleQuizComplete = async (score) => {
		// Only add points if all answers are correct
		if (score === 5) {
			const success = await addTrustPoints(5);
			if (success) {
				setCompletedMissions((prev) => [...prev, "quiz"]);
				alert("Successfully claimed 5 VTS for completing the quiz!");
			} else {
				alert("Failed to claim quiz reward. Please try again.");
			}
		} else {
			alert("You need to answer all questions correctly to earn VTS.");
		}
		setIsQuizOpen(false);
	};

	if (loading) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#113c5e] mx-auto"></div>
					<h1 className="text-xl mt-4">Loading your dashboard...</h1>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl text-red-600 mb-4">
						Error Loading Dashboard
					</h1>
					<p className="text-slate-600 mb-6">{error}</p>
					<button
						onClick={initializeUserData}
						className="px-4 py-2 bg-[#113c5e] text-white rounded-lg hover:bg-[#0c2a44] transition"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex h-screen bg-slate-50 relative">
				{/* Mobile Overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-[#00000080] bg-opacity-50 z-40 lg:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Sidebar */}
				<aside
					className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out
            ${
				sidebarOpen
					? "translate-x-0"
					: "-translate-x-full lg:translate-x-0"
			}`}
				>
					<div className="p-4 lg:p-6 flex items-center justify-between">
						<img
							src={verinestlogo2}
							alt="VeriNest Logo"
							className="h-8"
						/>
						{/* Mobile close button */}
						<button
							className="lg:hidden text-white p-1 rounded hover:bg-slate-800 transition"
							onClick={() => setSidebarOpen(false)}
						>
							✕
						</button>
					</div>

					<div className="px-4 py-2 flex items-center gap-3 bg-slate-800 mx-4 rounded-lg">
						<div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
							<span className="text-white font-semibold">
								{user?.name
									? user.name.charAt(0).toUpperCase()
									: "U"}
							</span>
						</div>
						<div>
							<p className="text-sm font-medium">
								{user?.name || "User"}
							</p>
							<p className="text-xs text-slate-400">
								Trust Score: {user?.trust_score || 0}
							</p>
						</div>
					</div>

					<nav className="flex-1 px-4 py-6">
						<ul className="space-y-2">
							{menuItems.map((item) => (
								<li
									key={item.name}
									onClick={() => {
										setActiveTab(item.name);
										setSidebarOpen(false);
									}}
									className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition text-sm lg:text-base
                    ${
						activeTab === item.name
							? "bg-[#113c5e] font-semibold text-white"
							: "hover:bg-slate-700"
					}`}
								>
									<img
										src={item.icon}
										alt={item.name}
										className="w-5 h-5"
									/>
									{item.name}
								</li>
							))}
							<li
								onClick={handleLogout}
								className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition text-sm lg:text-base hover:bg-slate-700 mt-4"
							>
								<img
									src={logoutIcon}
									alt="Logout"
									className="w-5 h-5"
								/>
								Logout
							</li>
						</ul>
					</nav>

					{/* App Version */}
					{/* <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-sm">
              <span>App Version</span>
              <span>v1.2.0</span>
            </div>
          </div> */}
				</aside>

				{/* Main Content */}
				<main className="flex-1 flex flex-col min-w-0">
					{/* Header */}
					<div className="flex justify-between items-center p-4 lg:p-6 bg-white shadow-sm">
						{/* Mobile menu button */}
						<button
							className="lg:hidden p-2 text-slate-600 rounded-md hover:bg-slate-100 transition"
							onClick={() => setSidebarOpen(true)}
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>

						<div className="flex-1 max-w-md mx-4 lg:mx-0">
							{/* Search bar removed as requested */}
						</div>

						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition">
								<div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
									<img
										src={userIcon}
										alt="User"
										className="w-5 h-5"
									/>
								</div>
								<span className="hidden md:block text-sm font-medium">
									{user?.name || "User"}
								</span>
							</div>
						</div>
					</div>

					{/* Scrollable Content */}
					{activeTab === "Dashboard" ? (
						<div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
							{/* Welcome Header with Streak Info */}
							<div className="bg-[#113c5e] text-white p-6 rounded-2xl">
								<h1 className="text-2xl font-bold mb-2">
									Welcome back, {user?.name || "User"}!
								</h1>
								<p className="opacity-90 mb-4">
									Claim your daily rewards and complete
									missions to earn VTS tokens.
								</p>

								<div className="flex items-center gap-6">
									<div className="text-center">
										<p className="text-sm opacity-80">
											Current Streak
										</p>
										<p className="text-3xl font-bold">
											{currentStreak} days
										</p>
									</div>

									<div className="h-12 w-px bg-white opacity-30"></div>

									<div className="text-center">
										<p className="text-sm opacity-80">
											Max Streak
										</p>
										<p className="text-3xl font-bold">
											{maxStreak} days
										</p>
									</div>

									{lastLoginTime && (
										<>
											<div className="h-12 w-px bg-white opacity-30"></div>
											<div className="text-center">
												<p className="text-sm opacity-80">
													Last Login
												</p>
												<p className="text-sm">
													{lastLoginTime.toLocaleDateString()}{" "}
													at{" "}
													{lastLoginTime.toLocaleTimeString()}
												</p>
											</div>
										</>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* VTS Balance Card */}
								<div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
									<div className="flex justify-between items-center mb-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-[#113c5e] rounded-full flex items-center justify-center">
												<span className="text-white font-bold text-lg">
													V
												</span>
											</div>
											<span className="text-lg font-medium text-slate-800">
												VTS Balance
											</span>
										</div>
										<button
											className="p-1 rounded cursor-pointer transition-all duration-300"
											onClick={toggleBalanceVisibility}
										>
											<img
												src={
													balanceVisible
														? eyeOpen
														: eyeClosed
												}
												alt="Toggle visibility"
												className="w-6 h-6"
											/>
										</button>
									</div>

									<div className="mb-6">
										{balanceVisible ? (
											<>
												<span className="text-3xl font-bold text-slate-800">
													{user?.trust_score || 0}.00
												</span>
												<span className="text-lg text-slate-600 ml-2">
													VTS
												</span>
											</>
										) : (
											<div className="flex items-center h-10">
												<span className="text-2xl font-bold text-slate-800">
													••••
												</span>
											</div>
										)}
									</div>

									<div className="flex gap-3">
										<button className="flex-1 py-3 rounded-full bg-[#113c5e] text-white hover:bg-[#0c2a44] transition text-sm font-medium">
											View Transactions
										</button>
									</div>
								</div>

								{/* Streak Rewards Card */}
								<div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
									<h2 className="text-lg font-medium text-slate-800 mb-6">
										Daily Login Rewards
									</h2>
									<div className="grid grid-cols-7 gap-3 mb-6">
										{[1, 2, 3, 4, 5, 6, 7].map((day) => {
											const isClaimed =
												claimedDays.includes(day) ||
												(day === currentStreak &&
													todayClaimed);
											const canClaim =
												day === currentStreak &&
												!todayClaimed;

											return (
												<div
													key={day}
													className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
														isClaimed
															? "bg-green-50 border-green-200 shadow-sm"
															: canClaim
															? "bg-blue-50 border-blue-200 shadow-sm cursor-pointer"
															: "bg-slate-50 border-slate-200"
													}`}
													onClick={
														canClaim
															? () =>
																	claimDailyReward(
																		day
																	)
															: undefined
													}
												>
													<span className="text-xs font-semibold text-slate-600 mb-2">
														Day {day}
													</span>
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
															isClaimed
																? "bg-green-500 text-white shadow-md"
																: canClaim
																? "bg-blue-500 text-white shadow-md"
																: "bg-slate-200 text-slate-400"
														}`}
													>
														{isClaimed
															? "✓"
															: canClaim
															? "!"
															: ""}
													</div>
													<span className="text-xs font-bold text-slate-800">
														{calculateReward(day)}{" "}
														VTS
													</span>
													{canClaim && (
														<span className="text-xs text-blue-600 mt-1 font-medium">
															Click to claim
														</span>
													)}
												</div>
											);
										})}
									</div>
									<div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
										<p className="text-sm text-slate-700 text-center">
											{todayClaimed ? (
												<>
													You've already claimed your
													reward today. Come back
													tomorrow!
												</>
											) : currentStreak > 0 ? (
												<>
													Click on Day {currentStreak}{" "}
													to claim your{" "}
													<span className="font-semibold text-[#113c5e]">
														{calculateReward(
															currentStreak
														)}{" "}
														VTS
													</span>{" "}
													reward!
												</>
											) : (
												"Log in daily to earn bonus VTS tokens. Your streak starts today!"
											)}
										</p>
									</div>
								</div>
							</div>

							{/* Missions/Tasks Section */}
							<div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-0 gap-4">
									<h2 className="text-lg font-medium text-slate-800">
										Available Missions
									</h2>
									<div className="flex bg-slate-100 rounded-lg overflow-hidden w-full sm:w-auto">
										<button
											onClick={() =>
												setMissionTab("General")
											}
											className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium transition ${
												missionTab === "General"
													? "bg-[#113c5e] text-white"
													: "bg-transparent text-slate-600 hover:text-slate-800"
											}`}
										>
											General
										</button>
									</div>
								</div>

								<div className="p-6 space-y-4">
									{/* Daily VeriNest Task */}
									<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-slate-50 gap-2 sm:gap-0 border border-slate-200">
										<div className="flex-1">
											<span className="text-slate-800 text-sm font-medium">
												Daily VeriNest Twitter/Community
												Task
											</span>
											<p className="text-slate-500 text-xs mt-1">
												Earn 5 VTS for engaging with our
												community
											</p>
										</div>
										<button
											onClick={handleTwitterMission}
											disabled={completedMissions.includes(
												"twitter"
											)}
											className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
												completedMissions.includes(
													"twitter"
												)
													? "bg-green-100 text-green-700 cursor-not-allowed"
													: "bg-blue-100 text-blue-700 hover:bg-blue-200"
											}`}
										>
											{completedMissions.includes(
												"twitter"
											)
												? "Completed"
												: "Go"}
										</button>
									</div>

									{/* Real Estate Quiz */}
									<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-slate-50 gap-2 sm:gap-0 border border-slate-200">
										<div className="flex-1 flex items-center gap-3">
											<div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center">
												<svg
													className="w-3 h-3 text-slate-600"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
											<div>
												<span className="text-slate-800 text-sm font-medium">
													Real Estate Quiz
												</span>
												<p className="text-slate-500 text-xs mt-1">
													Test your knowledge and earn
													5 VTS
												</p>
											</div>
										</div>
										<button
											onClick={() => setIsQuizOpen(true)}
											disabled={completedMissions.includes(
												"quiz"
											)}
											className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
												completedMissions.includes(
													"quiz"
												)
													? "bg-green-100 text-green-700 cursor-not-allowed"
													: "bg-blue-100 text-blue-700 hover:bg-blue-200"
											}`}
										>
											{completedMissions.includes("quiz")
												? "Completed"
												: "Start"}
										</button>
									</div>
								</div>
							</div>

							{/* Recent Activity - Only show if missions completed */}
							{completedMissions.length > 0 && (
								<div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
									<div className="p-6 border-b border-slate-200">
										<h2 className="text-lg font-medium text-slate-800">
											Recent Activity
										</h2>
									</div>
									<div className="p-6 space-y-4">
										{completedMissions.includes(
											"twitter"
										) && (
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
														<svg
															className="w-5 h-5 text-green-600"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													</div>
													<div>
														<p className="text-sm font-medium text-slate-800">
															Task Completed
														</p>
														<p className="text-xs text-slate-500">
															Twitter Engagement
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="text-sm font-medium text-green-600">
														+5 VTS
													</p>
													<p className="text-xs text-slate-500">
														Today
													</p>
												</div>
											</div>
										)}

										{completedMissions.includes("quiz") && (
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
														<svg
															className="w-5 h-5 text-green-600"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													</div>
													<div>
														<p className="text-sm font-medium text-slate-800">
															Quiz Completed
														</p>
														<p className="text-xs text-slate-500">
															Real Estate Quiz
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="text-sm font-medium text-green-600">
														+5 VTS
													</p>
													<p className="text-xs text-slate-500">
														Today
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					) : (
						<ComingSoon tabName={activeTab} />
					)}
				</main>
			</div>

			{/* Twitter Mission Popup */}
			{isTwitterPopupOpen && (
				<TwitterMissionPopup
					onComplete={handleTwitterComplete}
					onClose={() => setIsTwitterPopupOpen(false)}
				/>
			)}

			{/* Real Estate Quiz Popup */}
			{isQuizOpen && (
				<RealEstateQuiz
					onComplete={handleQuizComplete}
					onClose={() => setIsQuizOpen(false)}
				/>
			)}
		</>
	);
}
