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
import { data } from 'autoprefixer'

use([CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, GridComponent, BarChart])

// provide(THEME_KEY, 'dark')
const props = defineProps({
  data: {
    type: Array
  }
})
let option = ref()
watch()

const formatItem = (name, data) => {
  return {
    data,
    visible: true,
    name,
    type: 'bar'
  }
}

const formatBardata = (data) => {
  const newCustArr = []
  newCustArr.push(
    formatItem(
      '电视',
      data.map((i) => i.tvCust)
    )
  )
  newCustArr.push(
    formatItem(
      '宽带',
      data.map((i) => i.lanCust)
    )
  )
  newCustArr.push(
    formatItem(
      '手机卡',
      data.map((i) => i.mobileCust)
    )
  )
  return newCustArr
}
const commonChart = () => {
  const { data, name } = props
  formatBardata(data)

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
      name: '新发展个数',

      axisLabel: {
        color: '#999'
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
          console.log(item)
          result += `
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${
                item.color
              }; margin-right: 8px;"></span>
              <span style="flex: 1;">${item.seriesName}:</span>
              <span style="font-weight: bold; margin-left: 10px;">${item.value.toLocaleString()}个</span>
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
    series: formatBardata(data)
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
