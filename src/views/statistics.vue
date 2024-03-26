<template>
  <el-row v-if="state.init">
    <el-col :span="24">
      <BarCharts :data="state.taskSort" name="各任务执行次数" :legend="state.taskSortLegend" />
    </el-col>
  </el-row>
</template>
<script setup>
import { reactive } from 'vue'
import BarCharts from '../components/BarCharts.vue'
import { getTaskSortReq } from '../api/report'
const state = reactive({
  init: false,
  taskSort: [],
  taskSortLegend: []
})

const formatData = (data) => {
  return data.map((i) => {
    return { name: i.reportName, value: i.total }
  })
}

const getPieChart = async () => {
  const result = await getTaskSortReq()
  state.taskSort = formatData(result.data)
  state.taskSortLegend = result.data.map((i) => i.reportName)
  state.init = true
}
getPieChart()
</script>
