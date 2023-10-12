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
        <div>{{ state.detail?.reportState }}</div>
      </div>
      <div class="row-item" v-if="state.detail?.reportPriority">
        <div class="bold space">任务优先级:</div>
        <div>{{ getPriority(state.detail?.reportPriority) }}</div>
      </div>
      <div class="row-item">
        <div class="bold space">报表类型:</div>
        <div>{{ state.detail?.reportTypeName }}</div>
      </div>
      <div class="row-item">
        <div class="bold space">计划周期执行时间:</div>
        <div>{{ getExeTime }}</div>
      </div>
      <div class="row-item" v-if="state.detail?.lastTime">
        <div class="bold space">最后执行时间:</div>
        <div>{{ getTime(state.detail?.lastTime) }}</div>
      </div>

      <div class="row-item">
        <div class="bold space">创建时间:</div>
        <div>{{ getTime(state.detail?.createTime, 'YYYY/MM/DD hh:mm:ss') }}</div>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { watch, ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import NavBack from '../components/NavBack.vue'
import { getTaskDetailReq, getReportTypeReq } from '../api/report'
import { priorityMap, periodTypeMap } from '../constant/index'
const route = useRoute()
const taskId = ref(route.params.taskId)
const state = reactive({
  detail: {}
})

const getTime = computed(() => {
  return function (time, format = 'YYYY/MM/DD') {
    return dayjs(time).format(format)
  }
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
        time = reportTypeName === '月报' ? `每月${date}日 ${hour}:${min}` : `${date} ${hour}:${min}`
        break
      case '日报':
        time = `每天${modeName.substr(0, 2)}:${modeName.substr(2, 2)}`
        break
    }
    return time
  }
})

const getPriority = computed(() => {
  return function (priority) {
    return priorityMap[priority]
  }
})

const getTaskDetail = async () => {
  const result = await getTaskDetailReq({ taskId: taskId.value })
  state.detail = result.data
  getReportType(result.data.reportTypeId)
}
const getReportType = async (reportTypeId) => {
  const result = await getReportTypeReq({
    reportTypeId
  })
  state.detail = {
    ...state.detail,
    ...result.data
  }
}
getTaskDetail()
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
</style>
