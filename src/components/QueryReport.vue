<template>
  <el-card class="card-admin">
    <form :v-model="queryForm">
      <div class="row-item">
        <!-- <div class="query-select">
          <span class="query-title">报表时间范围</span>
          <el-date-picker
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model="queryForm.createTime"
            clearable
          ></el-date-picker>
        </div> -->
        <div class="query-select-keyword">
          <span class="query-title">关键字</span>
          <el-input placeholder="请输入关键字" v-model="queryForm.keyword" clearable></el-input>
        </div>
      </div>
    </form>
    <div class="btn-wrap">
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <!-- <el-button type="danger" @click="uploadFn">上传脚本</el-button> -->
    </div>
  </el-card>
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
  keyword: ''
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
