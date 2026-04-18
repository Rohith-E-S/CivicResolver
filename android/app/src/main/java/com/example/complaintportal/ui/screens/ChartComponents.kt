package com.example.complaintportal.ui.screens

import android.graphics.Color
import android.graphics.Typeface
import android.view.ViewGroup
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.example.complaintportal.data.model.Complaint
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.charts.PieChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.data.PieData
import com.github.mikephil.charting.data.PieDataSet
import com.github.mikephil.charting.data.PieEntry
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.github.mikephil.charting.formatter.PercentFormatter

@Composable
fun StatusBarChart(newCount: Int, inProgressCount: Int, resolvedCount: Int) {
    AndroidView(
        modifier = Modifier.fillMaxWidth().height(250.dp),
        factory = { context ->
            BarChart(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                description.isEnabled = false
                legend.isEnabled = false
                axisRight.isEnabled = false
                axisLeft.axisMinimum = 0f
                axisLeft.setDrawGridLines(true)
                
                xAxis.setDrawGridLines(false)
                xAxis.position = XAxis.XAxisPosition.BOTTOM
                xAxis.granularity = 1f
                xAxis.valueFormatter = IndexAxisValueFormatter(listOf("New", "In Progress", "Resolved"))
                
                setFitBars(true)
            }
        },
        update = { chart ->
            val entries = listOf(
                BarEntry(0f, newCount.toFloat()),
                BarEntry(1f, inProgressCount.toFloat()),
                BarEntry(2f, resolvedCount.toFloat())
            )
            val dataSet = BarDataSet(entries, "Status").apply {
                setColors(
                    Color.parseColor("#005394"), // Primary
                    Color.parseColor("#784600"), // Tertiary
                    Color.parseColor("#006d40")  // Secondary
                )
                valueTextSize = 12f
                valueTypeface = Typeface.DEFAULT_BOLD
            }
            chart.data = BarData(dataSet)
            chart.notifyDataSetChanged()
            chart.invalidate()
        }
    )
}

@Composable
fun CategoryPieChart(complaints: List<Complaint>) {
    AndroidView(
        modifier = Modifier.fillMaxWidth().height(250.dp),
        factory = { context ->
            PieChart(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                description.isEnabled = false
                isDrawHoleEnabled = true
                setHoleColor(Color.TRANSPARENT)
                setTransparentCircleAlpha(0)
                legend.isWordWrapEnabled = true
                legend.textSize = 12f
                setEntryLabelColor(Color.WHITE)
                setEntryLabelTextSize(11f)
                setUsePercentValues(true)
            }
        },
        update = { chart ->
            val categoryCounts = complaints.groupingBy { it.category }.eachCount()
            val entries = categoryCounts.map { PieEntry(it.value.toFloat(), it.key) }
            val dataSet = PieDataSet(entries, "").apply {
                setColors(
                    Color.parseColor("#005394"),
                    Color.parseColor("#006d40"),
                    Color.parseColor("#ba1a1a"),
                    Color.parseColor("#784600"),
                    Color.parseColor("#8ef5b5"),
                    Color.parseColor("#ffb4ab"),
                    Color.parseColor("#004a84")
                )
                valueTextSize = 12f
                valueTextColor = Color.WHITE
                valueTypeface = Typeface.DEFAULT_BOLD
            }
            chart.data = PieData(dataSet).apply {
                setValueFormatter(PercentFormatter(chart))
            }
            chart.notifyDataSetChanged()
            chart.invalidate()
        }
    )
}
