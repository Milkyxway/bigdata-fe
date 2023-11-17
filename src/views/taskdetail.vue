<template>
  <NavBack />
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="bold">任务详情</span>
      </div>
    </template>
    <PeriodForm
      v-if="state.detail?.LargeCategory === '周期性' && state.init"
      :detail="state.detail"
      :typeDetail="state.reportTypeDetail"
    />
    <OneTimeForm
      v-if="state.detail?.LargeCategory === '一次性' && state.init"
      :detail="state.detail"
    />
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
      :excelLink="getExcelLink"
      @refreshPage="refreshPage"
    />
  </el-card>
</template>
<script setup>
import { watch, ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import NavBack from '../components/NavBack.vue'
import PeriodForm from '../components/PeriodForm.vue'
import OneTimeForm from '../components/OneTimeForm.vue'
import { getTaskDetailReq, getReportTypeReq, getTaskSqlsReq } from '../api/report'
import FillSql from '../components/FillSql.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import { formatLink } from '../util/formatLink'
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
  reportTypeDetail: {},
  init: false
})
const sqlArr = ref([])

const refreshPage = () => {
  getTaskDetail()
  getTaskSqls()
}

const getExcelLink = computed(() => formatLink(state.detail?.SourceExcelLink, 'upload'))

const addSqlStrs = () => {
  sqlArr.value.push({
    reportSqlData: '',
    chooseSqlType: typeToCn(1)
  })
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
  if (!reportTypeId) {
    state.init = true
    return
  }
  const result = await getReportTypeReq({
    reportTypeId
  })
  state.reportTypeDetail = result.data
  state.init = true
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
