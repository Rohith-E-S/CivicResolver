package com.example.complaintportal.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import coil.compose.rememberAsyncImagePainter
import com.example.complaintportal.ui.viewmodel.ComplaintViewModel
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import java.io.FileOutputStream
import java.util.Objects

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateComplaintScreen(
    viewModel: ComplaintViewModel,
    onNavigateBack: () -> Unit
) {
    val state by viewModel.state.collectAsState()
    var description by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Sanitation & Waste") }
    var city by remember { mutableStateOf("") }
    var userState by remember { mutableStateOf("") }
    var landmark by remember { mutableStateOf("") }
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    var showCategoryDropdown by remember { mutableStateOf(false) }
    val categories = listOf("Sanitation & Waste", "Roads & Infrastructure", "Public Safety", "Utilities & Lighting", "Parks & Recreation")

    val context = LocalContext.current
    val cameraFile = remember { File(context.cacheDir, "camera_photo.jpg") }
    val cameraUri = remember {
        try {
            FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", cameraFile)
        } catch (e: Exception) {
            Uri.EMPTY
        }
    }

    val galleryLauncher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { resultUri ->
        if (resultUri != null) selectedImageUri = resultUri
    }

    val cameraLauncher = rememberLauncherForActivityResult(ActivityResultContracts.TakePicture()) { success ->
        if (success) selectedImageUri = cameraUri
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("CivicResolve", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primaryContainer) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = MaterialTheme.colorScheme.primary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        bottomBar = {
            Box(modifier = Modifier.fillMaxWidth().padding(24.dp)) {
                Button(
                    onClick = {
                        var imagePart: MultipartBody.Part? = null
                        selectedImageUri?.let { imgUri ->
                            val inputStream = context.contentResolver.openInputStream(imgUri)
                            val uploadFile = File(context.cacheDir, "upload_${System.currentTimeMillis()}.jpg")
                            val outputStream = FileOutputStream(uploadFile)
                            inputStream?.copyTo(outputStream)
                            inputStream?.close()
                            outputStream.close()
                            val requestFile = uploadFile.asRequestBody("image/jpeg".toMediaTypeOrNull())
                            imagePart = MultipartBody.Part.createFormData("imageUrl", uploadFile.name, requestFile)
                        }

                        val descReq = description.toRequestBody("text/plain".toMediaTypeOrNull())
                        val latReq = "0.0".toRequestBody("text/plain".toMediaTypeOrNull())
                        val lngReq = "0.0".toRequestBody("text/plain".toMediaTypeOrNull())
                        val cityReq = city.toRequestBody("text/plain".toMediaTypeOrNull())
                        val stateReq = userState.toRequestBody("text/plain".toMediaTypeOrNull())
                        val landmarkReq = landmark.toRequestBody("text/plain".toMediaTypeOrNull())

                        viewModel.createComplaint(descReq, latReq, lngReq, cityReq, stateReq, landmarkReq, imagePart, onNavigateBack)
                    },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    enabled = !state.isLoading && description.isNotBlank() && city.isNotBlank() && userState.isNotBlank()
                ) {
                    Text(if (state.isLoading) "Submitting..." else "Submit Complaint", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp)
        ) {
            Spacer(modifier = Modifier.height(16.dp))
            Text("New Request", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.ExtraBold)
            Text("Submit an issue to your local administration for resolution.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(top = 8.dp))
            
            Spacer(modifier = Modifier.height(32.dp))

            // Category
            Text("CATEGORY", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.outline)
            Box(modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                OutlinedTextField(
                    value = category,
                    onValueChange = {},
                    readOnly = true,
                    modifier = Modifier.fillMaxWidth().clickable { showCategoryDropdown = true },
                    trailingIcon = { Icon(Icons.Default.ExpandMore, contentDescription = null) },
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                        unfocusedBorderColor = Color.Transparent,
                        focusedBorderColor = MaterialTheme.colorScheme.primary.copy(alpha=0.4f)
                    )
                )
                DropdownMenu(expanded = showCategoryDropdown, onDismissRequest = { showCategoryDropdown = false }) {
                    categories.forEach { cat ->
                        DropdownMenuItem(text = { Text(cat) }, onClick = { category = cat; showCategoryDropdown = false })
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Description
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.Bottom) {
                Text("DESCRIPTION", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.outline)
                Text("${description.length} / 500", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.outline)
            }
            OutlinedTextField(
                value = description,
                onValueChange = { if (it.length <= 500) description = it },
                modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                placeholder = { Text("Describe the issue in detail...") },
                minLines = 5,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                    unfocusedBorderColor = Color.Transparent,
                    focusedBorderColor = MaterialTheme.colorScheme.primary.copy(alpha=0.4f)
                )
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Location
            Text("LOCATION DETAILS", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.outline)
            Row(modifier = Modifier.fillMaxWidth().padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                OutlinedTextField(value = city, onValueChange = { city = it }, placeholder = { Text("City") }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow, unfocusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow, unfocusedBorderColor = Color.Transparent))
                OutlinedTextField(value = userState, onValueChange = { userState = it }, placeholder = { Text("State") }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow, unfocusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow, unfocusedBorderColor = Color.Transparent))
            }
            OutlinedTextField(
                value = landmark,
                onValueChange = { landmark = it },
                modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
                placeholder = { Text("Landmark or Street Address") },
                leadingIcon = { Icon(Icons.Default.LocationOn, contentDescription = null, tint = MaterialTheme.colorScheme.primary) },
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                    unfocusedBorderColor = Color.Transparent
                )
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Evidence Photos
            Text("EVIDENCE PHOTOS", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.outline)
            Row(modifier = Modifier.fillMaxWidth().padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                
                selectedImageUri?.let { imgUri ->
                    Box(modifier = Modifier.size(80.dp).clip(RoundedCornerShape(12.dp))) {
                        Image(painter = rememberAsyncImagePainter(imgUri), contentDescription = null, modifier = Modifier.fillMaxSize())
                        Box(modifier = Modifier.align(Alignment.TopEnd).padding(4.dp).size(24.dp).clip(CircleShape).background(Color.Black.copy(alpha=0.4f)).clickable { selectedImageUri = null }, contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.Close, contentDescription = "Remove", tint = Color.White, modifier = Modifier.size(16.dp))
                        }
                    }
                }

                Box(
                    modifier = Modifier.size(80.dp).clip(RoundedCornerShape(12.dp)).background(MaterialTheme.colorScheme.surfaceContainer).border(2.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha=0.3f), RoundedCornerShape(12.dp)).clickable { galleryLauncher.launch("image/*") },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.Image, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Text("GALLERY", style = MaterialTheme.typography.labelSmall, fontSize = 8.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }
                }

                Box(
                    modifier = Modifier.size(80.dp).clip(RoundedCornerShape(12.dp)).background(MaterialTheme.colorScheme.surfaceContainer).border(2.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha=0.3f), RoundedCornerShape(12.dp)).clickable { cameraLauncher.launch(cameraUri) },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.PhotoCamera, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Text("CAMERA", style = MaterialTheme.typography.labelSmall, fontSize = 8.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }
                }
            }

            Spacer(modifier = Modifier.height(100.dp)) // padding for bottom bar
        }
    }
}
