<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, reactive, watch } from 'vue'

use([CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, GridComponent, LineChart])

// provide(THEME_KEY, 'dark')
const props = defineProps({
  data: {
    type: Array
  }
})
let option = ref()
watch()
const commonChart = () => {
  const { data, name } = props
  return (option.value = {
    color: ['#7D4BFF', '#E23AF5', '#4164F3', '#94FFFF', '#4397FF', '#8BB6FF'],
    xAxis: {
      name: '站',
      data: data.map((i) => i.districtName),
      axisLabel: {
        // inside: true,
        color: '#fff',
        rotate: 30
      },

      z: 10
    },
    yAxis: {
      name: '销账金额',

      axisLabel: {
        color: '#999'
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      {
        type: 'line',
        smooth: true,
        data: data.map((i) => i.amt)
      }
    ]
  })
}
option.value = commonChart()
</script>

<style scoped>
.chart {
  /* height: 100vh; */
  height: 300px;
}
</style>
