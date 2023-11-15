<template>
  <QueryTask @handleQuery="handleQuery" />
  <WhiteSpace />
  <!-- <Table
    :table-data="state.tableData"
    :table-total="state.tableTotal"
    :table-columns="state.tableColumns"
    :table-operations="state.tableOperations"
  /> -->
  <el-table :data="state.tableData">
    <el-table-column
      v-for="item in state.tableColumns"
      :label="item.label"
      :prop="item.prop"
      :key="item.key"
      :width="['reportLink', 'logLink'].includes(item.prop) && 200"
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
        <span @click="downloadUrl(row.logLink)" class="font-ble" v-if="item.prop === 'logLink'">{{
          row.logLink
        }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
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
    </el-table-column>
  </el-table>
</template>
<script setup>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import Table from '../components/Table.vue'
import QueryTask from '../components/QueryTask.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import {
  getTaskListReq,
  updateTaskReq,
  deleteTaskReq,
  deleteTaskTypeReq,
  deleteFileReq
} from '../api/report'
import router from '../router/index'
import { priorityMap, taskStatusMap } from '../constant/index'
import { toast } from '../util/toast'
const state = reactive({
  page: {
    pageNum: 0,
    pageSize: 10
  },
  query: {},
  tableData: [],
  tableTotal: 0,
  tableColumns: [
    {
      label: '任务名称',
      prop: 'reportName'
    },
    {
      label: '任务类别',
      prop: 'LargeCategory'
    },
    {
      label: '一次性任务执行时间',
      prop: 'oneTimeExe'
    },
    {
      label: '周期性任务时间范围',
      prop: 'periodExeTime'
    },
    {
      label: '任务状态',
      prop: 'reportState'
    },
    {
      label: '任务优先级',
      prop: 'reportPriority'
    },

    {
      label: '最后执行时间',
      prop: 'lastTime'
    },
    {
      label: '结果excel',
      prop: 'reportLink'
    },
    {
      label: 'log日志',
      prop: 'logLink'
    },
    {
      label: '创建时间',
      prop: 'createTime'
    }
  ]
})

const deleteTask = (taskId, reportTypeId, reportName, fileName) => {
  ElMessageBox.confirm(`确定要删除${reportName}吗?`, '警告', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    callback: async (action) => {
      if (action === 'confirm') {
        try {
          if (reportTypeId) {
            // 周期性任务先删除reportTypeId
            await deleteTaskTypeReq({
              reportTypeId
            })
          }
          if (fileName) {
            await deleteFileReq({
              fileName
            })
          }
          await deleteTaskReq({
            reportId: taskId
          })
          toast('任务已删除')
          getTaskList()
        } catch (e) {}
      }
    }
  })
}

const downloadUrl = (item) => (window.location.href = item)

const pauseTask = (taskId) => {
  ElMessageBox.confirm('确定要中止这条任务吗?', '警告', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    callback: async (action) => {
      if (action === 'confirm') {
        try {
          await updateTaskReq({
            reportId: taskId,
            reportState: 3
          })
          toast('任务已中止')
          getTaskList()
        } catch (e) {}
      }
    }
  })
}
const formatDate = (date, format) => dayjs(date).format(format || 'YYYY-MM-DD')
const getTaskList = async () => {
  state.tableData = []
  const result = await getTaskListReq({
    ...state.page,
    ...state.query
  })
  state.tableData = result.data.list.map((i) => {
    return {
      ...i,
      oneTimeExe: i.LargeCategory === '一次性' ? formatDate(i.oneTimeExe) : null,
      periodExeTime:
        i.LargeCategory === '一次性' ? '' : `${formatDate(i.startTime)} - ${formatDate(i.endTime)}`,
      createTime: formatDate(i.createTime, 'YYYY-MM-DD HH:mm:ss'),
      reportPriority: priorityMap[i.reportPriority],
      reportState: taskStatusMap[i.reportState],
      lastTime: i.lastTime ? formatDate(i.lastTime, 'YYYY-MM-DD HH:mm:ss') : '',
      reportLink: getLink(i.reportLink, 'out'),
      logLink: getLink(i.logLink, 'log')
    }
  })
  state.tableTotal = result.data.total
}

const getLink = (fileName, path) => {
  if (fileName) {
    if (path === 'log') return `http://172.16.179.2:7002/public/${path}/${fileName}`
    return fileName.split(',').map((i) => `http://172.16.179.2:7002/public/${path}/${i}`)
  }
}

const handleQuery = (query) => {
  state.query = query
  state.page = {
    pageNum: 0,
    pageSize: 10
  }
  getTaskList()
}
getTaskList()
</script>
<style scoped>
.font-ble {
  color: #0076fe;
  cursor: pointer;
}
</style>
