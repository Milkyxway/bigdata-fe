<template>
  <el-card>
    <el-form ref="formRef">
      <el-row>
        <el-col :span="8">
          <el-form-item label="任务名称" :label-width="formLabelWidth">
            <el-input placeholder="请输入任务名称" v-model="state.formData.reportName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务类型" :label-width="formLabelWidth">
            <SelectCommon
              :selections="periodTypes"
              v-model:select="state.formData.periodType"
              @updateSelect="(val) => (state.formData.periodType = val)"
            ></SelectCommon>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务状态" :label-width="formLabelWidth">
            <SelectCommon
              :selections="state.taskStatusList"
              v-model:select="state.formData.reportState"
              @updateSelect="(val) => (state.formData.reportState = val)"
            ></SelectCommon>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="任务优先级" :label-width="formLabelWidth">
            <SelectCommon
              :selections="priority"
              v-model:select="state.formData.reportPriority"
              @updateSelect="(val) => (state.formData.reportPriority = val)"
            ></SelectCommon>
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
import SelectCommon from './SelectCommon.vue'
import { taskStatusList, priority } from '../constant'
import { createTaskReq } from '../api/report'
import router from '../router/index'
const state = reactive({
  formData: {
    reportName: '',
    periodType: '',
    reportPriority: '',
    reportState: ''
  },
  taskStatusList,
  priority
})
const formRef = ref(null)
const formLabelWidth = '150px'
const emits = defineEmits('handleQuery')
const handleQuery = () => {
  emits('handleQuery', state.formData)
}
const reset = () => {
  Object.keys(state.formData).map((i) => {
    state.formData[i] = ''
  })
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
