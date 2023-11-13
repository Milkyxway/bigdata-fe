<template>
  <div class="row-item">
    <span class="label">需求名称</span>
    <SelectCommon
      :selections="state.taskList"
      v-model:select="state.selectTask"
      @updateSelect="(val) => (state.selectTask = val)"
    />
    <div class="btn-wrap">
      <Upload :btnTxt="'上传匹配文件'" @handleFileChange="handleFileChange" />
    </div>

    <el-button type="primary" plain @click="confirm">开始执行</el-button>

    <el-button @click="goCreate" v-showByAuth="{ role, showCondition: ['developer'] }"
      >创建需求</el-button
    >
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import { getTaskListReq, updateTaskReq, uploadReq, deleteFileReq } from '../api/report'
import SelectCommon from '../components/SelectCommon.vue'
import Upload from '../components/Upload.vue'
import router from '../router/index'
import { getLocalStore } from '../util/localStorage'
import { toast } from '../util/toast'
const state = reactive({
  taskList: [],
  selectTask: '',
  taskId: 0
})
const role = getLocalStore('userInfo').role
const getDemandList = async () => {
  const result = await getTaskListReq({
    LargeCategory: '一次性',
    pageSize: 100,
    pageNum: 0
  })
  state.taskList = result.data.list.map((i) => {
    return {
      label: i.reportName,
      value: i.reportId
    }
  })
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
  const fileSuffix = file.name.split('.')[1]
  const fileName = `${now}.${fileSuffix}`
  const copyFile = new File([file], `${fileName}`)
  const formData = new FormData()
  formData.append('file', copyFile)
  await deleteExistFile()
  await uploadReq(formData)
  toast('上传成功')
  await updateTaskReq({
    reportId: props.taskId,
    SourceExcelLink: copyFile.name
  })
}

const goCreate = () => {
  // router.push('/report/createdemand')
  router.push('/develop/create/onetime')
}

const confirm = async () => {
  const result = await updateTaskReq({
    reportId: state.selectTask,
    reportState: 1
  })
  toast('收到该需求了，正在努力执行～')
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
  width: 100px;
  text-align: left;
}
.btn-wrap {
  margin: 0 10px;
}
</style>
