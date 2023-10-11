<template>
  <Table
    :table-data="state.tableData"
    :table-total="state.tableTotal"
    :table-columns="state.tableColumns"
    :table-operations="state.tableOperations"
  />
</template>
<script setup>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import Table from '../components/Table.vue'
import { getTaskListReq, updateTaskReq } from '../api/report'
import router from '../router/index'
import { priorityMap, taskStatusMap } from '../constant/index'
const state = reactive({
  page: {
    pageNum: 0,
    pageSize: 10
  },
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
      label: '创建时间',
      prop: 'createTime'
    }
  ],
  tableOperations: [
    {
      label: '中止',
      fn: (row) => {
        pauseTask(row.reportId)
      }
    },
    {
      label: '查看',
      fn: (row) => {
        router.push(`/develop/taskdetail/${row.reportId}`)
      }
    }
  ]
})

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
        } catch (e) {}
      }
    }
  })
}
const formatDate = (date, format) => dayjs(date).format(format || 'YYYY-MM-DD')
const getTaskList = async () => {
  const result = await getTaskListReq({
    ...state.page
  })
  state.tableData = result.data.list.map((i) => {
    return {
      ...i,
      oneTimeExe: i.LargeCategory === '一次性' ? formatDate(i.oneTimeExe) : null,
      periodExeTime:
        i.LargeCategory === '一次性' ? '' : `${formatDate(i.startTime)} - ${formatDate(i.endTime)}`,
      createTime: formatDate(i.createTime, 'YYYY-MM-DD hh:mm:ss'),
      reportPriority: priorityMap[i.reportPriority],
      reportState: taskStatusMap[i.reportState]
    }
  })
  state.tableTotal = result.data.total
}
getTaskList()
</script>
