<template>
  <el-card>
    <div class="row-item">
      <span class="label">无需匹配类型需求</span>
      <SelectCommon
        :selections="state.noMatch"
        v-model:select="state.selectTask"
        @updateSelect="(val) => (state.selectTask = val)"
      />
      <el-date-picker
        type="daterange"
        v-model="state.timeRange"
        start-placeholder="起始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-select
        v-model="state.selectStand"
        multiple
        collapse-tags
        placeholder="请选择广电站 不选为全部"
      >
        <el-option
          v-for="item in stands"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" plain @click="createTask('noMatch')" class="confirm-btn"
        >立即执行</el-button
      >
    </div>
    <div class="row-item font-hint">*按需选择时间范围和广电站 广电站不选择为全量</div>
    <WhiteSpace />
    <div class="row-item">
      <span class="label">匹配类型需求</span>
      <SelectCommon
        :selections="state.needMatch"
        v-model:select="state.selectTask"
        @updateSelect="(val) => (state.selectTask = val)"
      />
      <el-button type="primary" plain @click="createTask('needMatch')" class="confirm-btn"
        >创建任务</el-button
      >
      <div class="btn-wrap">
        <Upload :btnTxt="'上传匹配文件并执行'" @handleFileChange="handleFileChange" />
      </div>
      <!-- <el-button type="primary" plain @click="confirm">开始执行</el-button> -->
    </div>
    <WhiteSpace />
  </el-card>
</template>
<script setup>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import {
  getTaskListReq,
  updateTaskReq,
  uploadReq,
  createTaskReq,
  getTaskSqlsReq,
  addSqlBatchReq
} from '../api/report'
import SelectCommon from '../components/SelectCommon.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import Upload from '../components/Upload.vue'
import { getLocalStore } from '../util/localStorage'
import { toast } from '../util/toast'
import { stands, standMap } from '../constant/index'
const state = reactive({
  taskList: [],
  selectTask: '',
  taskId: 0,
  noMatch: [],
  needMatch: [],
  newReportId: '',
  timeRange: null,
  selectStand: null
})

const userId = getLocalStore('userInfo').userId
const region = getLocalStore('userInfo').region
const orgnization = getLocalStore('userInfo').orgnization
const formatArr = (arr) => {
  return arr.map((i) => {
    return {
      label: i.reportName,
      value: i.reportId
    }
  })
}
const getDemandList = async () => {
  const result = await getTaskListReq({
    LargeCategory: '',
    pageSize: 200,
    pageNum: 0,
    region,
    reportName: '',
    username: 'dev'
  })
  state.taskList = result.data.list
  const devIdByRegion = region === 'wx' ? [13] : region === 'yx' ? [20] : [19]
  state.needMatch = formatArr(
    result.data.list.filter(
      (i) =>
        i.SourceExcelLink &&
        devIdByRegion.includes(i.custID) &&
        orgnization === i.taskAssignOrg &&
        i.LargeCategory === '一次性'
    )
  )
  state.noMatch = formatArr(
    result.data.list.filter(
      (i) =>
        !i.SourceExcelLink &&
        devIdByRegion.includes(i.custID) &&
        orgnization === i.taskAssignOrg &&
        i.LargeCategory === '一次性'
    )
  )
}

const handleFileChange = async (file) => {
  const now = dayjs().format('YYYYMMDDHHmmss')
  const fileSplitLength = file.name.split('.').length
  const fileSuffix = file.name.split('.')[fileSplitLength - 1]
  const fileName = `${now}.${fileSuffix}`
  const copyFile = new File([file], `${fileName}`)
  const formData = new FormData()
  formData.append('file', copyFile)
  await uploadReq(formData)
  toast('上传成功')
  await updateTaskReq({
    reportId: state.newReportId,
    SourceExcelLink: copyFile.name,
    reportState: 1
  })
  toast('收到该需求了，正在努力执行～')
}

// 获取所选任务对应的sql
const getTaskRelatedSql = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getTaskSqlsReq({ taskId: state.selectTask })
      resolve(type === 'needMatch' ? res.data.taskSqls : modifySql(res.data.taskSqls[0]))
    } catch (e) {
      reject(e)
    }
  })
}

const modifySql = (result) => {
  let sqlModify = result.reportSqlData
  if (state.timeRange) {
    const { timeRange } = state
    const startTime = dayjs(timeRange[0]).format('YYYYMMDD')
    const endTime = dayjs(timeRange[1]).format('YYYYMMDD')
    sqlModify = sqlModify.replace('#startTime', startTime).replace('#endTime', endTime)
  }
  const condition = state.selectStand
    ? `(${state.selectStand.map((i) => `'${standMap[i]}'`).join(',')})`
    : `(${stands.map((i) => standMap[i]).join(',')})`
  sqlModify = sqlModify.replace(' #standList', condition)
  return [{ ...result, reportSqlData: sqlModify }]
}

// 把所选任务的sql插入到新的任务中 复制
const insertSqlToTask = (reportId, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqls = await getTaskRelatedSql(type)
      await addSqlBatchReq(
        sqls.map((i) => {
          return [reportId, i.reportSqlData, i.sqlType, i.ExcelTable, i.SourceSheet, i.TargetSheet]
        })
      )
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
/**
 * 创建任务 塞sql 更新状态变成执行
 */
const createTask = async (type) => {
  if (!state.selectTask) {
    return toast('请先选择一种需求', 'error')
  }
  const selectTask = state.taskList.filter((i) => i.reportId === state.selectTask)[0]
  const noon = new Date().getHours() < 12 ? '09:00:00' : '12:00:00'
  const { reportId, username, reportTypeName, excelData, ...rest } = selectTask // 这行没有用到的字段不能删除 为了取rest里的字段们
  const res = await createTaskReq({
    ...rest,
    reportLink: '',
    SourceExcelLink: '',
    logLink: '',
    lastTime: '',
    OneTime: `${dayjs().format('YYYY-MM-DD')} ${noon}`,
    lastTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
    reportState: 0,
    custID: userId
  })
  await insertSqlToTask(res.data.reportId, type)
  state.newReportId = res.data.reportId
  if (type === 'noMatch') {
    await updateTaskReq({
      reportId: res.data.reportId,
      reportState: 1
    })
    toast('收到该需求了，正在努力执行～')
  } else {
    toast('创建任务成功！')
  }
}
getDemandList()
</script>
<style scoped>
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.label {
  display: inline-block;
  width: max-content;
  text-align: left;
  margin-right: 10px;
}
.btn-wrap {
  margin: 0 10px;
}
.confirm-btn {
  margin-left: 10px;
}
:deep(.el-date-editor) {
  margin: 0 10px;
}
.font-hint {
  color: #f56c6c;
  font-size: 12px;
}
</style>
