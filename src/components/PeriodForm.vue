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
    <el-form-item
      :label-width="formLabelWidth"
      label="任务时间范围"
      prop="timeRange"
      :rules="[{ required: true, message: '请选择任务时间范围', trigger: 'blur' }]"
    >
      <el-date-picker type="daterange" v-model="state.formData.timeRange"></el-date-picker>
    </el-form-item>
    <el-form-item
      :label-width="formLabelWidth"
      label="任务周期类型"
      prop="periodType"
      :rules="[{ required: true, message: '请选择任务周期类型', trigger: 'blur' }]"
    >
      <SelectCommon
        :selections="periodTypes"
        v-model:select="state.formData.periodType"
        @updateSelect="(val) => (state.formData.periodType = val)"
      />
    </el-form-item>
    <el-form-item :label-width="formLabelWidth" label="周期任务执行时间">
      <div v-if="state.formData.periodType == 1" class="time-row">
        <SelectCommon
          :selections="noon"
          v-model:select="state.noon"
          @updateSelect="(val) => updateSelect(val, 'noon')"
        />
      </div>
      <div v-if="state.formData.periodType == 2" class="time-row">
        <SelectCommon
          :selections="week"
          v-model:select="state.day"
          @updateSelect="(val) => updateSelect(val, 'day')"
        />
        <SelectCommon
          :selections="noon"
          v-model:select="state.noon"
          @updateSelect="(val) => updateSelect(val, 'noon')"
        />
      </div>
      <div v-if="state.formData.periodType == 3" class="time-row">
        <SelectCommon
          :selections="month"
          v-model:select="state.date"
          @updateSelect="(val) => updateSelect(val, 'date')"
        />
        <span>日</span>
        <SelectCommon
          :selections="noon"
          v-model:select="state.noon"
          @updateSelect="(val) => updateSelect(val, 'noon')"
        />
      </div>
    </el-form-item>
    <el-form-item
      :label-width="formLabelWidth"
      label="任务优先级"
      prop="priority"
      :rules="[{ required: true, message: '请选择任务优先级', trigger: 'blur' }]"
    >
      <SelectCommon
        :selections="priority"
        v-model:select="state.formData.priority"
        @updateSelect="(val) => (state.formData.priority = val)"
      />
    </el-form-item>
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
    <el-button type="primary" @click="commit" v-if="!state.taskId">{{
      props.detail?.reportId ? '修改任务' : '创建任务'
    }}</el-button>
  </el-form>
  <WhiteSpace />
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import {
  periodType,
  priority,
  periodTypeMap,
  priorityMap,
  week,
  taskStatusList
} from '../constant/index'
import { createTaskReq, createTaskTypeReq, updateTaskReq } from '../api/report'
import SelectCommon from './SelectCommon.vue'
import WhiteSpace from './WhiteSpace.vue'
import { toast } from '../util/toast'
const formRef = ref()
const month = ref(new Array(31).fill(0))
const periodTypes = ref(periodType)
const props = defineProps({
  detail: {
    type: Object
  },
  typeDetail: {
    type: Object
  }
})

// const formLabelWidth = '200px'
const state = reactive({
  modeName: '',
  day: '',
  date: '',
  noon: '',
  periodType: 1,
  priority: 99,
  formData: {
    reportName: '',
    timeRange: [],
    periodType: 1,
    priority: 99,
    reportState: ''
  },
  taskId: '',
  sqlStrs: [0]
})

const noon = ref([
  {
    label: '上午',
    value: '0900'
  },
  {
    label: '下午',
    value: '1200'
  }
])
const initVal = () => {
  if (props.detail?.reportId) {
    state.formData = {
      reportName: props.detail.reportName,
      priority: props.detail.reportPriority,
      timeRange: [props.detail.TimeOn, props.detail.endTime],
      periodType: periodType.filter((i) => i.label === props.typeDetail.reportTypeName)[0].value,
      reportState: props.detail.reportState
    }
    state.day = props.typeDetail.modeName.split(',')[0]
    state.noon = props.typeDetail.modeName.split(',')[1] <= '0900' ? '0900' : '1200'
    state.date = props.typeDetail.modeName.split(',')[0]
  }
}

const emits = defineEmits(['updateTaskId'])

const updateSelect = (data, type) => {
  state[type] = data
}

const formatArr = (arr, addOne = true) => {
  return arr.value.map((i, k) => {
    if (addOne) {
      return {
        label: k + 1 < 10 ? `0${k + 1}` : k + 1,
        value: k + 1 < 10 ? `0${k + 1}` : k + 1
      }
    }
    return {
      label: k < 10 ? `0${k}` : k,
      value: k < 10 ? `0${k}` : k
    }
  })
}

const initArrs = () => {
  month.value = formatArr(month)
  periodTypes.value = periodTypes.value.filter((i) => i.label !== '年报')
}

const formatDate = (date) => dayjs(date).format()

const getModeName = () => {
  const {
    formData: { periodType },
    day,
    date,
    noon
  } = state
  let modeName = ''
  switch (periodType) {
    //   1: '日报',
    // 2: '周报',
    // 3: '月报',
    // 4: '年报'
    case 1:
      modeName = noon
      break
    case 2:
      modeName = `${day},${noon}`
      break
    case 3:
      modeName = `${date},${noon}`
      break
  }
  return modeName
}

const validateData = () => {
  const {
    formData: { periodType },
    date,
    day,
    noon
  } = state
  let hasEmpty = false
  if (periodType === 1) {
    if (!noon) {
      hasEmpty = true
    }
  }
  if (periodType === 2) {
    if (!day || !noon) {
      hasEmpty = true
    }
  }
  if (periodType === 3) {
    if (!date || !noon) {
      hasEmpty = true
    }
  }
  if (hasEmpty) {
    toast('请完整填写周期执行时间', 'error')
    return false
  }
  return true
}

const commit = () => {
  const isUpdate = props.detail?.reportId
  formRef.value.validate(async (res) => {
    if (res) {
      if (validateData()) {
        const {
          formData: { timeRange, reportName, periodType, priority, reportState }
        } = state
        try {
          const typeRes = await createTaskTypeReq({
            reportTypeName: periodTypeMap[periodType],
            modeName: getModeName()
          })
          if (typeRes.code == 200) {
            const params = {
              reportName,
              LargeCategory: '周期性',
              TimeOn: formatDate(timeRange[0]),
              endTime: formatDate(timeRange[1]),
              reportTypeId: typeRes.data.reportTypeId,
              reportPriority: priority
            }
            const result = !isUpdate
              ? await createTaskReq({ ...params })
              : await updateTaskReq({ ...params, reportId: isUpdate, reportState })
            if (result.data.reportId && !isUpdate) {
              state.taskId = result.data.reportId
              toast('创建任务成功！')
              emits('updateTaskId', result.data.reportId)
            }
            if (isUpdate) {
              toast('修改任务成功！')
            }
          }
        } catch (e) {}
      }
    }
  })
}
initArrs()
initVal()
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
