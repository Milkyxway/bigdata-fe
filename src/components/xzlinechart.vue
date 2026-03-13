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
  },
  data1: {
    type: Array
  }
})
let option = ref()
watch()

const formatLineData = (data, data1) => {
  const newCustArr = []
  newCustArr.push(
    formatItem(
      '上月销账金额',
      data.map((i) => i.amt)
    )
  )
  newCustArr.push(
    formatItem(
      '上上月销账金额',
      data1.map((i) => i.amt)
    )
  )

  return newCustArr
}
const formatItem = (name, data) => {
  return {
    data,
    visible: true,
    name,
    type: 'line',
    smooth: true
  }
}
const commonChart = () => {
  const { data, data1 } = props
  return (option.value = {
    color: ['#94FFFF', '#4397FF', '#8BB6FF', '#7D4BFF', '#E23AF5', '#4164F3'],
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
    legend: {
      type: 'plain', // 普通图例
      // top: '10%',
      left: 'right',
      itemWidth: 20,
      itemHeight: 12,
      textStyle: {
        fontSize: 14,
        color: '#666'
      },
      // 图例标记样式
      itemStyle: {
        borderWidth: 0
      },
      // 图例之间的间距
      itemGap: 20,
      // 图例形状为矩形
      icon: 'rect'
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
              <span style="font-weight: bold; margin-left: 10px;">${item.value.toLocaleString()}元</span>
            </div>
          `
        })
        return result
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: formatLineData(data, data1)
  })
}
option.value = commonChart()
</script>

<style scoped>
.chart {
  /* height: 100vh; */
  height: 220px;
}
</style>
