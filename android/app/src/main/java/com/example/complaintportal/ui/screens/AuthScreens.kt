package com.example.complaintportal.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.res.painterResource
import com.example.complaintportal.R
import coil.compose.rememberAsyncImagePainter
import com.example.complaintportal.data.model.CreateAccountRequest
import com.example.complaintportal.data.model.GoogleLoginRequest
import com.example.complaintportal.data.model.LoginRequest
import com.example.complaintportal.ui.viewmodel.AuthViewModel
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.auth.api.signin.GoogleSignInStatusCodes
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.CommonStatusCodes

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    viewModel: AuthViewModel,
    onNavigateToSignup: () -> Unit,
    onNavigateToForgotPassword: () -> Unit,
    onLoginSuccess: () -> Unit
) {
    val state by viewModel.authState.collectAsState()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val webClientId = remember(context) { context.getString(R.string.google_web_client_id).trim() }

    // Google Sign-In setup
    val googleGsoWithIdToken = remember(webClientId) { buildGoogleSignInOptions(webClientId) }
    val googleGsoBasic = remember { buildGoogleSignInOptions(null) }
    val googleSignInClientWithIdToken = remember(context, googleGsoWithIdToken) {
        GoogleSignIn.getClient(context, googleGsoWithIdToken)
    }
    val googleSignInClientBasic = remember(context, googleGsoBasic) {
        GoogleSignIn.getClient(context, googleGsoBasic)
    }
    var launchedWithIdToken by remember { mutableStateOf(false) }
    var retryWithoutIdToken by remember { mutableStateOf(false) }

    val googleSignInLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
        try {
            val account = task.getResult(ApiException::class.java)
            val googleRequest = account.toGoogleLoginRequest()
            if (googleRequest == null) {
                viewModel.setError("Google sign in failed: missing account details")
                return@rememberLauncherForActivityResult
            }
            viewModel.googleLogin(googleRequest, onLoginSuccess)
            launchedWithIdToken = false
        } catch (e: ApiException) {
            if (e.statusCode == CommonStatusCodes.DEVELOPER_ERROR && launchedWithIdToken) {
                retryWithoutIdToken = true
                launchedWithIdToken = false
            } else {
                viewModel.setError(e.toGoogleAuthMessage(launchedWithIdToken))
                launchedWithIdToken = false
            }
        }
    }

    LaunchedEffect(retryWithoutIdToken) {
        if (retryWithoutIdToken) {
            retryWithoutIdToken = false
            viewModel.setError("Retrying Google sign in with basic account flow...")
            googleSignInLauncher.launch(googleSignInClientBasic.signInIntent)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(64.dp))
        
        // Help Button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.surfaceVariant),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.HelpOutline, contentDescription = "Help", tint = MaterialTheme.colorScheme.outline)
            }
        }
        
        Spacer(modifier = Modifier.height(48.dp))

        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Welcome back",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Sign in to continue your civic journey.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Email Field
        Column(modifier = Modifier.fillMaxWidth()) {
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Email") },
                leadingIcon = { Icon(Icons.Default.MailOutline, contentDescription = null) },
                shape = CircleShape,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
                )
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Password Field
        Column(modifier = Modifier.fillMaxWidth()) {
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Password") },
                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                trailingIcon = {
                    val icon = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(icon, contentDescription = "Toggle password visibility")
                    }
                },
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                shape = CircleShape,
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
                )
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            TextButton(onClick = onNavigateToForgotPassword) {
                Text(
                    text = "Forgot Password?",
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { viewModel.login(LoginRequest(email, password), onLoginSuccess) },
            modifier = Modifier.fillMaxWidth().height(56.dp),
            shape = CircleShape,
            enabled = !state.isLoading
        ) {
            Text(if (state.isLoading) "Loading..." else "Sign In", fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(
            onClick = onNavigateToSignup,
            modifier = Modifier.fillMaxWidth().height(56.dp),
            shape = CircleShape,
            colors = ButtonDefaults.textButtonColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                contentColor = MaterialTheme.colorScheme.primary
            )
        ) {
            Text("Create Account", fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Digital ID Divider
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp)) {
            HorizontalDivider(modifier = Modifier.weight(1f), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f))
            Text(
                text = "DIGITAL ID",
                modifier = Modifier.padding(horizontal = 16.dp),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.outline,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp
            )
            HorizontalDivider(modifier = Modifier.weight(1f), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f))
        }

        // Social Logins
        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            // Google Login
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.surface)
                    .border(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.15f), CircleShape)
                    .clickable(enabled = !state.isLoading) {
                        val useIdToken = webClientId.isNotBlank()
                        launchedWithIdToken = useIdToken
                        val client = if (useIdToken) googleSignInClientWithIdToken else googleSignInClientBasic
                        googleSignInLauncher.launch(client.signInIntent)
                    },
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.ic_google_logo),
                    contentDescription = "Google",
                    modifier = Modifier.size(24.dp)
                )
            }
            
            // Apple Placeholder
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.surface)
                    .border(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.15f), CircleShape)
                    .clickable { /* TODO */ },
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = rememberAsyncImagePainter("https://lh3.googleusercontent.com/aida-public/AB6AXuB4eAOap7Ow9ur_zDnustA9xwT26iYwT7b6vEDZ7Ss33Di39L8SRfAQmLalL6kQWVnf8hWJtoJD41cPtR1F5nDCfue2TUYAfV6qGHa01kQiEkgbyMe6afm1qRpU0wQdSQxRwVUGDrqY50ashIVxgAnEmndY9rfQzuJRN9KzNx505z1WSf2Uvf8JfobiyfRRU97Bc0lQ4Sfw0QYU6VlmexbX6EKhOFtDFDA4wG4qaiRMwO0BAyyzw7vDKimF1G8YX9WIejzdWeyJq_Dv"),
                    contentDescription = "Apple",
                    modifier = Modifier.size(24.dp)
                )
            }
        }

        if (state.error != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = state.error!!, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignupScreen(
    viewModel: AuthViewModel,
    onNavigateToLogin: () -> Unit,
    onNavigateToOtpVerify: (String) -> Unit,
    onSignupSuccess: () -> Unit
) {
    val state by viewModel.authState.collectAsState()
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val webClientId = remember(context) { context.getString(R.string.google_web_client_id).trim() }

    // Google Sign-In setup
    val googleGsoWithIdToken = remember(webClientId) { buildGoogleSignInOptions(webClientId) }
    val googleGsoBasic = remember { buildGoogleSignInOptions(null) }
    val googleSignInClientWithIdToken = remember(context, googleGsoWithIdToken) {
        GoogleSignIn.getClient(context, googleGsoWithIdToken)
    }
    val googleSignInClientBasic = remember(context, googleGsoBasic) {
        GoogleSignIn.getClient(context, googleGsoBasic)
    }
    var launchedWithIdToken by remember { mutableStateOf(false) }
    var retryWithoutIdToken by remember { mutableStateOf(false) }

    val googleSignInLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
        try {
            val account = task.getResult(ApiException::class.java)
            val googleRequest = account.toGoogleLoginRequest()
            if (googleRequest == null) {
                viewModel.setError("Google sign in failed: missing account details")
                return@rememberLauncherForActivityResult
            }
            viewModel.googleLogin(googleRequest, onSignupSuccess)
            launchedWithIdToken = false
        } catch (e: ApiException) {
            if (e.statusCode == CommonStatusCodes.DEVELOPER_ERROR && launchedWithIdToken) {
                retryWithoutIdToken = true
                launchedWithIdToken = false
            } else {
                viewModel.setError(e.toGoogleAuthMessage(launchedWithIdToken))
                launchedWithIdToken = false
            }
        }
    }

    LaunchedEffect(retryWithoutIdToken) {
        if (retryWithoutIdToken) {
            retryWithoutIdToken = false
            viewModel.setError("Retrying Google sign in with basic account flow...")
            googleSignInLauncher.launch(googleSignInClientBasic.signInIntent)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(32.dp))
        
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Complete Profile",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Last step to join your community.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = fullName,
            onValueChange = { fullName = it },
            label = { Text("Full Name") },
            modifier = Modifier.fillMaxWidth(),
            shape = CircleShape,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface
            )
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            placeholder = { Text("Email") },
            modifier = Modifier.fillMaxWidth(),
            shape = CircleShape,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface
            )
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = address,
            onValueChange = { address = it },
            label = { Text("Residential Address") },
            modifier = Modifier.fillMaxWidth(),
            trailingIcon = { Icon(Icons.Default.LocationOn, contentDescription = null) },
            shape = CircleShape,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            placeholder = { Text("Password") },
            modifier = Modifier.fillMaxWidth(),
            trailingIcon = {
                val icon = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility
                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                    Icon(icon, contentDescription = "Toggle password visibility")
                }
            },
            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
            shape = CircleShape,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface
            )
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = {
                if (fullName.isNotBlank() && email.isNotBlank() && password.isNotBlank() && address.isNotBlank()) {
                    viewModel.pendingSignupRequest = CreateAccountRequest(fullName, email, password, address)
                    viewModel.sendOtp(email) {
                        onNavigateToOtpVerify(email)
                    }
                } else {
                    viewModel.setError("Please fill all fields")
                }
            },
            modifier = Modifier.fillMaxWidth().height(56.dp),
            shape = CircleShape,
            enabled = !state.isLoading
        ) {
            Text(if (state.isLoading) "Sending OTP..." else "Continue with email", fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
            HorizontalDivider(modifier = Modifier.weight(1f), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f))
            Text(
                text = "OR",
                modifier = Modifier.padding(horizontal = 16.dp),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.outline,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            HorizontalDivider(modifier = Modifier.weight(1f), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f))
        }

        Spacer(modifier = Modifier.height(8.dp))

        Box(
            modifier = Modifier
                .size(56.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.15f), CircleShape)
                .clickable(enabled = !state.isLoading) {
                    val useIdToken = webClientId.isNotBlank()
                    launchedWithIdToken = useIdToken
                    val client = if (useIdToken) googleSignInClientWithIdToken else googleSignInClientBasic
                    googleSignInLauncher.launch(client.signInIntent)
                },
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(id = R.drawable.ic_google_logo),
                contentDescription = "Google",
                modifier = Modifier.size(24.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(
            onClick = onNavigateToLogin,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Already have an account? Login", color = MaterialTheme.colorScheme.primary)
        }

        if (state.error != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = state.error!!, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }
    }
}

