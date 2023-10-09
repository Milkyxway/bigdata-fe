<template>
  <el-form ref="formRef" :model="state.formData">
    <el-form-item
      :label-width="formLabelWidth"
      label="任务名称"
      prop="reportName"
      :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]"
    >
      <el-input v-model="state.formData.reportName" placeholder="请输入任务名称"></el-input>
    </el-form-item>
  </el-form>
  <el-button type="primary">提交</el-button>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
const formRef = ref()
const formLabelWidth = '140px'
const state = reactive({
  formData: {
    reportName: ''
  }
})
</script>
