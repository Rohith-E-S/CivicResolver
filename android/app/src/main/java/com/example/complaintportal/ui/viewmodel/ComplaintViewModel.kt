package com.example.complaintportal.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.complaintportal.data.model.Complaint
import com.example.complaintportal.data.repository.ComplaintRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import okhttp3.MultipartBody
import okhttp3.RequestBody

data class ComplaintState(
    val isLoading: Boolean = false,
    val newComplaints: List<Complaint> = emptyList(),
    val inProgressComplaints: List<Complaint> = emptyList(),
    val resolvedComplaints: List<Complaint> = emptyList(),
    val currentComplaint: Complaint? = null,
    val error: String? = null
)

class ComplaintViewModel(private val repository: ComplaintRepository) : ViewModel() {

    private val _state = MutableStateFlow(ComplaintState())
    val state: StateFlow<ComplaintState> = _state.asStateFlow()

    fun fetchUserComplaints() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            val result = repository.getMyComplaints()
            result.onSuccess { response ->
                if (response.success) {
                    val complaints = response.complaints ?: emptyList()
                    _state.value = _state.value.copy(
                        isLoading = false,
                        newComplaints = complaints.filter { it.status.lowercase() == "new" },
                        inProgressComplaints = complaints.filter { it.status.lowercase() == "in progress" },
                        resolvedComplaints = complaints.filter { it.status.lowercase() == "resolved" }
                    )
                } else {
                    _state.value = _state.value.copy(isLoading = false, error = response.message)
                }
            }.onFailure {
                _state.value = _state.value.copy(isLoading = false, error = it.message)
            }
        }
    }

    fun fetchAdminComplaints() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            val result = repository.getAllComplaints()
            result.onSuccess { response ->
                if (response.success) {
                    val data = response.complaints
                    _state.value = _state.value.copy(
                        isLoading = false,
                        newComplaints = data?.newComplaint ?: emptyList(),
                        inProgressComplaints = data?.inProgressComplaint ?: emptyList(),
                        resolvedComplaints = data?.resolvedComplaint ?: emptyList()
                    )
                } else {
                    _state.value = _state.value.copy(isLoading = false, error = response.message)
                }
            }.onFailure {
                _state.value = _state.value.copy(isLoading = false, error = it.message)
            }
        }
    }

    fun createComplaint(
        description: RequestBody,
        latitude: RequestBody,
        longitude: RequestBody,
        city: RequestBody,
        stateBody: RequestBody,
        landmark: RequestBody,
        imageUrl: MultipartBody.Part?,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            val result = repository.createComplaint(
                description, latitude, longitude, city, stateBody, landmark, imageUrl
            )
            result.onSuccess { response ->
                if (response.success) {
                    _state.value = _state.value.copy(isLoading = false)
                    onSuccess()
                } else {
                    _state.value = _state.value.copy(isLoading = false, error = response.message)
                }
            }.onFailure {
                _state.value = _state.value.copy(isLoading = false, error = it.message)
            }
        }
    }

    fun fetchComplaint(id: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            val result = repository.getComplaint(id)
            result.onSuccess { response ->
                if (response.success) {
                    _state.value = _state.value.copy(isLoading = false, currentComplaint = response.complaint)
                } else {
                    _state.value = _state.value.copy(isLoading = false, error = response.message)
                }
            }.onFailure {
                _state.value = _state.value.copy(isLoading = false, error = it.message)
            }
        }
    }

    fun updateComplaintStatus(id: String, status: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            val result = repository.updateComplaintStatus(id, status)
            result.onSuccess { response ->
                if (response.success) {
                    _state.value = _state.value.copy(isLoading = false, currentComplaint = response.complaint)
                    onSuccess()
                } else {
                    _state.value = _state.value.copy(isLoading = false, error = response.message)
                }
            }.onFailure {
                _state.value = _state.value.copy(isLoading = false, error = it.message)
            }
        }
    }
}

class ComplaintViewModelFactory(private val repository: ComplaintRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ComplaintViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return ComplaintViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
