<template>
  <div class="multi-line-chart-container">
    <div class="chart-header">
      <h2>多折线图示例 - 产品销售趋势分析</h2>
      <div class="controls">
        <div class="legend-controls">
          <label v-for="(product, index) in productList" :key="product.id" class="legend-item">
            <input type="checkbox" v-model="product.visible" @change="updateChart" />
            <span class="legend-color" :style="{ backgroundColor: colors[index] }"></span>
            {{ product.name }}
          </label>
        </div>
        <div class="time-range">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            @click="changeTimeRange(range.value)"
            :class="{ active: currentRange === range.value }"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="chart-wrapper">
      <v-chart class="chart" :option="chartOption" :autoresize="true" />
    </div>

    <div class="chart-footer">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">总销售额</span>
          <span class="stat-value">{{ formatCurrency(totalSales) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">增长率</span>
          <span class="stat-value" :class="{ positive: growthRate >= 0, negative: growthRate < 0 }">
            {{ growthRate >= 0 ? '+' : '' }}{{ growthRate.toFixed(1) }}%
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最畅销产品</span>
          <span class="stat-value">{{ topProduct }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册必要的ECharts组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
])

// 颜色配置
const colors = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4'
]

// 产品数据
const productList = ref([
  { id: 1, name: '智能手机', visible: true },
  { id: 2, name: '笔记本电脑', visible: true },
  { id: 3, name: '平板电脑', visible: true },
  { id: 4, name: '智能手表', visible: true },
  { id: 5, name: '耳机', visible: true }
])

// 时间范围选项
const timeRanges = [
  { label: '近7天', value: '7days' },
  { label: '近30天', value: '30days' },
  { label: '近90天', value: '90days' },
  { label: '全年', value: 'year' }
]

const currentRange = ref('30days')

// 生成模拟数据
const generateMockData = () => {
  const days =
    currentRange.value === '7days'
      ? 7
      : currentRange.value === '30days'
      ? 30
      : currentRange.value === '90days'
      ? 90
      : 365

  const dates = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }))
  }

  const seriesData = productList.value.map((product, index) => {
    const data = []
    let baseValue = 100 + index * 50

    for (let i = 0; i < days; i++) {
      // 添加一些随机波动和趋势
      const trend = index * 0.5 + i * 0.1
      const randomFactor = Math.random() * 30 - 15
      const value = Math.max(0, Math.round(baseValue + trend + randomFactor))
      data.push(value)
    }

    return {
      name: product.name,
      type: 'line',
      data: data,
      smooth: true,
      lineStyle: {
        width: 3
      },
      symbolSize: 6,
      itemStyle: {
        color: colors[index % colors.length]
      },
      showSymbol: days <= 30 // 数据点多时隐藏标记点
    }
  })

  return { dates, seriesData }
}

// 图表配置
const chartOption = ref({})

// 初始化图表配置
const initChartOption = () => {
  const { dates, seriesData } = generateMockData()
  chartOption.value = {
    backgroundColor: '#fff',
    title: {
      text: '产品销售额趋势',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderWidth: 1,
      borderColor: '#ddd',
      textStyle: {
        color: '#333'
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#999',
          type: 'dashed'
        }
      },
      formatter: function (params) {
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].axisValue}</div>`
        params.forEach((item) => {
          result += `
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${
                item.color
              }; margin-right: 8px;"></span>
              <span style="flex: 1;">${item.seriesName}:</span>
              <span style="font-weight: bold; margin-left: 10px;">¥${item.value.toLocaleString()}</span>
            </div>
          `
        })
        return result
      }
    },
    legend: {
      type: 'scroll',
      bottom: 10,
      textStyle: {
        fontSize: 12
      },
      selected: Object.fromEntries(productList.value.map((p) => [p.name, p.visible]))
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666',
        formatter: '¥{value}'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: seriesData.filter((series, index) => productList.value[index].visible),
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100,
        minValueSpan: 10
      },
      {
        show: true,
        xAxisIndex: [0],
        type: 'slider',
        bottom: 25,
        start: 0,
        end: 100,
        height: 20,
        borderColor: 'transparent',
        fillerColor: 'rgba(84, 112, 198, 0.2)',
        handleStyle: {
          color: '#5470c6'
        }
      }
    ]
  }
}

// 计算总销售额
const totalSales = computed(() => {
  let total = 0
  const visibleProducts = productList.value.filter((p) => p.visible)

  if (chartOption.value.series) {
    chartOption.value.series.forEach((series) => {
      if (series.data) {
        total += series.data.reduce((sum, val) => sum + val, 0)
      }
    })
  }

  return total
})

// 计算增长率（模拟数据）
const growthRate = computed(() => {
  // 简单模拟增长率
  return 12.5
})

// 获取最畅销产品
const topProduct = computed(() => {
  if (!chartOption.value.series || chartOption.value.series.length === 0) return '-'

  let maxAvg = 0
  let topProductName = '-'

  chartOption.value.series.forEach((series) => {
    if (series.data && series.data.length > 0) {
      const avg = series.data.reduce((sum, val) => sum + val, 0) / series.data.length
      if (avg > maxAvg) {
        maxAvg = avg
        topProductName = series.name
      }
    }
  })

  return topProductName
})

// 更新图表
const updateChart = () => {
  initChartOption()
}

// 更改时间范围
const changeTimeRange = (range) => {
  currentRange.value = range
  initChartOption()
}

// 格式化货币显示
const formatCurrency = (value) => {
  return '¥' + value.toLocaleString()
}

// 初始化
onMounted(() => {
  initChartOption()
})
</script>

<style scoped>
.multi-line-chart-container {
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fafc;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.chart-header {
  margin-bottom: 20px;
}

.chart-header h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-weight: 600;
  font-size: 24px;
  text-align: center;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.legend-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  user-select: none;
}

.legend-item input {
  margin-right: 6px;
  cursor: pointer;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 6px;
}

.time-range {
  display: flex;
  gap: 8px;
}

.time-range button {
  padding: 6px 12px;
  background-color: #f0f2f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.time-range button:hover {
  background-color: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.time-range button.active {
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;
}

.chart-wrapper {
  width: 100%;
  height: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-footer {
  margin-top: 20px;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-value.positive {
  color: #52c41a;
}

.stat-value.negative {
  color: #f5222d;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .chart-wrapper {
    height: 400px;
  }

  .stats {
    flex-direction: column;
  }
}
</style>
