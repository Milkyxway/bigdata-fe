<template>
  <QuerySql @handleQuery="handleQuery" />
  <el-table :data="state.tableData">
    <el-table-column
      v-for="item in state.tableColumns"
      :label="item.columnName"
      :prop="item.prop"
      :key="item.key"
    ></el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="setFinish(row)">下载</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
// import QueryHeader from '../components/QueryHeader.vue'
// import QueryReport from '../components/QueryReport.vue'
import QuerySql from '../components/QuerySql.vue'
import TableCommon from '../components/TableCommon.vue'
import { getReportListReq } from '../api/report'
import { toast } from '../util/toast'
import { getLocalStore } from '../util/localStorage'
import { dayjs } from 'element-plus'
import { periodType, periodTypeMap } from '../constant/index'

const userInfo = ref(getLocalStore('userInfo'))
const role = ref(getLocalStore('userInfo').role)
const state = reactive({
  chooseTab: 3,
  page: {
    pageSize: 10,
    pageNum: 0
  },
  querys: {
    reportType: 3
  },

  tableColumns: [
    {
      columnName: '脚本名称',
      prop: 'reportName'
    },
    {
      columnName: '文件地址',
      prop: 'reportLink'
    }
  ],
  tableData: [],
  total: 0
})

const getReportList = async () => {
  const params = {
    ...state.querys,
    ...state.page
  }
  const result = await getReportListReq(params)
  state.tableData = result.data.list
  state.total = result.data.total
}

const handleQueryAll = (param) => (param === 0 ? null : param)
const getRangeDateParam = (range) => {
  if (range) {
    return [
      dayjs(range[0]).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(range[1]).format('YYYY-MM-DD HH:mm:ss')
    ]
  }
  return null
}

const changePage = (val) => {
  state.page.pageSize = val.pageSize
  state.page.pageNum = val.pageNum - 1
  if (state.chooseTab === 'all') {
    getSuperviseList()
  } else {
    getRelatedMeTask()
  }
}

getReportList()

const handleQuery = (query) => {
  console.log(query)
}
</script>
