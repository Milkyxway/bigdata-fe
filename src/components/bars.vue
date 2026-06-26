<template>
  <div class="chart-container">
    <v-chart :option="chartOption" :autoresize="true" style="height: 400px" />
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

// 注册组件
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

export default defineComponent({
  name: 'StackedBarChart',
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: 'light'
  },
  setup() {
    // 模拟数据
    const chartData = ref([
      { name: '项目A', target: 120, completion: 100 },
      { name: '项目B', target: 200, completion: 150 },
      { name: '项目C', target: 150, completion: 120 },
      { name: '项目D', target: 80, completion: 60 },
      { name: '项目E', target: 100, completion: 90 },
      { name: '项目F', target: 180, completion: 160 }
    ])

    // 计算未完成部分
    const remainingData = computed(() => {
      return chartData.value.map((item) => Math.max(0, item.target - item.completion))
    })

    // 图表配置
    const chartOption = computed(() => {
      return {
        title: {
          text: '目标完成情况对比',
          left: 'center',
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['完成值', '目标值'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.value.map((item) => item.name),
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '数值',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ccc'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        },
        series: [
          {
            name: '完成值',
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            itemStyle: {
              color: '#5470c6'
              // borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              focus: 'series'
            },
            label: {
              show: true,
              position: 'inside',
              color: '#fff',
              fontWeight: 'bold'
            },
            data: chartData.value.map((item) => item.completion)
          },
          {
            name: '目标值',
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            itemStyle: {
              color: '#91cc75',
              opacity: 0.7
              // borderRadius: [0, 0, 4, 4]
            },
            emphasis: {
              focus: 'series'
            },
            data: remainingData.value
          }
        ]
      }
    })

    return {
      chartOption
    }
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}
</style>
