package com.example.complaintportal.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.complaintportal.data.model.CreateAccountRequest
import com.example.complaintportal.data.model.GoogleLoginRequest
import com.example.complaintportal.data.model.LoginRequest
import com.example.complaintportal.data.model.User
import com.example.complaintportal.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class AuthState(
    val isChecking: Boolean = true,
    val isLoading: Boolean = false,
    val isAuthenticated: Boolean = false,
    val user: User? = null,
    val error: String? = null
)

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {

    private val _authState = MutableStateFlow(AuthState())
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    init {
        checkAuth()
    }

    fun checkAuth() {
        viewModelScope.launch {
            _authState.value = _authState.value.copy(isChecking = true, error = null)
            val result = repository.checkAuth()
            result.onSuccess { response ->
                if (response.success && response.user != null) {
                    _authState.value = _authState.value.copy(
                        isChecking = false,
                        isAuthenticated = true,
                        user = response.user
                    )
                } else {
                    _authState.value = _authState.value.copy(
                        isChecking = false,
                        isAuthenticated = false
                    )
                }
            }.onFailure {
                _authState.value = _authState.value.copy(
                    isChecking = false,
                    isAuthenticated = false
                )
            }
        }
    }

    fun login(request: LoginRequest, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _authState.value = _authState.value.copy(isLoading = true, error = null)
            val result = repository.login(request)
            result.onSuccess { response ->
                if (response.success) {
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        isAuthenticated = true,
                        user = response.user
                    )
                    onSuccess()
                } else {
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        error = response.message ?: "Login failed"
                    )
                }
            }.onFailure { e ->
                _authState.value = _authState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Login failed"
                )
            }
        }
    }

    fun googleLogin(request: GoogleLoginRequest, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _authState.value = _authState.value.copy(isLoading = true, error = null)
            val result = repository.googleLogin(request)
            result.onSuccess { response ->
                if (response.success) {
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        isAuthenticated = true,
                        user = response.user
                    )
                    onSuccess()
                } else {
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        error = response.message ?: "Google login failed"
                    )
                }
            }.onFailure { e ->
                _authState.value = _authState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Google login failed"
                )
            }
        }
    }

    fun createAccount(request: CreateAccountRequest, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _authState.value = _authState.value.copy(isLoading = true, error = null)
            val result = repository.createAccount(request)
            result.onSuccess { response ->
                if (response.success) {
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        isAuthenticated = true,
                        user = response.user
                    )
                    onSuccess()
                } else {
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        error = response.message ?: "Signup failed"
                    )
                }
            }.onFailure { e ->
                _authState.value = _authState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Signup failed"
                )
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            _authState.value = _authState.value.copy(isLoading = true)
            repository.logout()
            _authState.value = AuthState(isChecking = false)
        }
    }
}

class AuthViewModelFactory(private val repository: AuthRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AuthViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AuthViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
