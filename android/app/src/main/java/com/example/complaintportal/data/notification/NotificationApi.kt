package com.example.complaintportal.data.notification

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import retrofit2.Response
import retrofit2.http.*

// ── Data Models ───────────────────────────────────────────────────────────────

@JsonClass(generateAdapter = true)
data class NotificationItem(
    @Json(name = "_id")         val id:          String,
    @Json(name = "userId")      val userId:      String,
    @Json(name = "type")        val type:        String,
    @Json(name = "title")       val title:       String,
    @Json(name = "message")     val message:     String,
    @Json(name = "complaintId") val complaintId: String?,
    @Json(name = "isRead")      val isRead:      Boolean,
    @Json(name = "createdAt")   val createdAt:   String,
)

@JsonClass(generateAdapter = true)
data class NotificationsResponse(
    @Json(name = "success")       val success:       Boolean,
    @Json(name = "notifications") val notifications: List<NotificationItem>,
    @Json(name = "unreadCount")   val unreadCount:   Int,
)

@JsonClass(generateAdapter = true)
data class UnreadCountResponse(
    @Json(name = "success")     val success:     Boolean,
    @Json(name = "unreadCount") val unreadCount: Int,
)

@JsonClass(generateAdapter = true)
data class GenericResponse(
    @Json(name = "success") val success: Boolean,
    @Json(name = "message") val message: String? = null,
)

// ── Retrofit Interface ────────────────────────────────────────────────────────

interface NotificationApiService {

    @GET("notifications/{userId}")
    suspend fun getNotifications(
        @Path("userId") userId: String,
        @Query("limit") limit: Int = 20,
        @Query("skip")  skip:  Int = 0,
    ): Response<NotificationsResponse>

    @GET("notifications/{userId}/unread-count")
    suspend fun getUnreadCount(
        @Path("userId") userId: String,
    ): Response<UnreadCountResponse>

    @PATCH("notifications/{userId}/read-all")
    suspend fun markAllRead(
        @Path("userId") userId: String,
    ): Response<GenericResponse>

    @PATCH("notifications/{id}/read")
    suspend fun markOneRead(
        @Path("id") notificationId: String,
    ): Response<GenericResponse>

    @DELETE("notifications/{userId}")
    suspend fun clearAll(
        @Path("userId") userId: String,
    ): Response<GenericResponse>

    @DELETE("notifications/{id}/delete")
    suspend fun deleteNotification(
        @Path("id") notificationId: String,
    ): Response<GenericResponse>
}
