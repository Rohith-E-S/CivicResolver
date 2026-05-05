package com.example.complaintportal.ui.screens.user

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.*
import androidx.compose.ui.graphics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.*
import com.example.complaintportal.data.model.AiAnalysisResult
import com.example.complaintportal.data.model.IssueCategory
import kotlinx.coroutines.delay

// ── Colors ────────────────────────────────────────────────────────────────────
private val NavyPrimary   = Color(0xFF1A3A6E)
private val NavyDark      = Color(0xFF0D2247)
private val TealAccent    = Color(0xFF7ECFC0)
private val BgLight       = Color(0xFFF2F4F8)
private val CardWhite     = Color(0xFFFFFFFF)
private val TextPrimary   = Color(0xFF0D2247)
private val TextSecondary = Color(0xFF6A7F9A)
private val GreenSuccess  = Color(0xFF1D9E75)
private val DangerRed     = Color(0xFFE53935)
private val DividerColor  = Color(0xFFE8EDF5)

// ── Data ──────────────────────────────────────────────────────────────────────
val issueCategories = listOf(
    IssueCategory("road_damage",      "Pothole",      "🕳️", Color(0xFF795548)),
    IssueCategory("garbage_issue",    "Garbage",      "🗑️", Color(0xFF388E3C)),
    IssueCategory("electricity_issue", "Electricity",  "⚡", Color(0xFFF57F17)),
    IssueCategory("water_leakage",     "Water Leak",   "💧", Color(0xFF1565C0)),
    IssueCategory("drainage_problem", "Drainage",     "🌊", Color(0xFF00796B)),
    IssueCategory("accident",          "Traffic/Accident", "🚦", Color(0xFFD84315)),
    IssueCategory("tree_fallen",       "Tree Fallen",  "🌳", Color(0xFF2E7D32)),
    IssueCategory("noise_issue",       "Noise",        "📢", Color(0xFF6A1B9A)),
    IssueCategory("fire",              "Fire",         "🔥", Color(0xFFC62828)),
    IssueCategory("other",             "Other",        "📦", Color(0xFF546E7A)),
)



// ── AI Flow Controller ────────────────────────────────────────────────────────
@Composable
fun AiAnalysisFlow(
    aiResult:  AiAnalysisResult?,        // null = still loading

    isSubmitting: Boolean,               // true if createComplaint is in progress
    error: String?,                      // error message from ViewModel
    onConfirm: (String) -> Unit,         // called with final category id
    onDismiss: () -> Unit,               // called if user cancels
    onSuccess: () -> Unit,               // called after success screen
) {
    var flowState by remember { mutableStateOf(AiFlowState.LOADING) }
    var finalCategory by remember { mutableStateOf("") }
    var showPicker by remember { mutableStateOf(false) }

    // Transition from LOADING → RESULT when aiResult arrives
    LaunchedEffect(aiResult) {
        if (aiResult != null && flowState == AiFlowState.LOADING) {
            delay(600)
            flowState = AiFlowState.RESULT
        }
    }

    // Transition from SUBMITTING → SUCCESS when submission completes
    LaunchedEffect(isSubmitting) {
        if (!isSubmitting && flowState == AiFlowState.SUBMITTING && error == null) {
            flowState = AiFlowState.SUCCESS
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgLight),
        contentAlignment = Alignment.Center,
    ) {
        AnimatedContent(
            targetState = flowState,
            transitionSpec = {
                fadeIn(tween(400)) + slideInVertically(tween(400)) { it / 3 } togetherWith
                fadeOut(tween(200))
            },
            label = "ai_flow",
        ) { state ->
            when (state) {
                AiFlowState.LOADING -> AiLoadingScreen(onCancel = onDismiss)

                AiFlowState.RESULT  -> aiResult?.let { result ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        if (error != null) {
                            ErrorMessage(error)
                            Spacer(Modifier.height(16.dp))
                        }
                        AiResultCard(
                            result    = result,
                            onConfirm = {
                                finalCategory = result.category.lowercase()
                                onConfirm(finalCategory)
                                flowState = AiFlowState.SUBMITTING
                            },
                            onChange  = { showPicker = true },
                            onDismiss = onDismiss,
                        )
                    }
                }

                AiFlowState.SUBMITTING -> AiSubmittingScreen()

                AiFlowState.SUCCESS -> AiSuccessScreen(
                    category  = finalCategory,
                    onFinish  = onSuccess,
                )
            }
        }
    }

    // Category bottom sheet
    if (showPicker) {
        CategoryPickerSheet(
            onCategorySelected = { selectedId ->
                showPicker    = false
                finalCategory = selectedId
                onConfirm(finalCategory)
                flowState = AiFlowState.SUBMITTING
            },
            onDismiss = { showPicker = false },
        )
    }
}

