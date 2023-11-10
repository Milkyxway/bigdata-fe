<template>
  <NavBack />
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="bold">任务详情</span>
      </div>
    </template>
    <div class="card-content">
      <div class="row-item">
        <div class="bold space">任务名称:</div>
        <div>{{ state.detail?.reportName }}</div>
      </div>
      <div class="row-item">
        <div class="bold space">任务类型:</div>
        <div class="content">{{ state.detail?.LargeCategory }}</div>
      </div>
      <div class="row-item" v-if="state.detail?.LargeCategory === '周期性'">
        <div class="bold space">任务时间范围:</div>
        <div>{{ getTime(state.detail?.TimeOn) }} - {{ getTime(state.detail?.endTime) }}</div>
      </div>
      <div class="row-item">
        <div class="bold space">任务状态:</div>
        <div>{{ getTaskStatus }}</div>
      </div>
      <div class="row-item" v-if="state.detail?.reportPriority">
        <div class="bold space">任务优先级:</div>
        <div>{{ getPriority(state.detail?.reportPriority) }}</div>
      </div>
      <div class="row-item">
        <div class="bold space">报表类型:</div>
        <div>{{ state.reportTypeDetail?.reportTypeName }}</div>
      </div>
      <div class="row-item" v-if="state.detail?.LargeCategory === '周期性'">
        <div class="bold space">计划周期执行时间:</div>
        <div>{{ getExeTime }}</div>
      </div>
      <div class="row-item" v-if="state.detail?.lastTime">
        <div class="bold space">最后执行时间:</div>
        <div>{{ getTime(state.detail?.lastTime) }}</div>
      </div>
      <div class="row-item" v-if="state.taskSqls">
        <div class="bold space">任务对应sql语句:</div>
        <div class="sql-wrap">
          <div v-for="(item, index) in state.taskSqls" v-bind:key="index">
            <div>{{ item.reportSqlData }};</div>
          </div>
        </div>
      </div>
      <div class="row-item" v-if="state.detail?.SourceExcelLink">
        <div class="bold space">上传文件:</div>
        <div>
          {{ getExcelLink }}
          <span @click="downloadFile" class="status-submit">下载</span>
        </div>
      </div>
      <div class="row-item">
        <div class="bold space">创建时间:</div>
        <div>{{ getTime(state.detail?.createTime, 'YYYY/MM/DD HH:mm:ss') }}</div>
      </div>
    </div>
  </el-card>
  <WhiteSpace />
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="bold">分步填写sql</span>
      </div>
    </template>
    <FillSql
      :sqlArr="sqlArr"
      @addSqlInput="addSqlStrs"
      @deleteSqlInput="deleteSqlInput"
      :taskId="taskId"
    />
  </el-card>
</template>
<script setup>
import { watch, ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import NavBack from '../components/NavBack.vue'
import { getTaskDetailReq, getReportTypeReq, getTaskSqlsReq } from '../api/report'
import { priorityMap, periodTypeMap, taskStatusMap, weekMap } from '../constant/index'
import FillSql from '../components/FillSql.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
const route = useRoute()
const taskId = ref(route.params.taskId)
const typeToCn = (sqlTypeId) => {
  const map = {
    1: '执行类无输出',
    2: '上传',
    3: '查询类有输出'
  }
  return map[sqlTypeId]
}
const state = reactive({
  detail: {},
  taskSqls: [],
  reportTypeDetail: {}
})
const sqlArr = ref([])

const getTime = computed(() => {
  return function (time, format = 'YYYY/MM/DD') {
    return dayjs(time).format(format)
  }
})

const getTaskStatus = computed(() => {
  return taskStatusMap[state.detail?.reportState]
})
const getExeTime = computed(() => {
  let time
  if (!state.detail?.reportTypeName) {
    return '-'
  } else {
    const {
      detail: { modeName, reportTypeName }
    } = state
    switch (state.detail?.reportTypeName) {
      case '月报':
      case '周报':
        const list = modeName.split(',')
        const date = list[0]
        const hour = list[1].substr(0, 2)
        const min = list[1].substr(2, 2)
        time =
          reportTypeName === '月报'
            ? `每月${date}日 ${hour}:${min}`
            : `${weekMap[date]} ${hour}:${min}`
        break
      case '日报':
        time = `每天${modeName.substr(0, 2)}:${modeName.substr(2, 2)}`
        break
    }
    return time
  }
})

const getExcelLink = computed(
  () => `http://172.16.179.2:7002/public/upload/${state.detail?.SourceExcelLink}`
)

const getPriority = computed(() => {
  return function (priority) {
    return priorityMap[priority]
  }
})

const addSqlStrs = () => {
  sqlArr.value.push({
    reportSqlData: '',
    chooseSqlType: typeToCn(1)
  })
}

const downloadFile = () => {
  window.location.href = getExcelLink.value
}

const deleteSqlInput = (index) => {
  sqlArr.value.splice(index, 1)
}
const getTaskDetail = async () => {
  const result = await getTaskDetailReq({ taskId: taskId.value })
  state.detail = result.data
  getReportType(result.data.reportTypeId)
}
const getReportType = async (reportTypeId) => {
  const result = await getReportTypeReq({
    reportTypeId
  })
  state.reportTypeDetail = result.data
  // state.detail = {
  //   ...state.detail,
  //   ...result.data
  // }
}
const getTaskSqls = async () => {
  const result = await getTaskSqlsReq({
    taskId: taskId.value
  })

  state.taskSqls = result.data.taskSqls
  if (result.data.taskSqls) {
    sqlArr.value = result.data.taskSqls.map((i) => {
      return {
        ...i,
        chooseSqlType: typeToCn(i.sqlType)
      }
    })
  } else {
    sqlArr.value = [
      {
        reportSqlData: '',
        chooseSqlType: '执行类无输出'
      }
    ]
  }
}
getTaskDetail()
getTaskSqls()
</script>
<style scoped>
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0 0 10px 0;
}
.card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bold {
  font-weight: bold;
}
.space {
  padding-right: 20px;
  min-width: 200px;
  text-align: left;
}
.content {
  text-align: left;
}
.el-form-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
.inline-wrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  user-select: none;
}
.status-finish {
  color: #67c23a;
}
.status-delay-process {
  color: #e6a23c;
  font-weight: bold;
}
.status-processing {
  color: #e6a23c;
}
.status-confirm {
  color: #f56c6c;
}
.status-delay {
  color: #f56c6c;
  font-weight: bold;
}
.status-adjust {
  color: #b1b3b8;
}
.status-submit {
  color: #0076fe;
}
.white-space {
  height: 10px;
}
.task-goal {
  width: 200px;
}
.sql-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
