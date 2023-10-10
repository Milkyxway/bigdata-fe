<template>
  <el-radio-group v-model="state.chooseSqlType">
    <el-radio
      v-for="(item, index) in sqlTypes"
      v-bind:key="index"
      :label="item.label"
      :name="item.value"
    ></el-radio>
  </el-radio-group>
  <el-input
    type="textarea"
    rows="5"
    v-if="state.chooseSqlType !== '上传'"
    v-model="state.sqlContent"
  />
  <Upload v-if="state.chooseSqlType === '上传'" btn-txt="上传匹配文件" />
  <el-button type="primary" @click="commitSql">提交语句</el-button>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import Upload from './Upload.vue'
import { addSqlReq } from '../api/report'
const state = reactive({
  chooseSqlType: '执行类无输出',
  sqlContent: '',
  commitSuccess: ''
})
const props = defineProps({
  taskId: {
    type: Number
  }
})
const sqlTypes = ref([
  {
    label: '执行类无输出',
    value: '执行类无输出'
  },
  {
    label: '上传',
    value: '上传'
  },
  {
    label: '查询类有输出',
    value: '查询类有输出'
  }
])
watch(
  () => state.chooseSqlType,
  (val) => {
    state.sqlContent = ''
  }
)
const sqlTypeMap = () => {
  const { chooseSqlType } = state
  const map = {
    执行类无输出: 1,
    上传: 2,
    查询类有输出: 3
  }
  return map[chooseSqlType]
}
const commitSql = async () => {
  const params = {
    reportId: props.taskId,
    sqlType: sqlTypeMap()
  }
  state.sqlContent.split(';').map(async (i) => {
    const result = await addSqlReq({
      ...params,
      reportSqlData: i
    })
    state.commitSuccess += i
  })
}
</script>
