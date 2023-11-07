<template>
  <el-card class="card-admin">
    <form :v-model="queryForm">
      <div class="row-item">
        <div class="query-select">
          <span class="query-title">报表时间范围</span>
          <el-date-picker
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model="queryForm.createTime"
            clearable
          ></el-date-picker>
        </div>
        <div class="query-select-keyword">
          <span class="query-title">关键字</span>
          <el-input placeholder="请输入关键字" v-model="queryForm.keyword" clearable></el-input>
        </div>
      </div>
    </form>
    <div class="btn-wrap">
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button type="danger" @click="uploadFn">上传脚本</el-button>
    </div>
  </el-card>
  <el-dialog
    :show-close="false"
    :close-on-press-escape="false"
    v-model="state.showUploadDialog"
    title="上传报表"
  >
    <el-select placeholder="请选择报表周期类型" v-model="state.selectPeriodType">
      <el-option v-for="item in periodType" :label="item.label" :value="item.value">{{
        item.label
      }}</el-option>
    </el-select>
    <el-button type="primary" @click="state.showUploadDialog = false">取消</el-button>
    <Upload btn-txt="上传报表" @handleFileChange="handleFileChange" btn-type="danger" />
  </el-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { getLocalStore } from '../util/localStorage'
import Upload from './Upload.vue'
import { uploadReq } from '../api/report'
import { periodType, periodTypeMap } from '../constant/index'

const emit = defineEmits(['handleQuery', 'createTask'])
const role = getLocalStore('userInfo').role
let queryForm = reactive({
  category: null,
  status: null,
  keyword: '',
  createTime: null,
  leadOrg: null,
  assistOrg: null,
  taskSource: null,
  ariseOrg: null
})
const state = reactive({
  showUploadDialog: false,
  selectPeriodType: null
})

const handleQuery = () => {
  emit('handleQuery', queryForm)
}

const handleFileChange = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  await uploadReq(formData)
  //toast('上传成功')
  //emit('refreshList')
}

const uploadFn = () => {
  state.showUploadDialog = true
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
