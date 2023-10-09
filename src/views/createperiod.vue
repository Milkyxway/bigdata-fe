<template>
  <el-radio-group v-model="state.chooseTaskType" v-if="!state.taskId">
    <el-radio-button
      v-for="(item, index) in taskType"
      v-bind:key="index"
      :label="item.label"
      :name="item.value"
    />
  </el-radio-group>
  <div v-if="state.taskId">{{ state.chooseTaskType }}</div>
  <!-- <el-form ref="formRef" :model="state.formData"> -->

  <!-- <el-form-item
      v-if="state.chooseTaskType === '一次性任务'"
      :label-width="formLabelWidth"
      label="任务执行时间"
      prop="OneTime"
      :rules="[{ required: true, message: '请选择任务执行时间', trigger: 'blur' }]"
    >
      <el-date-picker v-model="state.formData.OneTime"></el-date-picker>
    </el-form-item>
  
   
  </el-form> -->
  <OneTimeForm v-if="state.chooseTaskType === '一次性任务'" />
  <PeriodForm v-if="state.chooseTaskType === '周期性任务'" />
  <el-input
    v-if="state.taskId"
    type="textarea"
    placeholder="请输入sql语句"
    v-model="state.sqlInput"
  ></el-input>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { createTaskReq } from '../api/report'
import PeriodForm from '../components/PeriodForm.vue'
import OneTimeForm from '../components/OneTimeForm.vue'

const taskType = [
  {
    label: '一次性任务',
    value: '一次性'
  },
  {
    label: '周期性任务',
    value: '周期性'
  }
]
const formRef = ref()
const formLabelWidth = '140px'
const state = reactive({
  chooseTaskType: '一次性任务',
  formData: {
    reportName: '',
    oneTimeExe: '',
    timeRange: []
  },
  taskId: 0,
  sqlInput: ''
})
watch(
  () => state.chooseTaskType,
  (val) => {
    state.formData = {
      reportName: ''
    }
    state
  }
)

const formatDate = (date) => dayjs(date).format()
const commit = () => {
  const {
    chooseTaskType,
    formData: { oneTimeExe, timeRange, reportName }
  } = state
  formRef.value.validate(async (res) => {
    if (res) {
      let params = { reportName }
      if (chooseTaskType === '一次性任务') {
        params = {
          ...params,
          LargeCategory: '一次性',
          oneTimeExe: formatDate(oneTimeExe)
        }
      } else {
        params = {
          ...params,
          LargeCategory: '周期性',
          startTime: formatDate(timeRange[0]),
          endTime: formatDate(timeRange[1])
        }
      }
      try {
        const result = await createTaskReq(params)
        debugger
        if (result.data.taskId) {
          state.taskId = result.data.taskId
          toast('创建任务成功！')
        }
      } catch (e) {}
    }
  })
}
</script>
