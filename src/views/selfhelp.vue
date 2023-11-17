<template>
  <div class="row-item">
    <span class="label">无需匹配类型需求</span>
    <SelectCommon
      :selections="state.noMatch"
      v-model:select="state.selectTask"
      @updateSelect="(val) => (state.selectTask = val)"
    />
    <el-button type="primary" plain @click="createTask('noMatch')">确认</el-button>
  </div>
  <div class="row-item">
    <span class="label">匹配类型需求</span>
    <SelectCommon
      :selections="state.needMatch"
      v-model:select="state.selectTask"
      @updateSelect="(val) => (state.selectTask = val)"
    />
    <el-button type="primary" plain @click="createTask('needMatch')">确认</el-button>
    <div class="btn-wrap">
      <Upload :btnTxt="'上传匹配文件并执行'" @handleFileChange="handleFileChange" />
    </div>
    <!-- <el-button type="primary" plain @click="confirm">开始执行</el-button> -->
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import {
  getTaskListReq,
  updateTaskReq,
  uploadReq,
  deleteFileReq,
  createTaskReq,
  addSqlReq,
  getTaskSqlsReq
} from '../api/report'
import SelectCommon from '../components/SelectCommon.vue'
import Upload from '../components/Upload.vue'
import router from '../router/index'
import { getLocalStore } from '../util/localStorage'
import { toast } from '../util/toast'
const state = reactive({
  taskList: [],
  selectTask: '',
  taskId: 0,
  noMatch: [],
  needMatch: [],
  newReportId: ''
})
const userId = getLocalStore('userInfo').userId
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
    LargeCategory: '一次性',
    pageSize: 100,
    pageNum: 0
  })
  state.taskList = result.data.list
  state.needMatch = formatArr(
    result.data.list.filter((i) => i.SourceExcelLink && [13].includes(i.custID))
  )
  state.noMatch = formatArr(
    result.data.list.filter((i) => !i.SourceExcelLink && [13].includes(i.custID))
  )
}

const deleteExistFile = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await getTaskListReq({
        reportId: state.selectTask,
        pageSize: 100,
        pageNum: 0
      })
      if (result.data.list[0].SourceExcelLink) {
        // 已经存在
        //删除文件
        await deleteFileReq({ fileName: result.data.list[0].SourceExcelLink })
        resolve()
      } else {
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
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

const goCreate = () => {
  router.push('/develop/create/onetime')
}

const confirm = async () => {
  const now = new Date().getHours() < 9 ? '09:00:00' : '12:00:00'
  const result = await updateTaskReq({
    reportId: state.selectTask,
    reportState: 1,
    lastTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
    OneTime: `${dayjs().format('YYYY-MM-DD')} ${now}`
  })
  toast('收到该需求了，正在努力执行～')
}

// 获取所选任务对应的sql
const getTaskRelatedSql = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getTaskSqlsReq({ taskId: state.selectTask })
      resolve(res.data.taskSqls)
    } catch (e) {
      reject(e)
    }
  })
}

// 把所选任务的sql插入到新的任务中 复制
const insertSqlToTask = (reportId) => {
  return new Promise(async (resolve, reject) => {
    let count = 0
    try {
      const sqls = await getTaskRelatedSql()
      sqls.map(async (i) => {
        const { reportSqlId, ...rest } = i
        await addSqlReq({
          ...rest,
          reportId
        })
        count === sqls.length - 1 && resolve()
        count++
      })
    } catch (e) {
      reject(e)
    }
  })
}
/**
 * 创建任务 塞sql 更新状态变成执行
 */
const createTask = async (type) => {
  const selectTask = state.taskList.filter((i) => i.reportId === state.selectTask)[0]
  const noon = new Date().getHours() < 12 ? '09:00:00' : '12:00:00'
  const { reportId, ...rest } = selectTask
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
  await insertSqlToTask(res.data.reportId)
  if (type === 'noMatch') {
    await updateTaskReq({
      reportId: res.data.reportId,
      reportState: 1
    })
    toast('收到该需求了，正在努力执行～')
  } else {
    state.newReportId = res.data.reportId
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
  width: 300px;
  text-align: left;
}
.btn-wrap {
  margin: 0 10px;
}
</style>
