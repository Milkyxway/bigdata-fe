<template>
  <Table
    :tableData="state.paramsList"
    :tableColumns="tableColumns"
    :tableTotal="state.tableTotal"
    :tableOperations="tableOperations"
    noPagination
  />
  <div v-for="(item, index) in props.sqlArr" v-bind:key="index" class="sql-box">
    <WhiteSpace />
    <div class="input-row">
      <el-radio-group v-model="item.chooseSqlType">
        <el-radio
          v-for="(item, index) in sqlTypes"
          v-bind:key="index"
          :label="item.label"
          :name="item.value"
        ></el-radio>
      </el-radio-group>
    </div>
    <div class="input-row font-grey" v-if="item.chooseSqlType === '执行类无输出'">
      <el-icon><Warning /></el-icon>
      <span class="margin-right">用作创建表、删除表等</span>
      <span class="font-ble margin-right">{{ getExample }}</span>
      <span @click="copyContent(getExample)" class="font-ble">复制</span>
    </div>
    <div class="input-row font-grey" v-if="item.chooseSqlType === '上传'">
      <el-icon><Warning /></el-icon>
      <span class="margin-right">用作临时表插值等</span>
      <span class="font-ble margin-right">{{ getExample2 }}</span>
      <span @click="copyContent(getExample2)" class="font-ble">复制</span>
    </div>
    <WhiteSpace v-if="item.chooseSqlType === '查询类有输出'" />
    <div class="input-row">
      <div v-if="state.commonSqls && item.chooseSqlType === '查询类有输出'">
        <span>常用sql语句 </span>
        <SelectCommon
          :selections="state.commonSqls"
          v-model:select="state.selectSql"
          @updateSelect="
            (val) => {
              if (val !== '') {
                item.reportSqlData = val
              }
            }
          "
        />
      </div>
    </div>
    <WhiteSpace />
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
        :rows="item.chooseSqlType === '查询类有输出' ? 20 : 1"
        v-model="item.reportSqlData"
        clearable
      />
    </div>
    <WhiteSpace />
    <div v-if="item.chooseSqlType === '上传'">
      <div class="input-row">
        <span class="sub-title">源sheet名</span>
        <el-input placeholder="请输入源sheet名" v-model="item.SourceSheet"></el-input>
        <span class="sub-title">匹配列名</span>
        <el-input placeholder="请输入匹配列名" v-model="item.ExcelTable"></el-input>
      </div>
      <WhiteSpace />
      <div v-if="props.excelLink" class="input-row" @click="downloadUrl(props.excelLink)">
        <span>上传文件：</span><span class="font-ble">{{ props.excelLink }}</span>
      </div>
      <Upload
        :btn-txt="props.excelLink ? '修改匹配文件' : '上传匹配文件'"
        btn-type="danger"
        @handleFileChange="(file) => handleFileChange(file, index)"
      />
      <WhiteSpace />
    </div>
    <div class="input-row" v-if="item.chooseSqlType === '查询类有输出'">
      <span class="sub-title">目标sheet名</span>
      <el-input placeholder="请输入目标sheet名" v-model="item.TargetSheet"></el-input>
    </div>
    <WhiteSpace v-if="item.chooseSqlType === '查询类有输出'" />
    <el-button type="plain" @click="commitSql(index)">{{
      props.sqlArr[index].reportSqlId ? '修改语句' : '提交语句'
    }}</el-button>
    <el-button type="plain" @click="item.reportSqlData = ''">清空输入框</el-button>
    <el-button type="plain" @click="deleteTaskSql(item.reportSqlId)" v-if="item.reportSqlId"
      >删除sql语句</el-button
    >
    <WhiteSpace />
  </div>
  <WhiteSpace />
  <el-button type="primary" @click="startExe" :loading="state.loading">完成，开始执行</el-button>
</template>
<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { copyText } from 'vue3-clipboard'
import dayjs from 'dayjs'
import Upload from './Upload.vue'
import WhiteSpace from './WhiteSpace.vue'
import SelectCommon from './SelectCommon.vue'
import Table from './Table.vue'

import {
  addSqlReq,
  updateTaskReq,
  getTaskSqlsReq,
  getSQLListReq,
  getParamsListReq,
  uploadReq,
  updateSqlReq,
  deleteTaskSqlReq,
  deleteFileReq
} from '../api/report'
import { toast } from '../util/toast'
import { downloadUrl } from '../util/formatLink'

