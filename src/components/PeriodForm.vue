<template>
  <el-form ref="formRef" :model="state.formData">
    <el-form-item
      :label-width="formLabelWidth"
      label="任务名称"
      prop="reportName"
      :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]"
    >
      <el-input
        v-model="state.formData.reportName"
        placeholder="请输入任务名称"
        :disabled="disableCondition"
      ></el-input>
    </el-form-item>
    <el-form-item
      :label-width="formLabelWidth"
      label="任务时间范围"
      prop="timeRange"
      :rules="[{ required: true, message: '请选择任务时间范围', trigger: 'blur' }]"
    >
      <el-date-picker
        type="daterange"
        v-model="state.formData.timeRange"
        :disabled="disableCondition"
      ></el-date-picker>
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
        :disabled="disableCondition"
      />
    </el-form-item>
    <el-form-item :label-width="formLabelWidth" label="周期任务执行时间">
      <div v-if="state.formData.periodType == 1" class="time-row">
        <SelectCommon
          :selections="noon"
          v-model:select="state.noon"
          @updateSelect="(val) => updateSelect(val, 'noon')"
          :disabled="disableCondition"
        />
      </div>
      <div v-if="state.formData.periodType == 2" class="time-row">
        <SelectCommon
          :selections="week"
          v-model:select="state.day"
          @updateSelect="(val) => updateSelect(val, 'day')"
          :disabled="disableCondition"
        />
        <SelectCommon
          :selections="noon"
          v-model:select="state.noon"
          @updateSelect="(val) => updateSelect(val, 'noon')"
          :disabled="disableCondition"
        />
      </div>
      <div v-if="state.formData.periodType == 3" class="time-row">
        <SelectCommon
          :selections="dates"
          v-model:select="state.date"
          @updateSelect="(val) => updateSelect(val, 'date')"
          :disabled="disableCondition"
        />
        <span>日</span>
        <SelectCommon
          :selections="noon"
          v-model:select="state.noon"
          @updateSelect="(val) => updateSelect(val, 'noon')"
          :disabled="disableCondition"
        />
      </div>
      <div v-if="state.formData.periodType == 4" class="time-row">
        <SelectCommon
          :selections="months"
          v-model:select="state.month"
          @updateSelect="(val) => updateSelect(val, 'month')"
          :disabled="disableCondition"
        />
        <span>月</span>
        <SelectCommon
          :selections="dates"
          v-model:select="state.date"
          @updateSelect="(val) => updateSelect(val, 'date')"
          :disabled="disableCondition"
        />
        <span>日</span>
        <SelectCommon
          :selections="noon"
          v-model:select="state.noon"
          @updateSelect="(val) => updateSelect(val, 'noon')"
          :disabled="disableCondition"
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
        :disabled="disableCondition"
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
        :disabled="disableCondition"
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
        :disabled="disableCondition"
      >
      </SelectCommon>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth" label="数据库账号" prop="dataBase">
      <SelectCommon
        :selections="accounts"
        v-model:select="state.formData.dataBase"
        @updateSelect="(val) => (state.formData.dataBase = val)"
        :disabled="disableCondition"
      >
      </SelectCommon>
    </el-form-item>
    <UploadBtn
      v-showByAuth="{ role: userInfo.role, showCondition: ['section'] }"
      @update-file="modifyTaskFile"
    />
    <el-button
      type="primary"
      @click="commit"
      v-if="!state.taskId && userInfo.role === 'developer'"
      >{{ props.detail?.reportId ? '修改任务' : '创建任务' }}</el-button
    >
  </el-form>
  <WhiteSpace />
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import dayjs from 'dayjs'
import {
  periodType,
  priority,
  periodTypeMap,
  week,
  taskStatusList,
  accounts
} from '../constant/index'
import { getOrgTreeByRegion } from '../util/orgnization'
import { createTaskReq, createTaskTypeReq, updateTaskReq, updateTaskTypeReq } from '../api/report'
import SelectCommon from './SelectCommon.vue'
import WhiteSpace from './WhiteSpace.vue'
import UploadBtn from './UploadBtn.vue'
import { toast } from '../util/toast'
import { getLocalStore } from '../util/localStorage'
import emitter from '../util/eventbus'

