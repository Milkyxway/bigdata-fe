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
    <el-form-item :label-width="formLabelWidth" label="任务周期类型">
      <SelectCommon
        :selections="periodTypes"
        v-model:select="state.periodType"
        @updateSelect="(val) => updateSelect(val, 'periodType')"
      />
    </el-form-item>
    <el-form-item :label-width="formLabelWidth" label="周期任务执行时间">
      <div v-if="state.periodType == 1">
        <SelectCommon
          :selections="hour"
          v-model:select="state.hour"
          @updateSelect="(val) => updateSelect(val, 'hour')"
        />
        <span>时</span>
        <SelectCommon
          :selections="minutes"
          v-model:select="state.min"
          @updateSelect="(val) => updateSelect(val, 'min')"
        />
        <span>分</span>
      </div>
      <div v-if="state.periodType == 2">
        <SelectCommon
          :selections="week"
          v-model:select="state.day"
          @updateSelect="(val) => updateSelect(val, 'day')"
        />
        <SelectCommon
          :selections="hour"
          v-model:select="state.hour"
          @updateSelect="(val) => updateSelect(val, 'hour')"
        />
        <span>时</span>
        <SelectCommon
          :selections="minutes"
          v-model:select="state.min"
          @updateSelect="(val) => updateSelect(val, 'min')"
        />
        <span>分</span>
      </div>
      <div v-if="state.periodType == 3">
        <SelectCommon
          :selections="month"
          v-model:select="state.date"
          @updateSelect="(val) => updateSelect(val, 'date')"
        />
        <span>日</span>
        <SelectCommon
          :selections="hour"
          v-model:select="state.hour"
          @updateSelect="(val) => updateSelect(val, 'hour')"
        />
        <span>时</span>
        <SelectCommon
          :selections="minutes"
          v-model:select="state.min"
          @updateSelect="(val) => updateSelect(val, 'min')"
        />
        <span>分</span>
      </div>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth" label="任务优先级">
      <SelectCommon
        :selections="priority"
        v-model:select="state.priority"
        @updateSelect="(val) => updateSelect(val, 'priority')"
      />
    </el-form-item>
    <el-form-item> </el-form-item>
    <el-button type="primary" @click="commit" v-if="!state.taskId">提交</el-button>
  </el-form>
  <div v-if="state.taskId">
    <div>
      <span>按需求分步输入sql语句</span>
      <el-icon @click="addSqlStrs"><CirclePlus /></el-icon>
    </div>
    <div v-for="(item, index) in state.sqlStrs" v-bind:key="index">
      <span>{{ index + 1 }}</span>
      <FillSql :taskId="state.taskId" />
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import { periodType, priority, periodTypeMap } from '../constant/index'
import { createTaskReq, createTaskTypeReq } from '../api/report'
import SelectCommon from './SelectCommon.vue'
import FillSql from './FillSql.vue'
import WhiteSpace from './WhiteSpace.vue'
import { toast } from '../util/toast'
const formRef = ref()
const month = ref(new Array(31).fill(0))
const hour = ref(new Array(24).fill(0))
const minutes = ref(new Array(60).fill(0))
const periodTypes = ref(periodType)
const week = ref([
  {
    label: '周一',
    value: 'Monday'
  },
  {
    label: '周二',
    value: 'Tuesday'
  },
  {
    label: '周三',
    value: 'Wednesday'
  },
  {
    label: '周四',
    value: 'Thursday'
  },
  {
    label: '周五',
    value: 'Friday'
  },
  {
    label: '周六',
    value: 'Saturday'
  },
  {
    label: '周日',
    value: 'Sunday'
  }
])
const formLabelWidth = '200px'
const state = reactive({
  modeName: '',
  day: '',
  date: '',
  hour: '',
  min: '',
  periodType: 1,
  priority: 99,
  formData: {
    reportName: '',
    timeRange: []
  },
  taskId: '',
  sqlStrs: [0]
})

const addSqlStrs = () => {
  state.sqlStrs.push(0)
}

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
  hour.value = formatArr(hour, false)
  minutes.value = formatArr(minutes, false)
  periodTypes.value = periodTypes.value.filter((i) => i.label !== '年报')
}

const formatDate = (date) => dayjs(date).format()

const getModeName = () => {
  const { periodType, day, hour, min, date } = state
  let modeName = ''
  switch (periodType) {
    //   1: '日报',
    // 2: '周报',
    // 3: '月报',
    // 4: '年报'
    case 1:
      modeName = `(${hour}${min})`
      break
    case 2:
      modeName = `(${day},${hour}${min})`
      break
    case 3:
      modeName = `(${date},${hour}${min})`
      break
  }
  return modeName
}

const commit = () => {
  formRef.value.validate(async (res) => {
    if (res) {
      const {
        periodType,
        formData: { timeRange, reportName },
        priority
      } = state
      try {
        const typeRes = await createTaskTypeReq({
          reportTypeName: periodTypeMap[periodType],
          modeName: getModeName()
        })
        if (typeRes.code == 200) {
          const result = await createTaskReq({
            reportName,
            LargeCategory: '周期性',
            TimeOn: formatDate(timeRange[0]),
            endTime: formatDate(timeRange[1]),
            reportTypeId: typeRes.data.reportTypeId,
            reportPriority: priority
          })
          if (result.data.reportId) {
            state.taskId = result.data.reportId
            toast('创建任务成功！')
          }
        }
      } catch (e) {}
    }
  })
}
initArrs()
</script>
