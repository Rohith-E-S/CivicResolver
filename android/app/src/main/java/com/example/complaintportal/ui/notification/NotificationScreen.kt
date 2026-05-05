package com.example.complaintportal.ui.notification

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.complaintportal.data.notification.NotificationItem
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

// ── Theme colors (matched to app's NavyPrimary/TealAccent palette) ────────────
private val NavyPrimary = Color(0xFF1A3A6E)
private val BgLight     = Color(0xFFF2F4F8)
private val CardWhite   = Color(0xFFFFFFFF)
private val TextPrimary = Color(0xFF0D2247)
private val TextSecond  = Color(0xFF6A7F9A)
private val UnreadBg    = Color(0xFFEEF4FF)

// ── Bell icon with animated red badge — drop into any TopBar ─────────────────
@Composable
fun NotificationBell(
    unreadCount: Int,
    onClick:     () -> Unit,
    modifier:    Modifier = Modifier,
) {
    val shake = remember { Animatable(0f) }
    LaunchedEffect(unreadCount) {
        if (unreadCount > 0) {
            repeat(3) {
                shake.animateTo(6f,  animationSpec = tween(60))
                shake.animateTo(-6f, animationSpec = tween(60))
            }
            shake.animateTo(0f, animationSpec = tween(60))
        }
    }

    Box(
        modifier = modifier
            .size(46.dp)
            .clickable { onClick() },
        contentAlignment = Alignment.Center,
    ) {
        // Background as separate element to avoid clipping the badge
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clip(CircleShape)
                .background(NavyPrimary.copy(alpha = 0.08f))
        )

        Icon(
            imageVector        = Icons.Default.Notifications,
            contentDescription = "Notifications",
            tint               = NavyPrimary,
            modifier           = Modifier.size(22.dp).offset(x = shake.value.dp),
        )

        AnimatedVisibility(
            visible  = unreadCount > 0,
            enter    = scaleIn() + fadeIn(),
            exit     = scaleOut() + fadeOut(),
            modifier = Modifier
                .align(Alignment.TopEnd)
                .offset(x = 4.dp, y = (-4).dp),
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .sizeIn(minWidth = 16.dp, minHeight = 16.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFE53935))
                    .padding(horizontal = 3.dp),
            ) {
                Text(
                    text       = if (unreadCount > 99) "99+" else unreadCount.toString(),
                    color      = Color.White,
                    fontSize   = 9.sp,
                    fontWeight = FontWeight.Bold,
                )
            }
        }
    }
}

// ── Full Notification Screen ──────────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationScreen(
    viewModel:        NotificationViewModel,
    onBack:           () -> Unit,
    onComplaintClick: (String) -> Unit,
    onChatClick:      (String) -> Unit = {},
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) { viewModel.markAllRead() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("Notifications", fontWeight = FontWeight.SemiBold, color = TextPrimary)
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = NavyPrimary)
                    }
                },
                actions = {
                    if (uiState.notifications.isNotEmpty()) {
                        TextButton(onClick = { viewModel.clearAll() }) {
                            Text("Clear all", color = Color(0xFFE53935), fontSize = 13.sp)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BgLight),
            )
        },
        containerColor = BgLight,
    ) { padding ->
        when {
            uiState.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = NavyPrimary)
            }
            uiState.notifications.isEmpty() -> EmptyNotifications(Modifier.padding(padding))
            else -> LazyColumn(
                modifier            = Modifier.padding(padding).fillMaxSize(),
                contentPadding      = PaddingValues(vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                items(items = uiState.notifications, key = { it.id }) { notification ->
                    NotificationCard(
                        notification = notification,
                        onClick = {
                            viewModel.markOneRead(notification.id)
                            notification.complaintId?.let { id ->
                                if (notification.type == "admin_comment") {
                                    onChatClick(id)
                                } else {
                                    onComplaintClick(id)
                                }
                            }
                        },
                    )
                }
            }
        }
    }
}

// ── Individual card ───────────────────────────────────────────────────────────
@Composable
private fun NotificationCard(notification: NotificationItem, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(if (notification.isRead) CardWhite else UnreadBg)
            .clickable { onClick() }
            .padding(14.dp),
        verticalAlignment     = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(40.dp).clip(CircleShape).background(notification.iconBgColor()),
        ) {
            Icon(notification.icon(), contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
        }

        Column(modifier = Modifier.weight(1f)) {
            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(
                    text       = notification.title,
                    fontWeight = if (notification.isRead) FontWeight.Normal else FontWeight.SemiBold,
                    fontSize   = 14.sp,
                    color      = TextPrimary,
                    modifier   = Modifier.weight(1f),
                )
                Text(notification.timeAgo(), fontSize = 11.sp, color = TextSecond)
            }
            Spacer(Modifier.height(2.dp))
            Text(
                text     = notification.message,
                fontSize = 12.sp,
                color    = TextSecond,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
            if (!notification.isRead) {
                Spacer(Modifier.height(6.dp))
                Box(Modifier.size(6.dp).clip(CircleShape).background(NavyPrimary))
            }
        }
    }
}

// ── Empty state ───────────────────────────────────────────────────────────────
@Composable
private fun EmptyNotifications(modifier: Modifier = Modifier) {
    Column(
        modifier            = modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(80.dp).clip(CircleShape).background(NavyPrimary.copy(alpha = 0.08f)),
        ) {
            Icon(Icons.Default.NotificationsNone, contentDescription = null, tint = NavyPrimary, modifier = Modifier.size(36.dp))
        }
        Spacer(Modifier.height(16.dp))
        Text("You're all caught up!", fontWeight = FontWeight.SemiBold, fontSize = 16.sp, color = TextPrimary)
        Spacer(Modifier.height(6.dp))
        Text(
            text       = "Notifications about your reports\nwill appear here.",
            fontSize   = 13.sp,
            color      = TextSecond,
            textAlign  = TextAlign.Center,
            lineHeight = 20.sp,
        )
    }
}

// ── Extension helpers ─────────────────────────────────────────────────────────
private fun NotificationItem.icon(): ImageVector = when (type) {
    "status_changed"  -> Icons.Default.Autorenew
    "upvoted"         -> Icons.Default.ThumbUp
    "admin_comment"   -> Icons.Default.Comment
    "new_in_district" -> Icons.Default.LocationOn
    else              -> Icons.Default.Notifications
}

private fun NotificationItem.iconBgColor(): Color = when (type) {
    "status_changed"  -> Color(0xFF1A3A6E)
    "upvoted"         -> Color(0xFF1D9E75)
    "admin_comment"   -> Color(0xFFE67E22)
    "new_in_district" -> Color(0xFF8E44AD)
    else              -> Color(0xFF6A7F9A)
}

private fun NotificationItem.timeAgo(): String = try {
    val instant = Instant.parse(createdAt)
    val now     = Instant.now()
    val mins    = ChronoUnit.MINUTES.between(instant, now)
    val hours   = ChronoUnit.HOURS.between(instant, now)
    val days    = ChronoUnit.DAYS.between(instant, now)
    when {
        mins  < 1  -> "Just now"
        mins  < 60 -> "${mins}m ago"
        hours < 24 -> "${hours}h ago"
        days  < 7  -> "${days}d ago"
        else       -> DateTimeFormatter.ofPattern("MMM d").withZone(ZoneId.systemDefault()).format(instant)
    }
} catch (_: Exception) { "" }