private enum class AiFlowState { LOADING, RESULT, SUBMITTING, SUCCESS }

@Composable
fun ErrorMessage(message: String) {
    Row(
        modifier = Modifier
            .padding(horizontal = 16.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(DangerRed.copy(alpha = 0.1f))
            .border(1.dp, DangerRed.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Icon(Icons.Default.Error, contentDescription = null, tint = DangerRed, modifier = Modifier.size(20.dp))
        Text(message, color = DangerRed, fontSize = 13.sp, fontWeight = FontWeight.Medium)
    }
}

@Composable
fun AiSubmittingScreen() {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        CircularProgressIndicator(color = NavyPrimary, modifier = Modifier.size(48.dp))
        Spacer(Modifier.height(24.dp))
        Text("Uploading your report...", fontWeight = FontWeight.Bold, color = TextPrimary)
        Text("This will only take a moment.", color = TextSecondary, fontSize = 13.sp)
    }
}


// ── Screen 1: AI Loading ──────────────────────────────────────────────────────
@Composable
fun AiLoadingScreen(onCancel: () -> Unit) {
    // Pulsing animation for the brain/AI icon
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue   = 0.95f,
        targetValue    = 1.05f,
        animationSpec  = infiniteRepeatable(tween(900), RepeatMode.Reverse),
        label          = "pulseScale",
    )
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue   = 0.4f,
        targetValue    = 1f,
        animationSpec  = infiniteRepeatable(tween(900), RepeatMode.Reverse),
        label          = "pulseAlpha",
    )

    // Animated loading dots
    var dotCount by remember { mutableStateOf(1) }
    LaunchedEffect(Unit) {
        while (true) {
            delay(500)
            dotCount = (dotCount % 3) + 1
        }
    }

    Column(
        modifier            = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        // Pulsing rings behind icon
        Box(contentAlignment = Alignment.Center) {
            // Outer ring
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .scale(pulseScale)
                    .clip(CircleShape)
                    .background(NavyPrimary.copy(alpha = 0.06f * pulseAlpha))
            )
            // Middle ring
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .background(NavyPrimary.copy(alpha = 0.10f))
            )
            // Icon box
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(listOf(NavyPrimary, Color(0xFF1A5C9E)))
                    ),
            ) {
                Text("🤖", fontSize = 28.sp)
            }
        }

        Spacer(Modifier.height(32.dp))

        Text(
            text       = "Analyzing your image" + ".".repeat(dotCount),
            fontSize   = 18.sp,
            fontWeight = FontWeight.SemiBold,
            color      = TextPrimary,
        )

        Spacer(Modifier.height(8.dp))

        Text(
            text      = "Our AI is identifying the civic issue\nin your photo",
            fontSize  = 13.sp,
            color     = TextSecondary,
            textAlign = TextAlign.Center,
            lineHeight = 20.sp,
        )

        Spacer(Modifier.height(48.dp))

        // Animated progress bar
        val progress by rememberInfiniteTransition(label = "bar").animateFloat(
            initialValue  = 0f,
            targetValue   = 1f,
            animationSpec = infiniteRepeatable(tween(1800, easing = EaseInOut), RepeatMode.Restart),
            label         = "progress",
        )
        Box(
            modifier = Modifier
                .width(200.dp)
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(NavyPrimary.copy(alpha = 0.1f))
        ) {
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(progress)
                    .clip(RoundedCornerShape(2.dp))
                    .background(TealAccent)
            )
        }

        Spacer(Modifier.height(48.dp))

        TextButton(onClick = onCancel) {
            Text("Cancel", color = TextSecondary, fontSize = 13.sp)
        }
    }
}

