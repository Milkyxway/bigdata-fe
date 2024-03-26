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

provide(THEME_KEY, 'dark')
const props = defineProps({
  data: {
    type: Array
  },
  legend: {
    type: Array
  },
  name: {
    type: String
  }
})
let option = ref()
watch()
const commonChart = () => {
  const { data, legend, name } = props
  console.log(data, legend)
  return (option = {
    title: {
      text: name
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: legend
    },
    series: [
      {
        name: '完成数量',
        type: 'bar',
        data
      },
      {
        name: '完成比例',
        type: 'bar'
      }
      // {
      //   name: '2012',
      //   type: 'bar',
      //   data: [19325, 23438, 31000, 121594, 134141, 681807]
      // }
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
