<template>
  <QueryReport @handleQuery="handleQuery" />
  <WhiteSpace />
  <el-tabs v-model="state.chooseTab">
    <el-tab-pane
      v-for="(item, index) in periodType"
      v-bind:key="index"
      :label="item.label"
      :name="item.value"
    >
    </el-tab-pane>
  </el-tabs>

  <el-table :data="state.tableData">
    <el-table-column
      v-for="item in state.tableColumns"
      :label="item.label"
      :prop="item.prop"
      :key="item.key"
      :width="['reportLink'].includes(item.prop) && 200"
    >
      <template #default="{ row }">
        <span
          v-for="(i, index) in row.reportLink"
          :v-bind:key="index"
          v-if="item.prop === 'reportLink'"
          class="font-ble"
        >
          <span @click="downloadUrl(i)">{{ i }}</span>
        </span>
      </template>
    </el-table-column>
    <!-- <el-table-column fixed="right" label="操作" width="150">
      <template #default="{ row }">
        <el-button
          link
          type="danger"
          size="small"
          @click="deleteTask(row.reportId, row.reportTypeId, row.reportName, row.SourceExcelLink)"
          >删除</el-button
        >
        <el-button
          link
          type="primary"
          size="small"
          @click="router.push(`/develop/taskdetail/${row.reportId}`)"
          >查看</el-button
        >

        <el-button link type="primary" size="small" @click="pauseTask(row.reportId)"
          >中止</el-button
        >
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script setup>
import { reactive } from 'vue'
import QueryReport from '../components/QueryReport.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import { getTaskListReq } from '../api/report'
import { getLocalStore } from '../util/localStorage'
import { formatLink, downloadUrl } from '../util/formatLink'
import { periodType, periodTypeMap, taskStatusMap } from '../constant/index'

const userId = getLocalStore('userInfo').userId
const userInfo = getLocalStore('userInfo')
const state = reactive({
  // chooseTab: 3,
  page: {
    pageSize: 10,
    pageNum: 0
  },
  querys: {
    // reportType: 3
  },

  tableColumns: [
    {
      label: '任务名称',
      prop: 'reportName'
    },
    {
      label: '状态',
      prop: 'reportState'
    },
    {
      label: '结果Excel',
      prop: 'reportLink'
    },
    {
      label: '上传匹配文件',
      prop: 'SourceExcelLink'
    },
    {
      label: '创建人',
      prop: 'username'
    }
  ],
  tableData: [],
  total: 0,
  tableOperations: []
})

const getReportList = async () => {
  const params = {
    ...state.querys,
    ...state.page,
    custID: userId
  }
  const result = await getTaskListReq(params)
  state.tableData = result.data.list.map((i) => {
    return {
      ...i,
      reportState: taskStatusMap[i.reportState],
      reportLink: i.reportLink
        ? i.reportLink.split(',').map((i) => {
            return formatLink(i, 'out')
          })
        : '',
      SourceExcelLink: formatLink(i.SourceExcelLink, 'upload')
      // custID: userInfo[i.custID]
    }
  })
  state.total = result.data.total
}

getReportList()
</script>
<style scoped>
.font-ble {
  color: #0076fe;
  cursor: pointer;
}
</style>