// ── Screen 2: AI Result Card ──────────────────────────────────────────────────
@Composable
fun AiResultCard(
    result:    AiAnalysisResult,
    onConfirm: () -> Unit,
    onChange:  () -> Unit,
    onDismiss: () -> Unit,
) {
    val confidencePct = (result.confidence * 100).toInt()
    val confidenceColor = when {
        result.confidence >= 0.75f -> GreenSuccess
        result.confidence >= 0.50f -> Color(0xFFE67E22)
        else                        -> DangerRed
    }
    val severityColor = when (result.severity.lowercase()) {
        "urgent"   -> DangerRed
        "moderate" -> Color(0xFFE67E22)
        else        -> GreenSuccess
    }

    // Animate confidence bar
    val animatedConfidence by animateFloatAsState(
        targetValue   = result.confidence,
        animationSpec = tween(1000, easing = EaseOutCubic),
        label         = "confidence",
    )

    Column(
        modifier            = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        // Top bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(onClick = onDismiss) {
                Icon(Icons.Default.Close, contentDescription = "Cancel", tint = TextSecondary)
            }
            Text(
                "AI Analysis",
                fontWeight = FontWeight.SemiBold,
                fontSize   = 16.sp,
                color      = TextPrimary,
                modifier   = Modifier.weight(1f),
                textAlign  = TextAlign.Center,
            )
            Spacer(Modifier.size(48.dp)) // balance the close button
        }

        Spacer(Modifier.height(12.dp))

        // Main result card
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(CardWhite)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            // Robot badge
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(56.dp)
                    .clip(CircleShape)
                    .background(NavyPrimary.copy(alpha = 0.08f)),
            ) {
                Text("🤖", fontSize = 24.sp)
            }

            Spacer(Modifier.height(8.dp))

            Text(
                "AI Detected",
                fontSize = 12.sp,
                color    = TextSecondary,
                letterSpacing = 0.5.sp,
            )

            Spacer(Modifier.height(16.dp))

            // Category result
            val displayLabel = issueCategories.find { it.id == result.category.lowercase() }?.label ?: result.category
            Text(result.emoji, fontSize = 48.sp)
            Spacer(Modifier.height(8.dp))
            Text(
                text       = displayLabel,
                fontSize   = 26.sp,
                fontWeight = FontWeight.Bold,
                color      = TextPrimary,
            )


            Spacer(Modifier.height(8.dp))

            Text(
                text      = result.description,
                fontSize  = 13.sp,
                color     = TextSecondary,
                textAlign = TextAlign.Center,
            )

            Spacer(Modifier.height(20.dp))
            HorizontalDivider(color = DividerColor, thickness = 0.5.dp)
            Spacer(Modifier.height(20.dp))

            // Confidence bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("Confidence", fontSize = 12.sp, color = TextSecondary)
                Text(
                    "$confidencePct%",
                    fontSize   = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color      = confidenceColor,
                )
            }
            Spacer(Modifier.height(6.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp))
                    .background(DividerColor)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(animatedConfidence)
                        .fillMaxHeight()
                        .clip(RoundedCornerShape(3.dp))
                        .background(confidenceColor)
                )
            }

            Spacer(Modifier.height(16.dp))

            // Severity chip
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("Severity", fontSize = 12.sp, color = TextSecondary)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(severityColor.copy(alpha = 0.1f))
                        .padding(horizontal = 12.dp, vertical = 4.dp),
                ) {
                    Text(
                        result.severity.replaceFirstChar { it.uppercase() },
                        fontSize   = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color      = severityColor,
                    )
                }
            }
        }

        // Low confidence warning
        if (result.confidence < 0.5f) {
            Spacer(Modifier.height(12.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFFFF3E0))
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Icon(
                    Icons.Outlined.Warning,
                    contentDescription = null,
                    tint     = Color(0xFFE65100),
                    modifier = Modifier.size(18.dp),
                )
                Text(
                    "Low confidence — we recommend selecting the category manually.",
                    fontSize = 12.sp,
                    color    = Color(0xFFE65100),
                    lineHeight = 18.sp,
                )
            }
        }

        Spacer(Modifier.height(24.dp))

        // Action buttons
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            // Confirm button
            Button(
                onClick  = onConfirm,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape    = RoundedCornerShape(14.dp),
                colors   = ButtonDefaults.buttonColors(containerColor = NavyPrimary),
            ) {
                Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Looks right — Confirm", fontWeight = FontWeight.Medium, fontSize = 15.sp)
            }

            // Change button
            OutlinedButton(
                onClick  = onChange,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape    = RoundedCornerShape(14.dp),
                border   = BorderStroke(1.dp, NavyPrimary),
            ) {
                Icon(Icons.Default.Edit, contentDescription = null, tint = NavyPrimary, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Change Category", color = NavyPrimary, fontWeight = FontWeight.Medium, fontSize = 15.sp)
            }
        }

        Spacer(Modifier.height(32.dp))
    }
}

