<template>
  <NavBack />
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="bold">创建任务</span>
      </div>
    </template>
    <el-radio-group v-model="state.chooseTaskType">
      <el-radio-button
        v-for="(item, index) in taskType"
        v-bind:key="index"
        :label="item.label"
        :name="item.value"
      />
    </el-radio-group>
    <WhiteSpace />
    <OneTimeForm v-if="state.chooseTaskType === '一次性任务'" @updateTaskId="updateTaskId" />
    <PeriodForm v-if="state.chooseTaskType === '周期性任务'" @updateTaskId="updateTaskId" />
  </el-card>
  <WhiteSpace />
  <el-card v-if="state.taskId">
    <template #header>
      <div class="card-header">
        <span class="bold">分步填写sql</span>
      </div>
    </template>
    <FillSql
      :sqlArr="state.sqlArr"
      @addSqlInput="state.sqlArr.push(0)"
      @deleteSqlInput="deleteSqlInput"
      :taskId="state.taskId"
    />
  </el-card>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PeriodForm from '../components/PeriodForm.vue'
import OneTimeForm from '../components/OneTimeForm.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import FillSql from '../components/FillSql.vue'
import NavBack from '../components/NavBack.vue'
const route = useRoute()
const typeInUrl = ref(route.params.type)
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
const state = reactive({
  chooseTaskType: '周期性任务',

  taskId: 0,
  sqlArr: [
    {
      reportSqlData: '',
      chooseSqlType: '执行类无输出'
    }
  ]
})
const updateTaskId = (taskId) => {
  state.taskId = taskId
}

const deleteSqlInput = (index) => {
  state.sqlArr.splice(index, 1)
}
const setChooseType = () => {
  state.chooseTaskType = typeInUrl.value === 'onetime' ? '一次性任务' : '周期性任务'
}
setChooseType()
</script>
<style scoped>
.card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bold {
  font-weight: bold;
}
</style>
