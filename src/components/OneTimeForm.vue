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
    <el-form-item :label-width="formLabelWidth" label="任务执行时间">
      <div class="time-row">
        <el-date-picker v-model="state.formData.date"></el-date-picker>
        <SelectCommon
          :selections="hour"
          v-model:select="state.formData.hour"
          @updateSelect="(val) => (state.formData.hour = val)"
        />
      </div>
    </el-form-item>
    <el-form-item
      :label-width="formLabelWidth"
      label="任务优先级"
      prop="reportPriority"
      :rules="[{ required: true, message: '请选择任务优先级', trigger: 'blur' }]"
    >
      <SelectCommon
        :selections="priority"
        v-model:select="state.formData.reportPriority"
        @updateSelect="(val) => (state.formData.reportPriority = val)"
      />
    </el-form-item>
  </el-form>
  <el-form-item
    v-if="props.detail?.reportId"
    :label-width="formLabelWidth"
    label="任务状态"
    prop="reportState"
    :rules="[{ required: true, message: '请选择任务状态', trigger: 'blur' }]"
  >
    <SelectCommon
      :selections="taskStatusList"
      v-model:select="state.formData.reportState"
      @updateSelect="(val) => (state.formData.reportState = val)"
    >
    </SelectCommon>
  </el-form-item>
  <el-form-item
    :label-width="formLabelWidth"
    label="任务所属部门"
    prop="taskAssignOrg"
    :rules="[{ required: true, message: '请选择任务所属部门', trigger: 'blur' }]"
  >
    <SelectCommon
      :selections="getOrgTreeByRegion()"
      v-model:select="state.formData.taskAssignOrg"
      @updateSelect="(val) => (state.formData.taskAssignOrg = val)"
      :multiple="true"
    >
    </SelectCommon>
  </el-form-item>
  <el-button type="primary" @click="submit">{{
    props.detail?.reportId ? '修改' : '提交'
  }}</el-button>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { createTaskReq, updateTaskReq } from '../api/report'
import { priority, taskStatusList, orgMap } from '../constant/index'
import SelectCommon from './SelectCommon.vue'
import { toast } from '../util/toast'
import { getLocalStore } from '../util/localStorage'
import { getOrgTreeByRegion } from '../util/orgnization'

import emitter from '../util/eventbus'

const formRef = ref()

const userId = getLocalStore('userInfo').userId
const region = getLocalStore('userInfo').region

const state = reactive({
  formData: {
    reportName: '',
    reportPriority: 99,
    hour: '',
    date: '',
    reportState: '',
    taskAssignOrg: ''
  },
  taskId: ''
})
const hour = ref([
  {
    label: '上午',
    value: 9
  },
  {
    label: '下午',
    value: 12
  }
])

const props = defineProps({
  detail: {
    type: Object
    // default: {}
  }
})

const initVal = () => {
  if (props.detail?.reportId) {
    const { reportName, reportPriority, OneTime, reportState, taskAssignOrg } = props.detail
    state.formData = {
      reportName,
      reportPriority,
      date: dayjs(OneTime).format('YYYY-MM-DD'),
      hour: dayjs(OneTime).format('HH') == 12 ? '下午' : ' 上午',
      reportState,
      taskAssignOrg: taskAssignOrg.split(',').map((i) => orgMap[i])
    }
  }
}
initVal()

const emit = defineEmits(['updateTaskId'])
const submit = () => {
  formRef.value.validate(async (resolve) => {
    if (resolve) {
      const {
        formData: { reportName, reportPriority, date, hour, reportState, taskAssignOrg }
      } = state
      const params = {
        LargeCategory: '一次性',
        reportName,
        reportPriority,
        OneTime: `${dayjs(date).format('YYYY-MM-DD')} ${hour == 9 ? '09:00:00' : '12:00:00'}`,
        taskAssignOrg: taskAssignOrg.join(',')
      }
      const result = props.detail?.reportId
        ? await updateTaskReq({
            ...params,
            reportId: props.detail.reportId,
            reportState,
            lastTime: reportState === 1 && '2020-01-01 00:00:00'
          })
        : await createTaskReq({ ...params, custID: userId, region })
      toast('操作成功！')
      if (!props.detail?.reportId) {
        state.taskId = result.data.reportId
      }
      emit('updateTaskId', props.detail?.reportId || result.data.reportId)
      emitter.emit('refreshList')
    }
  })
}
</script>
<style scoped>
.el-select {
  width: 100%;
}
.el-input {
  width: 100%;
}
.el-textarea {
  width: 100%;
}
.time-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>