private fun GoogleSignInAccount.toGoogleLoginRequest(): GoogleLoginRequest? {
    val emailValue = email?.trim().orEmpty()
    if (emailValue.isBlank()) return null

    val googleIdValue = id?.trim().orEmpty().ifBlank { emailValue }
    val fullNameValue = displayName?.trim().orEmpty().ifBlank { emailValue.substringBefore("@") }

    return GoogleLoginRequest(
        email = emailValue,
        fullName = fullNameValue,
        profilePic = photoUrl?.toString(),
        googleId = googleIdValue
    )
}

private fun ApiException.toGoogleAuthMessage(wasUsingIdToken: Boolean): String {
    return when (statusCode) {
        GoogleSignInStatusCodes.SIGN_IN_CANCELLED -> "Google sign in was cancelled"
        GoogleSignInStatusCodes.SIGN_IN_FAILED -> "Google sign in failed. Please try again."
        CommonStatusCodes.NETWORK_ERROR -> "Network error during Google sign in"
        CommonStatusCodes.DEVELOPER_ERROR -> {
            if (wasUsingIdToken) {
                "Google OAuth Web client mismatch. Verify google_web_client_id belongs to this Firebase project."
            } else {
                "Google sign in config mismatch. Add app SHA-1/SHA-256, keep package name com.example.complaintportal, and ensure the Android OAuth client matches this build signature."
            }
        }
        else -> "Google sign in failed: $statusCode"
    }
}

