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
      :width="['reportLink', 'logLink', 'reportName'].includes(item.prop) && 200"
    >
      <template #default="{ row }">
        <span :class="getColorByState(row.reportState)" v-if="item.prop === 'reportState'">{{
          row.reportState
        }}</span>
        <span class="task-content" v-if="['reportName'].includes(item.prop)">{{
          row[item.prop]
        }}</span>
        <span
          v-for="(i, index) in row.reportLink"
          :v-bind:key="index"
          v-if="item.prop === 'reportLink'"
          class="font-ble"
        >
          <span @click="downloadUrl(i)">结果excel</span>
        </span>
        <span @click="downloadUrl(row.logLink)" class="font-ble" v-if="item.prop === 'logLink'">{{
          row.logLink ? '执行日志' : ''
        }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="{ row }">
        <el-button
          link
          type="danger"
          size="small"
          @click="
            deleteTask(
              row.reportId,
              row.reportTypeId,
              row.reportName,
              row.SourceExcelLink,
              row.logLinkCopy,
              row.reportLinkCopy
            )
          "
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
  <el-pagination
    class="pagination"
    v-model:current-page="state.pageNum"
    v-model:page-size="state.pageSize"
    :page-sizes="[10, 20, 30, 40]"
    layout="total,sizes, prev, pager, next, jumper"
    :total="state.tableTotal"
  />
</template>
<script setup>
import { reactive, watch } from 'vue'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
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
import { priorityMap, taskStatusMap, orgMap } from '../constant/index'
import { toast } from '../util/toast'
import { getColorByState } from '../util/statefont'
import { formatLink, downloadUrl } from '../util/formatLink'
import { getLocalStore } from '../util/localStorage'
const state = reactive({
  page: {
    pageNum: 0,
    pageSize: 10
  },
  pageNum: 1,
  pageSize: 10,
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
      label: '任务所属部门',
      prop: 'taskAssignOrg'
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
    },
    {
      label: '创建人',
      prop: 'username'
    }
  ]
})

watch(
  () => [state.pageNum, state.pageSize],
  (val) => {
    state.page.pageNum = val[0] - 1
    state.page.pageSize = val[1]
    getTaskList()
  }
)

const deleteTask = (taskId, reportTypeId, reportName, sourceLink, logLink, reportLink) => {
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
          if (sourceLink) {
            await deleteFileReq({
              fileName: sourceLink,
              path: 'upload'
            })
          }
          if (logLink) {
            await deleteFileReq({
              fileName: logLink,
              path: 'log'
            })
          }
          if (reportLink) {
            await deleteFileReq({
              fileName: reportLink,
              path: 'out'
            })
          }
          await deleteTaskReq({
            reportId: taskId
          })
          toast('任务已删除')
          getTaskList()
        } catch (e) {
          await deleteTaskReq({
            reportId: taskId
          })
        }
      }
    }
  })
}

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
    ...state.query,
    region: getLocalStore('userInfo').region
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
      logLink: getLink(i.logLink, 'log'),
      reportLinkCopy: i.reportLink,
      logLinkCopy: i.logLink,
      taskAssignOrg: orgMap[i.taskAssignOrg]
    }
  })
  state.tableTotal = result.data.total
}

const getLink = (fileName, path) => {
  if (fileName) {
    if (path === 'log') return formatLink(fileName, path)
    return fileName.split(',').map((i) => formatLink(i, path))
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
.pagination {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
}
.font-grey {
  color: #b1b3b8;
}
.font-yellow {
  color: #e6a23c;
}
.font-red {
  color: #f56c6c;
}

.font-green {
  color: #67c23a;
}
.task-content {
  /* width: 100px; */
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4; /* 这里是超出几行省略 */
}
</style>
