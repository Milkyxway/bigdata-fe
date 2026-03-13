<template>
  <highcharts :options="chartOptions" />
</template>
<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
const props = defineProps({
  data: {
    type: Array
  },
  hlwTotal: {
    type: Number
  }
})

const getScale = () => {
  const viewWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

  if (viewWidth / viewHeight >= 1.97) {
    return {
      width: 300,
      height: 240
    }
  } else if (viewWidth <= 1500) {
    return {
      width: 300,
      height: 280
    }
  } else
    return {
      width: 500,
      height: 450
    }
}
const format3dData = () => {
  const arr = []
  props.data.map((i) => {
    arr.push([i.name, i.amt])
  })
  arr.sort((a, b) => b[1] - a[1])
  return arr
}
const chartOptions = ref({
  chart: {
    type: 'pie',
    options3d: {
      enabled: true,
      alpha: 45
    },
    backgroundColor: 'transparent',
    width: getScale().width,
    height: getScale().height
  },
  title: {
    text: '',
    align: 'left'
  },
  subtitle: {
    text: '',
    align: 'left'
  },
  plotOptions: {
    pie: {
      innerSize: 100,
      depth: 100,
      dataLabels: {
        enabled: true, //是否显示饼图的线形tip
        distance: 10, //设置引导线的长度 饼图的大小
        color: '#FFF', //全局设置字体颜色
        style: {
          textOutline: 'none', //去掉文字白边
          fontSize: '12'
        },
        // format: "{point.name}"
        formatter: function () {
          return (
            this.point.name +
            this.y +
            '元 占比' +
            ((this.y / props.hlwTotal) * 100).toFixed(2) +
            '%'
          )
        }
      }
    }
  },
  series: [
    {
      name: '各业务销账金额占比',
      data: format3dData()
    }
  ],
  colors: ['#E23AF5', '#7D4BFF', '#4164F3', '#94FFFF', '#4397FF', '#8BB6FF']
})
onMounted(() => {
  window.addEventListener('resize', (e) => {
    var width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    const scale = width / 2560
    chartOptions.value = {
      ...chartOptions.value,
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        },
        backgroundColor: 'transparent',
        width: 500 * scale,
        height: 480 * scale
      }
    }
  })
})
onBeforeUnmount(() => window.removeEventListener('resize'))
</script>
