<template>
  <el-card>
    <el-form ref="formRef">
      <el-row>
        <el-col :span="8">
          <el-form-item label="任务名称">
            <el-input
              placeholder="请输入任务名称"
              v-model="state.formData.reportName"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务创建人">
            <el-input
              placeholder="请输入任务创建人"
              v-model="state.formData.username"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务类型">
            <SelectCommon
              :selections="typeArr"
              v-model:select="state.formData.LargeCategory"
              @updateSelect="(val) => (state.formData.LargeCategory = val)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="任务状态">
            <SelectCommon
              :selections="taskStatusList"
              v-model:select="state.formData.reportState"
              @updateSelect="(val) => (state.formData.reportState = val)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务所属部门">
            <SelectCommon
              :selections="orgnizationTree"
              v-model:select="state.formData.taskAssignOrg"
              @updateSelect="
                (val) => {
                  state.formData.taskAssignOrg = val
                }
              "
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务执行周期">
            <SelectCommon
              :selections="exePeriod"
              v-model:select="state.formData.reportTypeName"
              @updateSelect="
                (val) => {
                  state.formData.reportTypeName = val
                }
              "
            />
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
import { taskStatusList, priority, orgnizationTree } from '../constant'

import router from '../router/index'
const state = reactive({
  formData: {
    reportName: '',
    username: '',
    LargeCategory: '',
    reportState: '',
    taskAssignOrg: '',
    reportTypeName: ''
  },
  taskStatusList,
  priority
})
const formRef = ref(null)
const typeArr = ref([
  {
    label: '一次性',
    value: '一次性'
  },
  {
    label: '周期性',
    value: '周期性'
  }
])
const exePeriod = ref([
  {
    label: '日报',
    value: '日报'
  },
  {
    label: '周报',
    value: '周报'
  },
  {
    label: '月报',
    value: '月报'
  },
  {
    label: '年报',
    value: '年报'
  }
])
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
:deep(.el-select) {
  flex: 1;
}
</style>