private fun buildGoogleSignInOptions(webClientId: String?): GoogleSignInOptions {
    return GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
        .requestEmail()
        .requestProfile()
        .apply {
            if (!webClientId.isNullOrBlank()) {
                requestIdToken(webClientId)
            }
        }
        .build()
}

enum class ForgotPasswordStep {
    ENTER_EMAIL, ENTER_OTP, ENTER_NEW_PASSWORD
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ForgotPasswordScreen(
    viewModel: AuthViewModel,
    onNavigateBack: () -> Unit,
    onPasswordResetSuccess: () -> Unit
) {
    val state by viewModel.authState.collectAsState()
    var currentStep by remember { mutableStateOf(ForgotPasswordStep.ENTER_EMAIL) }
    
    var email by remember { mutableStateOf("") }
    var otp by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var resetToken by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(32.dp))
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onNavigateBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Text(
                text = "Forgot Password",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        when (currentStep) {
            ForgotPasswordStep.ENTER_EMAIL -> {
                Text(
                    text = "Enter your email address to receive a password reset OTP.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(24.dp))
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Email") },
                    leadingIcon = { Icon(Icons.Default.MailOutline, contentDescription = null) },
                    shape = CircleShape,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface
                    )
                )
                Spacer(modifier = Modifier.height(32.dp))
                Button(
                    onClick = {
                        if (email.isNotBlank()) {
                            viewModel.sendPasswordResetOtp(email) {
                                currentStep = ForgotPasswordStep.ENTER_OTP
                            }
                        } else {
                            viewModel.setError("Please enter your email")
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = CircleShape,
                    enabled = !state.isLoading
                ) {
                    Text(if (state.isLoading) "Sending OTP..." else "Send OTP", fontWeight = FontWeight.Bold)
                }
            }
            ForgotPasswordStep.ENTER_OTP -> {
                Text(
                    text = "Enter the OTP sent to $email",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(24.dp))
                OutlinedTextField(
                    value = otp,
                    onValueChange = { otp = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Enter OTP") },
                    shape = CircleShape,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface
                    )
                )
                Spacer(modifier = Modifier.height(32.dp))
                Button(
                    onClick = {
                        if (otp.isNotBlank()) {
                            viewModel.verifyPasswordResetOtp(email, otp) { token ->
                                resetToken = token
                                currentStep = ForgotPasswordStep.ENTER_NEW_PASSWORD
                            }
                        } else {
                            viewModel.setError("Please enter the OTP")
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = CircleShape,
                    enabled = !state.isLoading
                ) {
                    Text(if (state.isLoading) "Verifying..." else "Verify OTP", fontWeight = FontWeight.Bold)
                }
            }
            ForgotPasswordStep.ENTER_NEW_PASSWORD -> {
                Text(
                    text = "Create a new password.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(24.dp))
                OutlinedTextField(
                    value = newPassword,
                    onValueChange = { newPassword = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("New Password") },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                    trailingIcon = {
                        val icon = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(icon, contentDescription = "Toggle password visibility")
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    shape = CircleShape,
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface
                    )
                )
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Confirm New Password") },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                    visualTransformation = PasswordVisualTransformation(),
                    shape = CircleShape,
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface
                    )
                )
                Spacer(modifier = Modifier.height(32.dp))
                Button(
                    onClick = {
                        if (newPassword == confirmPassword && newPassword.isNotBlank()) {
                            viewModel.resetPassword(
                                com.example.complaintportal.data.model.ResetPasswordRequest(newPassword, resetToken)
                            ) {
                                onPasswordResetSuccess()
                            }
                        } else {
                            viewModel.setError("Passwords do not match or are empty")
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = CircleShape,
                    enabled = !state.isLoading
                ) {
                    Text(if (state.isLoading) "Resetting..." else "Reset Password", fontWeight = FontWeight.Bold)
                }
            }
        }

        if (state.error != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = state.error!!, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OtpVerifyScreen(
    viewModel: AuthViewModel,
    email: String,
    onNavigateBack: () -> Unit,
    onVerifySuccess: () -> Unit
) {
    val state by viewModel.authState.collectAsState()
    var otp by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(32.dp))
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onNavigateBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Text(
                text = "Verify Email",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            text = "Enter the 6-digit OTP sent to $email",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        OutlinedTextField(
            value = otp,
            onValueChange = { otp = it },
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("Enter OTP") },
            shape = CircleShape,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface
            )
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(
            onClick = {
                if (otp.isNotBlank()) {
                    viewModel.verifyOtp(email, otp) {
                        val request = viewModel.pendingSignupRequest
                        if (request != null) {
                            viewModel.createAccount(request, onVerifySuccess)
                        } else {
                            viewModel.setError("Session expired. Please try signing up again.")
                        }
                    }
                } else {
                    viewModel.setError("Please enter the OTP")
                }
            },
            modifier = Modifier.fillMaxWidth().height(56.dp),
            shape = CircleShape,
            enabled = !state.isLoading
        ) {
            Text(if (state.isLoading) "Verifying..." else "Verify Account", fontWeight = FontWeight.Bold)
        }

        if (state.error != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = state.error!!, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }
    }
}