// ── Screen 3: Category Picker Bottom Sheet ────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CategoryPickerSheet(
    onCategorySelected: (String) -> Unit,
    onDismiss:          () -> Unit,
) {
    var selected by remember { mutableStateOf("") }

    ModalBottomSheet(
        onDismissRequest  = onDismiss,
        containerColor    = CardWhite,
        shape             = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
        dragHandle        = {
            Box(
                modifier = Modifier
                    .padding(top = 12.dp, bottom = 4.dp)
                    .width(40.dp)
                    .height(4.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(DividerColor)
            )
        },
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp),
        ) {
            Text(
                "Select Category",
                fontSize   = 18.sp,
                fontWeight = FontWeight.Bold,
                color      = TextPrimary,
                modifier   = Modifier.padding(vertical = 16.dp),
            )

            Text(
                "What best describes this issue?",
                fontSize = 13.sp,
                color    = TextSecondary,
                modifier = Modifier.padding(bottom = 16.dp),
            )

            // 2-column grid of category chips
            LazyVerticalGrid(
                columns             = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement   = Arrangement.spacedBy(10.dp),
                modifier              = Modifier.height(320.dp),
            ) {
                items(issueCategories) { category ->
                    val isSelected = selected == category.id
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                if (isSelected) category.color.copy(alpha = 0.12f)
                                else            BgLight
                            )
                            .border(
                                width  = if (isSelected) 1.5.dp else 0.5.dp,
                                color  = if (isSelected) category.color else DividerColor,
                                shape  = RoundedCornerShape(14.dp),
                            )
                            .clickable { selected = category.id }
                            .padding(16.dp),
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                            Text(category.emoji, fontSize = 28.sp)
                            Spacer(Modifier.height(6.dp))
                            Text(
                                text       = category.label,
                                fontSize   = 13.sp,
                                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                                color      = if (isSelected) category.color else TextPrimary,
                                textAlign  = TextAlign.Center,
                            )
                        }
                        // Selected checkmark
                        if (isSelected) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .size(20.dp)
                                    .clip(CircleShape)
                                    .background(category.color),
                            ) {
                                Icon(
                                    Icons.Default.Check,
                                    contentDescription = null,
                                    tint     = Color.White,
                                    modifier = Modifier.size(12.dp),
                                )
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            Button(
                onClick  = { if (selected.isNotBlank()) onCategorySelected(selected) },
                enabled  = selected.isNotBlank(),
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape    = RoundedCornerShape(14.dp),
                colors   = ButtonDefaults.buttonColors(
                    containerColor         = NavyPrimary,
                    disabledContainerColor = NavyPrimary.copy(alpha = 0.3f),
                ),
            ) {
                Text("Confirm Category", fontWeight = FontWeight.Medium, fontSize = 15.sp)
            }
        }
    }
}

// ── Screen 4: Success ─────────────────────────────────────────────────────────
@Composable
fun AiSuccessScreen(
    category: String,
    onFinish: () -> Unit,
) {
    val categoryInfo = issueCategories.find { it.id == category }
        ?: issueCategories.last()

    // Scale-in animation
    var visible by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        delay(100)
        visible = true
        delay(3000) // auto-navigate after 3s
        onFinish()
    }
    val scale by animateFloatAsState(
        targetValue   = if (visible) 1f else 0.5f,
        animationSpec = spring(Spring.DampingRatioMediumBouncy, Spring.StiffnessMedium),
        label         = "successScale",
    )
    val alpha by animateFloatAsState(
        targetValue   = if (visible) 1f else 0f,
        animationSpec = tween(400),
        label         = "successAlpha",
    )

    Column(
        modifier            = Modifier
            .fillMaxSize()
            .graphicsLayer { scaleX = scale; scaleY = scale; this.alpha = alpha },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        // Success circle
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(100.dp)
                .clip(CircleShape)
                .background(GreenSuccess.copy(alpha = 0.12f)),
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(76.dp)
                    .clip(CircleShape)
                    .background(GreenSuccess),
            ) {
                Icon(
                    Icons.Default.Check,
                    contentDescription = null,
                    tint     = Color.White,
                    modifier = Modifier.size(36.dp),
                )
            }
        }

        Spacer(Modifier.height(24.dp))

        Text("Report Submitted!", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Spacer(Modifier.height(8.dp))
        Text(
            text      = "Categorized as ${categoryInfo.emoji} ${categoryInfo.label}",
            fontSize  = 14.sp,
            color     = TextSecondary,
            textAlign = TextAlign.Center,
        )

        Spacer(Modifier.height(6.dp))

        Text(
            text      = "Your community thanks you 🙏\nTrack it under My Reports.",
            fontSize  = 13.sp,
            color     = TextSecondary,
            textAlign = TextAlign.Center,
            lineHeight = 20.sp,
        )

        Spacer(Modifier.height(32.dp))

        Button(
            onClick  = onFinish,
            modifier = Modifier.padding(horizontal = 32.dp).fillMaxWidth().height(52.dp),
            shape    = RoundedCornerShape(14.dp),
            colors   = ButtonDefaults.buttonColors(containerColor = NavyPrimary),
        ) {
            Text("Go to My Reports", fontWeight = FontWeight.Medium, fontSize = 15.sp)
        }
    }
}