const state = reactive({
  chooseSqlType: '执行类无输出',
  sqlContent: '',
  commitSuccess: '',
  commonSqls: [],
  selectSql: '',
  paramsList: [],
  selectParamType: '',
  loading: false
})
const router = useRouter()
const props = defineProps({
  taskId: {
    type: Number
  },
  sqlArr: {
    type: Array
  },
  excelLink: {
    type: String
  }
})
const emits = defineEmits(['addSqlInput', 'deleteSqlInput', 'refreshPage'])
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
const tableColumns = ref([
  {
    label: '参数名称',
    prop: 'parameterName'
  },
  {
    label: '参数通配符',
    prop: 'parameterKey'
  }
])
const tableOperations = ref([
  {
    label: '复制',
    fn: (row) => {
      copyContent(row.parameterKey)
    }
  }
])
watch(
  () => state.chooseSqlType,
  (val) => {
    state.sqlContent = ''
  }
)

const getExample = computed(
  () =>
    `drop table tmp_${dayjs().format('MMDD')};create table tmp_${dayjs().format(
      'MMDD'
    )} (rownumb number, cust_code varchar(255))`
)
const getExample2 = computed(
  () => `insert into tmp_${dayjs().format('MMDD')} (rownumb, cust_code) values (:val1,:val2)`
)
const copyContent = (content) => {
  copyText(content, undefined, (error, event) => {
    if (error) {
      toast('复制失败！', 'error')
      console.log(error)
    } else {
      toast('复制成功！')
      console.log(event)
    }
  })
}
const addSqlStrs = () => {
  emits('addSqlInput')
}
const deleteSqlInput = (index) => {
  emits('deleteSqlInput', index)
}

const deleteTaskSql = async (reportSqlId) => {
  await deleteTaskSqlReq({ reportSqlId })
  toast('删除成功！')
  emits('refreshPage')
}

const handleFileChange = async (file, index) => {
  const now = dayjs().format('YYYYMMDDHHmmss')
  const fileSuffix = file.name.split('.')[1]
  const fileName = `${now}.${fileSuffix}`
  const copyFile = new File([file], `${fileName}`)
  const formData = new FormData()
  formData.append('file', copyFile)
  await uploadReq(formData)
  toast('上传成功')
  await updateTaskReq({
    reportId: props.taskId,
    SourceExcelLink: copyFile.name
  })
}

const sqlTypeMap = (type) => {
  const map = {
    执行类无输出: 1,
    上传: 2,
    查询类有输出: 3
  }
  return map[type]
}

const addSqlForTask = async (index) => {
  if (!props.sqlArr[index].reportSqlData) {
    return toast('请填写sql语句', 'warning')
  }
  const params = {
    reportId: props.taskId,
    sqlType: sqlTypeMap(props.sqlArr[index].chooseSqlType),
    SourceSheet: props.sqlArr[index].SourceSheet,
    TargetSheet: props.sqlArr[index].TargetSheet,
    ExcelTable: props.sqlArr[index].ExcelTable
  }
  await addSqlReq({
    ...params,
    reportSqlData: props.sqlArr[index].reportSqlData
  })
  toast('提交成功！')
  emits('refreshPage')
}

const updateSqlForTask = async (index) => {
  const item = props.sqlArr[index]
  const { chooseSqlType, ...rest } = item
  const params = {
    ...rest,
    sqlType: sqlTypeMap(item.chooseSqlType)
  }
  await updateSqlReq(params)
  toast('修改成功！')
}

const commitSql = async (index) => {
  if (!props.sqlArr[index].reportSqlId) {
    // 新增
    addSqlForTask(index)
  } else {
    updateSqlForTask(index)
  }
}

const startExe = async () => {
  const result = await getTaskSqlsReq({
    taskId: props.taskId
  })
  if (result.data.taskSqls) {
    state.loading = true
    await updateTaskReq({
      reportId: props.taskId,
      reportState: 1,
      lastTime: '2020-01-01 00:00:00'
    })
    state.loading = false
    toast('提交成功！')
    router.back()
  } else {
    toast('该任务没有填写sql脚本无法执行', 'warning')
  }
}
const getCommonSqlList = async () => {
  const result = await getSQLListReq()
  state.commonSqls = result.data.list.map((i) => {
    return {
      label: i.sqlName,
      value: i.sqlContent
    }
  })
}
const getParamsList = async () => {
  const result = await getParamsListReq()
  state.paramsList = result.data.list
}
getCommonSqlList()
getParamsList()
</script>
<style scoped>
.sql-box {
  border-bottom: 1px dashed #ededed;
}
.input-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.sub-title {
  white-space: nowrap;
}
.font-ble {
  color: #0076fe;
  cursor: pointer;
}
.margin-right {
  display: inline-block;
  margin-right: 8px;
}

.font-grey {
  color: #aaa;
}
</style>