const formRef = ref()

const userInfo = getLocalStore('userInfo')
const dates = ref(new Array(31).fill(0))
const months = ref(new Array(12).fill(0))
const periodTypes = ref(periodType)
const props = defineProps({
  detail: {
    type: Object
  },
  typeDetail: {
    type: Object
  }
})

const state = reactive({
  modeName: '',
  day: '',
  date: '',
  noon: '',
  month: '',
  periodType: 1,
  priority: 99,
  dataBase: '',
  formData: {
    reportName: '',
    timeRange: [],
    periodType: 1,
    priority: 99,
    reportState: '',
    taskAssignOrg: ''
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

const disableCondition = computed(() => ['section'].includes(userInfo.role))
const modifyTaskFile = async (SourceExcelLink) => {
  await updateTaskReq({
    reportId: props.detail.reportId,
    SourceExcelLink,
    reportState: 1,
    lastTime: '2020-01-01 00:00:00'
  })
  toast('收到该需求了，正在努力执行')
}
const initVal = () => {
  if (props.detail?.reportId) {
    const { reportName, reportPriority, TimeOn, endTime, reportState, taskAssignOrg, dataBase } =
      props.detail
    const { reportTypeName, modeName } = props.typeDetail
    state.formData = {
      reportName,
      priority: reportPriority,
      timeRange: [TimeOn, endTime],
      periodType: periodType.filter((i) => i.label === reportTypeName)[0].value,
      reportState,
      taskAssignOrg,
      dataBase
    }
    state.day = modeName.split(',')[0]
    state.noon = getNoon(modeName)
    state.date =
      reportTypeName === '年报' // 年报是mmdd格式
        ? modeName.split(',')[0].substr(2, 4)
        : modeName.split(',')[0]
    state.month = reportTypeName === '年报' && modeName.split(',')[0].substr(0, 2)
  }
}

const emits = defineEmits(['updateTaskId'])

const updateSelect = (data, type) => {
  state[type] = data
}
const getNoon = (modeName) => {
  const formatModeName = (val) => (val === '0900' ? '0900' : '1200')
  return modeName.indexOf(',') > -1 ? formatModeName(modeName.split(',')[1]) : modeName
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
  dates.value = formatArr(dates)
  months.value = formatArr(months)
  // periodTypes.value = periodTypes.value.filter((i) => i.label !== '年报')
}

const formatDate = (date) => dayjs(date).format()

const getModeName = () => {
  const {
    formData: { periodType },
    day,
    date,
    noon,
    month
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
    case 4:
      modeName = `${month}${date}, ${noon}`
      break
  }
  return modeName
}

const validateData = () => {
  const {
    formData: { periodType },
    date,
    day,
    noon,
    month
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
  if (periodType === 4) {
    if (!month || !date || !noon) {
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
          formData: {
            timeRange,
            reportName,
            periodType,
            priority,
            reportState,
            taskAssignOrg,
            dataBase
          }
        } = state
        try {
          const params = {
            reportTypeName: periodTypeMap[periodType],
            modeName: getModeName()
          }
          const typeRes = isUpdate
            ? await updateTaskTypeReq({
                ...params,
                reportTypeId: props.typeDetail.reportTypeId
              })
            : await createTaskTypeReq({ ...params })
          if (typeRes.code == 200) {
            const params = {
              reportName,
              LargeCategory: '周期性',
              TimeOn: formatDate(timeRange[0]),
              endTime: formatDate(timeRange[1]),
              reportTypeId: isUpdate ? props.typeDetail.reportTypeId : typeRes.data.reportTypeId,
              reportPriority: priority,
              taskAssignOrg,
              dataBase
            }
            const result = !isUpdate
              ? await createTaskReq({ ...params, custID: userInfo.userId, region: userInfo.region })
              : await updateTaskReq({
                  ...params,
                  reportId: isUpdate,
                  reportState,
                  lastTime: reportState === 1 && '2020-01-01 00:00:00'
                })
            if (!isUpdate) {
              state.taskId = result.data.reportId
              toast('创建任务成功！')
              emits('updateTaskId', result.data.reportId)
            }
            if (isUpdate) {
              toast('修改任务成功！')
            }
            emitter.emit('refreshList')
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
