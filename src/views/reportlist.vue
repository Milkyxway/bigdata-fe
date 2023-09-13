<template>
  <QueryReport @handleQuery="handleQuery" />
  <div>
    <el-tabs v-model="state.chooseTab">
      <el-tab-pane
        v-for="(item, index) in periodType"
        v-bind:key="index"
        :label="item.label"
        :name="item.value"
      >
        <!-- <el-table :data="state.tableData">
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
        </el-table> -->
        <Table />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
// import QueryHeader from '../components/QueryHeader.vue'
import QueryReport from '../components/QueryReport.vue'
import Table from '../components/Table.vue'
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
      columnName: '文件名称',
      prop: 'reportName'
    },
    {
      columnName: '文件地址',
      prop: 'reportLink'
    },
    {
      columnName: '所属部门',
      prop: 'section'
    },
    {
      columnName: '报表周期类型',
      prop: 'reportType'
    }
  ],
  tableData: [],
  total: 0
})

watch(
  () => state.chooseTab,
  (val) => {
    state.querys.reportType = val
    state.tableData = []
    state.total = 0
    getReportList()
  }
)

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

const handleQuery = (query) => {
  Object.keys(query).map((i) => {
    if (query[i] === '') {
      query[i] = null
    }
  })
  state.querys = {
    ...query,
    taskSource: handleQueryAll(query.taskSource),
    status: handleQueryAll(query.status), // 全部 给后端传null
    category: handleQueryAll(query.category),
    createTime: getRangeDateParam(query.createTime)
  }
  state.page.pageNum = 0
  state.page.pageSize = 10
  state.chooseTab === 'mine' ? getRelatedMeTask() : getSuperviseList()
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
</script>
