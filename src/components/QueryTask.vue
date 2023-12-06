<template>
  <el-card>
    <el-form ref="formRef">
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务名称">
            <el-input
              placeholder="请输入任务名称"
              v-model="state.formData.reportName"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务创建人">
            <el-input
              placeholder="请输入任务创建人"
              v-model="state.formData.username"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-wrap">
      <el-button type="plain" @click="reset">重置查询</el-button>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button type="danger" @click="createTask">创建任务</el-button>
    </div>
  </el-card>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { taskStatusList, priority } from '../constant'

import router from '../router/index'
const state = reactive({
  formData: {
    reportName: '',
    username: ''
  },
  taskStatusList,
  priority
})
const formRef = ref(null)
const emits = defineEmits('handleQuery')
const handleQuery = () => {
  emits('handleQuery', state.formData)
}
const reset = () => {
  Object.keys(state.formData).map((i) => {
    state.formData[i] = ''
  })
  emits('handleQuery', state.formData)
}

const createTask = () => {
  router.push('/develop/create/:type')
}
</script>
<style scoped>
.btn-wrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>
