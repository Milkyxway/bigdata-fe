<template>
  <el-card :class="['admin', 'leader'].includes(role) ? 'card-admin' : 'card-section'">
    <form :v-model="queryForm">
      <div class="row-item">
        <div class="query-select">
          <span class="query-title">任务类别</span>
          <el-select v-model="queryForm.category" placeholder="请选择任务类别" clearable>
            <el-option
              v-for="item in taskCategoryList"
              v-bind:key="item.key"
              :value="item.value"
              :label="item.label"
              >{{ item.label }}</el-option
            >
          </el-select>
        </div>
        <div v-if="['admin', 'leader'].includes(role)" class="query-select">
          <span class="query-title">任务来源</span>
          <el-select v-model="queryForm.taskSource" placeholder="请选择任务来源" clearable>
            <el-option
              v-for="item in taskOriginRef"
              v-bind:key="item.key"
              :value="item.value"
              :label="item.label"
              >{{ item.label }}</el-option
            >
          </el-select>
        </div>
        <div v-if="['admin', 'leader'].includes(role)" class="query-select">
          <span class="query-title">来源描述</span>
          <el-input v-model="queryForm.sourceDesc" placeholder="请填写来源描述" clearable>
          </el-input>
        </div>
        <div class="query-select">
          <span class="query-title">牵头部门</span>
          <el-select placeholder="请选择牵头部门" v-model="queryForm.leadOrg" clearable>
            <el-option
              v-for="org in orgnizationList"
              v-bind:key="org.key"
              :label="org.label"
              :value="org.value"
              >{{ org.label }}</el-option
            >
          </el-select>
        </div>
        <div class="query-select">
          <span class="query-title">协办部门</span>
          <el-select placeholder="请选择协办部门" v-model="queryForm.assistOrg" clearable>
            <el-option
              v-for="org in orgnizationList"
              v-bind:key="org.key"
              :label="org.label"
              :value="org.value"
              >{{ org.label }}</el-option
            >
          </el-select>
        </div>
        <div v-if="['admin', 'leader'].includes(role)" class="query-select">
          <span class="query-title">提出部门</span>
          <el-select v-model="queryForm.ariseOrg" placeholder="请选择提出部门" clearable>
            <el-option
              v-for="item in orgnizationList"
              v-bind:key="item.key"
              :value="item.value"
              :label="item.label"
              >{{ item.label }}</el-option
            >
          </el-select>
        </div>
        <div class="query-select">
          <span class="query-title">任务状态</span>
          <el-select v-model="queryForm.status" placeholder="请选择任务状态" clearable>
            <el-option
              v-for="item in statusList"
              v-bind:key="item.key"
              :value="item.value"
              :label="item.label"
              >{{ item.label }}</el-option
            >
          </el-select>
        </div>
        <div class="query-select">
          <span class="query-title">任务年度</span>
          <el-date-picker
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model="queryForm.createTime"
            clearable
          ></el-date-picker>
        </div>
        <div :class="['admin', 'leader'].includes(role) ? 'query-select-keyword' : 'query-select'">
          <span class="query-title">关键字</span>
          <el-input placeholder="请输入关键字" v-model="queryForm.keyword" clearable></el-input>
        </div>
      </div>
    </form>
    <div class="btn-wrap">
      <el-button @click="reset" plain>重置查询</el-button>
      <el-button @click="handleQuery" type="primary">查询</el-button>
      <el-button @click="createTask" type="danger" v-showByAuth="{ role, showCondition: ['admin'] }"
        >新建任务</el-button
      >
    </div>
  </el-card>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { taskStatusList, taskCategory, orgnizationTree, taskOrigin } from '../constant'
import { getLocalStore } from '../util/localStorage'
const emit = defineEmits(['handleQuery', 'createTask'])
const role = getLocalStore('userInfo').role
let queryForm = reactive({
  category: null,
  status: null,
  keyword: '',
  createTime: null,
  leadOrg: null,
  assistOrg: null,
  taskSource: null,
  ariseOrg: null
})
const statusList = ref(taskStatusList)
const taskCategoryList = ref(taskCategory)
const orgnizationList = ref(orgnizationTree)
const taskOriginRef = ref(taskOrigin)
const styleByRole = computed(() => {
  return ['admin', 'leader'].includes(role)
    ? {
        spanSpace: 2,
        elSpace: 4
      }
    : {
        spanSpace: 2,
        elSpace: 6
      }
})
const handleQuery = () => {
  emit('handleQuery', queryForm)
}
const createTask = () => {
  emit('createTask')
}
const reset = () => {
  Object.keys(queryForm).map((i) => {
    queryForm[i] = null
  })
  handleQuery()
}
</script>
<style scoped>
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.query-select {
  margin: 0 20px 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  /* align-items: center; */
  /* flex: auto; */
}
.query-select-keyword {
  margin: 0 20px 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.query-title {
  display: inline-block;
  width: 60px;
  margin-right: 10px;
  white-space: nowrap;
}
.white-space {
  height: 10px;
}
.btn-wrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 0 0 0;
}
.card-admin {
  border: none;
  :deep(.el-input) {
    width: 195px !important;
  }
  :deep(.el-input__wrapper) {
    width: 195px !important;
    /* border: 1px solid #7f7fd5; */
    /* border-radius: 4px; */
  }
}
.card-section {
  border: none;
  :deep(.el-input) {
    width: 280px !important;
  }
  :deep(.el-input__wrapper) {
    width: 280px !important;
    /* border: 1px solid #7f7fd5; */
    /* border-radius: 4px; */
  }
}
</style>
