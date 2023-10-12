<template>
  <div v-for="(item, index) in props.sqlArr" v-bind:key="index">
    <el-radio-group v-model="item.chooseSqlType">
      <el-radio
        v-for="(item, index) in sqlTypes"
        v-bind:key="index"
        :label="item.label"
        :name="item.value"
      ></el-radio>
    </el-radio-group>
    <div class="input-row">
      <div>
        <el-icon @click="addSqlStrs" color="#0076fe"><CirclePlus /></el-icon>
        <el-icon @click="deleteSqlInput(index)" color="#f56c6c" v-if="index">
          <SemiSelect
        /></el-icon>
      </div>

      <el-input
        type="textarea"
        placeholder="请输入sql语句，用英文;分隔"
        rows="5"
        v-if="state.chooseSqlType !== '上传'"
        v-model="item.reportSqlData"
      />
      <Upload v-if="state.chooseSqlType === '上传'" btn-txt="上传匹配文件" />
    </div>
    <WhiteSpace />
    <el-button type="plain" @click="commitSql(index)">提交语句</el-button>
  </div>
  <WhiteSpace />
  <el-button type="primary" @click="startExe">完成，开始执行</el-button>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import Upload from './Upload.vue'
import WhiteSpace from './WhiteSpace.vue'
import { addSqlReq, updateTaskReq } from '../api/report'
const state = reactive({
  chooseSqlType: '执行类无输出',
  sqlContent: '',
  commitSuccess: ''
})
const props = defineProps({
  taskId: {
    type: Number
  },
  sqlArr: {
    type: Array
  }
})
const emits = defineEmits(['addSqlInput', 'deleteSqlInput'])
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
const addSqlStrs = () => {
  emits('addSqlInput')
}
const deleteSqlInput = () => {
  emits('deleteSqlInput', props.index)
}
const sqlTypeMap = () => {
  const { chooseSqlType } = state
  const map = {
    执行类无输出: 1,
    上传: 2,
    查询类有输出: 3
  }
  return map[chooseSqlType]
}

const commitSql = async (index) => {
  const params = {
    reportId: props.taskId,
    sqlType: sqlTypeMap()
  }
  props.sqlArr[index].split(';').map(async (i) => {
    if (i.reportSqlData) {
      const result = await addSqlReq({
        ...params,
        reportSqlData: i.reportSqlData
      })
      // state.commitSuccess += i
    }
  })
}

const startExe = async () => {
  await updateTaskReq({
    reportId: props.taskId,
    reportState: 1
  })
}
</script>
<style scoped>
.input-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>
