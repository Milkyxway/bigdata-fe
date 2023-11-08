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
    <el-form-item :label-width="formLabelWidth" label="周期任务执行时间">
      <div class="time-row">
        <SelectCommon
          :selections="hour"
          v-model:select="state.formData.hour"
          @updateSelect="(val) => (state.formData.hour = val)"
        />
        <span>时</span>
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
  <el-button type="primary" @click="submit">提交</el-button>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import { createTaskReq } from '../api/report'
import { periodType, priority, periodTypeMap } from '../constant/index'
import SelectCommon from './SelectCommon.vue'
import { toast } from '../util/toast'

const formRef = ref()
const formLabelWidth = '140px'
const state = reactive({
  formData: {
    reportName: '',
    reportPriority: 99,
    hour: ''
  },
  taskId: ''
})
const hour = ref([
  {
    label: 9,
    value: 9
  },
  {
    label: 12,
    value: 12
  }
])
const emit = defineEmits(['updateTaskId'])
const submit = () => {
  formRef.value.validate(async (resolve) => {
    if (resolve) {
      const {
        formData: { reportName, reportPriority }
      } = state
      const result = await createTaskReq({
        LargeCategory: '一次性',
        reportName,
        reportPriority
      })
      toast('创建成功！')
      state.taskId = result.data.reportId
      emit('updateTaskId', result.data.reportId)
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
