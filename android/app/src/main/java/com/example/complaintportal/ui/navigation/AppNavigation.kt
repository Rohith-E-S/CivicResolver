package com.example.complaintportal.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.complaintportal.di.AppContainer
import com.example.complaintportal.ui.screens.*
import com.example.complaintportal.ui.viewmodel.*

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Signup : Screen("signup")
    object Dashboard : Screen("dashboard")
    object Profile : Screen("profile")
    object CreateComplaint : Screen("create_complaint")
    object ComplaintDetail : Screen("complaint_detail/{complaintId}") {
        fun createRoute(complaintId: String) = "complaint_detail/$complaintId"
    }
    object Chat : Screen("chat/{complaintId}") {
        fun createRoute(complaintId: String) = "chat/$complaintId"
    }
}

@Composable
fun AppNavigation(
    navController: NavHostController = rememberNavController(),
    appContainer: AppContainer
) {
    val authViewModel: AuthViewModel = viewModel(
        factory = AuthViewModelFactory(appContainer.authRepository)
    )
    val complaintViewModel: ComplaintViewModel = viewModel(
        factory = ComplaintViewModelFactory(appContainer.complaintRepository)
    )
    val messageViewModel: MessageViewModel = viewModel(
        factory = MessageViewModelFactory(appContainer.messageRepository, appContainer.cookieJar, appContainer.moshi)
    )

    val authState by authViewModel.authState.collectAsState()

    if (authState.isChecking) {
        Surface(modifier = Modifier.fillMaxSize()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        }
    } else {
        NavHost(
            navController = navController,
            startDestination = if (authState.isAuthenticated) Screen.Dashboard.route else Screen.Login.route
        ) {
            composable(Screen.Login.route) {
                LoginScreen(
                    viewModel = authViewModel,
                    onNavigateToSignup = { navController.navigate(Screen.Signup.route) },
                    onLoginSuccess = {
                        navController.navigate(Screen.Dashboard.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Signup.route) {
                SignupScreen(
                    viewModel = authViewModel,
                    onNavigateToLogin = { navController.navigate(Screen.Login.route) },
                    onSignupSuccess = {
                        navController.navigate(Screen.Dashboard.route) {
                            popUpTo(Screen.Signup.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Dashboard.route) {
                if (authState.user?.isAdmin == true) {
                    AdminDashboardScreen(
                        viewModel = complaintViewModel,
                        onNavigateToDetail = { complaintId -> 
                            if (complaintId == "profile") {
                                navController.navigate(Screen.Profile.route)
                            } else {
                                navController.navigate(Screen.ComplaintDetail.createRoute(complaintId)) 
                            }
                        }
                    )
                } else {
                    UserDashboardScreen(
                        viewModel = complaintViewModel,
                        userName = authState.user?.fullName ?: "Citizen",
                        onNavigateToCreate = { navController.navigate(Screen.CreateComplaint.route) },
                        onNavigateToDetail = { complaintId -> 
                            if (complaintId == "profile") {
                                navController.navigate(Screen.Profile.route)
                            } else {
                                navController.navigate(Screen.ComplaintDetail.createRoute(complaintId)) 
                            }
                        }
                    )
                }
            }

            composable(Screen.Profile.route) {
                ProfileScreen(
                    viewModel = authViewModel,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(Screen.CreateComplaint.route) {
                CreateComplaintScreen(
                    viewModel = complaintViewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onSuccess = {
                        navController.navigate(Screen.Dashboard.route) {
                            popUpTo(Screen.Dashboard.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(
                route = Screen.ComplaintDetail.route,
                arguments = listOf(navArgument("complaintId") { type = NavType.StringType })
            ) { backStackEntry ->
                val complaintId = backStackEntry.arguments?.getString("complaintId") ?: ""
                ComplaintDetailScreen(
                    viewModel = complaintViewModel,
                    complaintId = complaintId,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToChat = { id -> navController.navigate(Screen.Chat.createRoute(id)) }
                )
            }

            composable(
                route = Screen.Chat.route,
                arguments = listOf(navArgument("complaintId") { type = NavType.StringType })
            ) { backStackEntry ->
                val complaintId = backStackEntry.arguments?.getString("complaintId") ?: ""
                ChatScreen(
                    messageViewModel = messageViewModel,
                    complaintViewModel = complaintViewModel,
                    complaintId = complaintId,
                    currentUserId = authState.user?.id ?: "",
                    isAdmin = authState.user?.isAdmin == true,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }
}
