package com.example.complaintportal

import android.app.Application
import com.example.complaintportal.di.AppContainer
import com.example.complaintportal.di.DefaultAppContainer

class ComplaintApplication : Application() {
    lateinit var container: AppContainer

    override fun onCreate() {
        super.onCreate()
        container = DefaultAppContainer(this)
    }
}
