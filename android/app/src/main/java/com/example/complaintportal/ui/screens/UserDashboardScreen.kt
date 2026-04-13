package com.example.complaintportal.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.text.BasicTextField
import com.example.complaintportal.ui.viewmodel.ComplaintViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserDashboardScreen(
    viewModel: ComplaintViewModel,
    userName: String,
    onNavigateToCreate: () -> Unit,
    onNavigateToDetail: (String) -> Unit
) {
    val state by viewModel.state.collectAsState()
    var selectedTabIndex by remember { mutableIntStateOf(0) }
    var searchQuery by remember { mutableStateOf("") }
    var isRefreshing by remember { mutableStateOf(false) }

    val onRefresh = {
        isRefreshing = true
        viewModel.fetchUserComplaints()
    }

    LaunchedEffect(state.isLoading) {
        if (!state.isLoading) {
            isRefreshing = false
        }
    }

    LaunchedEffect(Unit) {
        viewModel.fetchUserComplaints()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("CivicResolve", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primaryContainer) },
                actions = {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .clickable { onNavigateToDetail("profile") },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Person, contentDescription = "Profile")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNavigateToCreate,
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                contentColor = MaterialTheme.colorScheme.onPrimaryContainer
            ) {
                Icon(Icons.Default.Add, contentDescription = "Create Complaint")
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).fillMaxSize().background(MaterialTheme.colorScheme.background)) {
            
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Welcome back,", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(userName, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.ExtraBold)
                }

                BasicTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp)
                        .background(MaterialTheme.colorScheme.surface, CircleShape)
                        .border(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f), CircleShape),
                    singleLine = true,
                    textStyle = MaterialTheme.typography.bodyLarge.copy(color = MaterialTheme.colorScheme.onSurface),
                    cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                    decorationBox = { innerTextField ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Box(modifier = Modifier.weight(1f)) {
                                if (searchQuery.isEmpty()) {
                                    Text(
                                        text = "Search...",
                                        style = MaterialTheme.typography.bodyLarge,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                innerTextField()
                            }
                        }
                    }
                )
            }

            PullToRefreshBox(
                isRefreshing = isRefreshing,
                onRefresh = onRefresh,
                modifier = Modifier.fillMaxSize()
            ) {
                val list = when (selectedTabIndex) {
                    0 -> state.newComplaints
                    1 -> state.inProgressComplaints
                    2 -> state.resolvedComplaints
                    else -> emptyList()
                }

                val filteredList = if (searchQuery.isBlank()) {
                    list
                } else {
                    list.filter {
                        it.category.contains(searchQuery, ignoreCase = true) ||
                        it.city.contains(searchQuery, ignoreCase = true) ||
                        it.description.contains(searchQuery, ignoreCase = true)
                    }
                }

                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(bottom = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.padding(bottom = 8.dp)
                        ) {
                            item {
                                StatCard(
                                    title = "New",
                                    count = state.newComplaints.size.toString(),
                                    color = MaterialTheme.colorScheme.primary,
                                    isSelected = selectedTabIndex == 0,
                                    onClick = { selectedTabIndex = 0 }
                                )
                            }
                            item {
                                StatCard(
                                    title = "Active",
                                    count = state.inProgressComplaints.size.toString(),
                                    color = MaterialTheme.colorScheme.tertiary,
                                    isSelected = selectedTabIndex == 1,
                                    onClick = { selectedTabIndex = 1 }
                                )
                            }
                            item {
                                StatCard(
                                    title = "Resolved",
                                    count = state.resolvedComplaints.size.toString(),
                                    color = MaterialTheme.colorScheme.secondary,
                                    isSelected = selectedTabIndex == 2,
                                    onClick = { selectedTabIndex = 2 }
                                )
                            }
                        }
                    }

                    if (filteredList.isEmpty() && !state.isLoading) {
                        item {
                            Box(modifier = Modifier.fillParentMaxSize(), contentAlignment = Alignment.Center) {
                                Text("No complaints found.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    } else {
                        items(filteredList) { complaint ->
                            Box(modifier = Modifier.padding(horizontal = 16.dp)) {
                                ComplaintCard(
                                    complaint = complaint,
                                    isAdmin = false,
                                    onClick = { onNavigateToDetail(complaint.id) },
                                    onUpdateStatusClick = {}
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}