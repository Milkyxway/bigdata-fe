<template>
  <el-card class="card-admin">
    <form :v-model="queryForm">
      <div class="row-item">
        <div class="query-select-keyword">
          <span class="query-title">关键字</span>
          <el-input placeholder="请输入关键字" v-model="queryForm.keyword" clearable></el-input>
        </div>
      </div>
    </form>
    <div class="btn-wrap">
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <!-- <Upload btn-txt="上传脚本" @handleFileChange="handleFileChange" btn-type="danger" /> -->
      <el-button type="primary" @click="state.showUploadDialog = true">添加脚本</el-button>
    </div>
  </el-card>
  <EditorInDialog
    v-model:content="state.sqlContent"
    v-model:showUploadDialog="state.showUploadDialog"
    @updateContent="(val) => (state.sqlContent = val)"
    @closeModal="state.showUploadDialog = false"
    type="add"
    @refreshList="refreshList"
  />
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import EditorInDialog from './EditorInDialog.vue'
import { getLocalStore } from '../util/localStorage'
import Upload from './Upload.vue'
import { uploadReq, addCommonUseSqlAddReq } from '../api/report'
import { toast } from '../util/toast'

const formRef = ref()
const emit = defineEmits(['handleQuery', 'createTask', 'refreshList'])
const state = reactive({
  fileList: [],
  showUploadDialog: false,
  sqlContent: ''
})
let queryForm = reactive({
  keyword: ''
})

const handleQuery = () => {
  emit('handleQuery', queryForm)
}

const refreshList = () => {
  emit('refreshList')
}

const handleFileChange = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  await uploadReq(formData)
  toast('上传成功')
  emit('refreshList')
}

const uploadSqls = async () => {
  const result = await addCommonUseSqlAddReq({
    sqlContent: text.value
  })
  toast('上传成功！')
  state.showUploadDialog = false
  emit('refreshList')
}
</script>
<style scoped>
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.query-select {
  margin: 0 20px 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  /* align-items: center; */
  /* flex: auto; */
}
.query-select-keyword {
  margin: 0 20px 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.query-title {
  display: inline-block;
  /* width: 60px; */
  margin-right: 10px;
  white-space: nowrap;
}
.white-space {
  height: 10px;
}
.btn-wrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 0 0 0;
}
.card-admin {
  border: none;
  :deep(.el-input) {
    width: 195px !important;
  }
  :deep(.el-input__wrapper) {
    width: 195px !important;
    /* border: 1px solid #7f7fd5; */
    /* border-radius: 4px; */
  }
}
.card-section {
  border: none;
  :deep(.el-input) {
    width: 280px !important;
  }
  :deep(.el-input__wrapper) {
    width: 280px !important;
    /* border: 1px solid #7f7fd5; */
    /* border-radius: 4px; */
  }
}
</style>
