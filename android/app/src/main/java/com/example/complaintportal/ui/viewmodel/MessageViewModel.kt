package com.example.complaintportal.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.complaintportal.data.model.Message
import com.example.complaintportal.data.repository.MessageRepository
import com.squareup.moshi.Moshi
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.json.JSONObject

data class MessageState(
    val isLoading: Boolean = false,
    val messages: List<Message> = emptyList(),
    val error: String? = null
)

class MessageViewModel(
    private val repository: MessageRepository,
    private val cookieJar: com.example.complaintportal.data.remote.CookieJarImpl,
    private val moshi: Moshi
) : ViewModel() {

    private val _state = MutableStateFlow(MessageState())
    val state: StateFlow<MessageState> = _state.asStateFlow()

    private var socket: Socket? = null
    private val messageAdapter = moshi.adapter(Message::class.java)

    fun connectSocket(complaintId: String) {
        if (socket?.connected() == true) return

        try {
            val token = cookieJar.getToken()
            val opts = IO.Options()
            opts.auth = mapOf("token" to token)
            socket = IO.socket("https://nonadjacent-unsurnamed-lizabeth.ngrok-free.dev", opts)
            
            socket?.on(Socket.EVENT_CONNECT) {
                socket?.emit("joinComplaint", complaintId)
            }

            socket?.on("newMessage") { args ->
                if (args.isNotEmpty()) {
                    val data = args[0].toString()
                    try {
                        val newMessage = messageAdapter.fromJson(data)
                        if (newMessage != null) {
                            _state.update { currentState ->
                                // Avoid duplicate messages if socket and API fetch overlap
                                if (currentState.messages.any { it.id == newMessage.id }) {
                                    currentState
                                } else {
                                    currentState.copy(messages = currentState.messages + newMessage)
                                }
                            }
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
            socket?.connect()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun disconnectSocket() {
        socket?.disconnect()
        socket = null
    }

    fun loadMessages(complaintId: String) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }
            val result = repository.getMessages(complaintId)
            result.onSuccess { response ->
                if (response.success) {
                    _state.update { it.copy(
                        isLoading = false,
                        messages = response.messages ?: emptyList()
                    ) }
                } else {
                    _state.update { it.copy(isLoading = false, error = response.message) }
                }
            }.onFailure { error ->
                _state.update { it.copy(isLoading = false, error = error.message) }
            }
        }
    }

    fun sendMessage(complaintId: String, toUser: String, text: String) {
        val json = JSONObject()
        json.put("complaintId", complaintId)
        json.put("toUser", toUser)
        json.put("message", text)
        socket?.emit("sendMessage", json)
    }

    override fun onCleared() {
        super.onCleared()
        disconnectSocket()
    }
}

class MessageViewModelFactory(
    private val repository: MessageRepository,
    private val cookieJar: com.example.complaintportal.data.remote.CookieJarImpl,
    private val moshi: Moshi
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MessageViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return MessageViewModel(repository, cookieJar, moshi) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
