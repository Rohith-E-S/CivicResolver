package com.example.complaintportal

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.complaintportal.ui.navigation.AppNavigation
import com.example.complaintportal.ui.theme.ComplaintportalTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // OSMDroid configuration
        val ctx = applicationContext
        org.osmdroid.config.Configuration.getInstance().load(ctx, ctx.getSharedPreferences("osmdroid", 0))
        org.osmdroid.config.Configuration.getInstance().userAgentValue = "CivicResolver/1.0 (com.example.complaintportal)"
        
        enableEdgeToEdge()
        
        val appContainer = (application as ComplaintApplication).container
        
        setContent {
            ComplaintportalTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavigation(appContainer = appContainer)
                }
            }
        }
    }
}
