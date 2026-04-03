package com.example.complaintportal.data.repository

import com.example.complaintportal.data.model.MessageListResponse
import com.example.complaintportal.data.remote.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class MessageRepository(private val apiService: ApiService) {

    suspend fun getMessages(complaintId: String): Result<MessageListResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getMessages(complaintId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(response.message()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
