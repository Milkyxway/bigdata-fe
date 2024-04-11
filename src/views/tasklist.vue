<template>
  <QueryTask @handleQuery="handleQuery" />
  <WhiteSpace />
  <!-- <Table
    :table-data="state.tableData"
    :table-total="state.tableTotal"
    :table-columns="state.tableColumns"
    :table-operations="state.tableOperations"
  /> -->
  <el-table :data="state.tableData" row-key="id" :default-expand-all="false">
    <el-table-column
      v-for="item in state.tableColumns"
      :label="item.label"
      :prop="item.prop"
      :key="item.key"
      :width="['excelData', 'logLink', 'reportName'].includes(item.prop) && 200"
    >
      <template #default="{ row }">
        <span :class="getColorByState(row.reportState)" v-if="item.prop === 'reportState'">{{
          row.reportState
        }}</span>
        <span class="task-content" v-if="['reportName'].includes(item.prop)">{{
          row[item.prop]
        }}</span>
        <span
          @click="downloadUrl(row.excelData, `${row.reportName}结果文件`)"
          v-if="item.prop === 'excelData'"
          class="font-ble"
          >{{ getResultTxt(row) }}</span
        >
        <span
          @click="downloadUrl(row.logLink, `${row.reportName}执行日志`)"
          class="font-ble"
          v-if="item.prop === 'logLink'"
          >{{ row.logLink ? '执行日志' : '' }}</span
        >
        <span
          @click="downloadUrl(row.SourceExcelLink, `${row.reportName}上传文件`)"
          class="font-ble"
          v-if="item.prop === 'SourceExcelLink'"
          >{{ row.SourceExcelLink ? '上传文件' : '' }}</span
        >
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="{ row }">
        <el-button link type="danger" size="small" @click="deleteTask(row)">删除</el-button>
        <el-button
          link
          type="primary"
          size="small"
          @click="router.push(`/develop/taskdetail/${row.reportId}`)"
          >查看</el-button
        >

        <el-button link type="info" size="small" @click="pauseTask(row.reportId)">中止</el-button>
        <el-button link type="primary" size="small" @click="startExe(row.reportId)">执行</el-button>
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
import { reactive, watch, computed } from 'vue'
import dayjs from 'dayjs'
import QueryTask from '../components/QueryTask.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import {
  getTaskListReq,
  updateTaskReq,
  deleteTaskReq,
  deleteTaskTypeReq,
  deleteFileReq,
  getTaskSqlsReq
} from '../api/report'
import router from '../router/index'
import { ElMessageBoxFn } from '../util/toast'
import { priorityMap, taskStatusMap, orgMap } from '../constant/index'
import { toast } from '../util/toast'
import { getColorByState } from '../util/statefont'
import { formatLink, downloadUrl, getResultTxt, insertIdIntoArr } from '../util/formatLink'
import { getLocalStore } from '../util/localStorage'
import emitter from '../util/eventbus'

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
    // {
    //   label: '一次性任务执行时间',
    //   prop: 'oneTimeExe'
    // },
    // {
    //   label: '周期性任务时间范围',
    //   prop: 'periodExeTime'
    // },
    {
      label: '任务状态',
      prop: 'reportState'
    },
    // {
    //   label: '任务优先级',
    //   prop: 'reportPriority'
    // },
    {
      label: '任务所属部门',
      prop: 'taskAssignOrg'
    },
    // {
    //   label: '最后执行时间',
    //   prop: 'lastTime'
    // },
    {
      label: '结果excel',
      prop: 'excelData'
    },
    {
      label: 'log日志',
      prop: 'logLink'
    },
    {
      label: '上传文件',
      prop: 'SourceExcelLink'
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

emitter.on('refreshList', (e) => {
  getTaskList()
})

const startExe = async (taskId) => {
  const result = await getTaskSqlsReq({ taskId })
  if (result.data.taskSqls) {
    state.loading = true
    await updateTaskReq({
      reportId: taskId,
      reportState: 1,
      lastTime: '2020-01-01 00:00:00'
    })
    getTaskList()
  } else {
    toast('该任务没有填写sql脚本无法执行', 'warning')
  }
}

const deleteTask = (row) => {
  const { reportId, reportTypeId, reportName, sourceLink, logLinkCopy } = row
  ElMessageBoxFn(`确定要删除${reportName}吗?`, async () => {
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
      if (logLinkCopy) {
        await deleteFileReq({
          fileName: logLinkCopy,
          path: 'log'
        })
      }
      await deleteRelatedFiles(row)

      await deleteTaskReq({
        reportId
      })
      toast('任务已删除')
      getTaskList()
    } catch (e) {
      // await deleteTaskReq({
      //   reportId: taskId
      // })
    }
  })
}

const deleteRelatedFiles = (row) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (row.LargeCategory === '一次性') {
        row.excelDataCp &&
          (await deleteFileReq({
            fileName: row.excelDataCp,
            path: 'out'
          }))
        resolve()
      } else {
        let count = 0
        if (row.children.length) {
          row.children.map(async (i) => {
            await deleteFileReq({
              fileName: i.excelDataCp,
              path: 'out'
            })
            count === row.children.length - 1 && resolve()
            count++
          })
        } else {
          resolve()
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

const pauseTask = (taskId) => {
  ElMessageBoxFn('确定要中止这条任务吗?', async () => {
    try {
      await updateTaskReq({
        reportId: taskId,
        reportState: 3
      })
      toast('任务已中止')
      getTaskList()
    } catch (e) {}
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
      logLinkCopy: i.logLink,
      taskAssignOrg: orgMap[i.taskAssignOrg],
      SourceExcelLink: getLink(i.SourceExcelLink, 'upload')
    }
  })
  state.tableData = insertIdIntoArr(state.tableData)
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
