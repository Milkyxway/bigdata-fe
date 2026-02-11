<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, reactive, watch } from 'vue'

use([CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, GridComponent, BarChart])

// provide(THEME_KEY, 'dark')
const props = defineProps({
  data: {
    type: Array
  },
  legend: {
    type: Array
  }
})
let option = ref()
watch()
const commonChart = () => {
  const { data, legend, name } = props
  return (option.value = {
    color: ['#7D4BFF', '#E23AF5', '#4164F3', '#94FFFF', '#4397FF', '#8BB6FF'],
    xAxis: {
      name: '站',
      data: legend,
      axisLabel: {
        // inside: true,
        color: '#fff',
        rotate: 30
      },

      z: 10
    },
    yAxis: {
      name: '缴费金额排名',

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
        type: 'bar',
        // showBackground: true,
        // itemStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     { offset: 0, color: '#83bff6' },
        //     { offset: 0.5, color: '#188df0' },
        //     { offset: 1, color: '#188df0' }
        //   ])
        // },
        // emphasis: {
        //   itemStyle: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //       { offset: 0, color: '#2378f7' },
        //       { offset: 0.7, color: '#2378f7' },
        //       { offset: 1, color: '#83bff6' }
        //     ])
        //   }
        // },
        data: data.map((i) => i.rate)
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
