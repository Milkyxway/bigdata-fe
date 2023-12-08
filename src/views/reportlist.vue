<template>
  <QueryReport @handleQuery="handleQuery" />
  <WhiteSpace />
  <el-tabs v-model="state.chooseTab">
    <el-tab-pane
      v-for="(item, index) in tabs"
      v-bind:key="index"
      :label="item.label"
      :name="item.value"
    >
    </el-tab-pane>
  </el-tabs>

  <el-table :data="state.tableData" row-key="id" :default-expand-all="false">
    <el-table-column
      v-for="item in state.tableColumns"
      :label="item.label"
      :prop="item.prop"
      :key="item.key"
      :width="['reportLink'].includes(item.prop) && 200"
    >
      <template #default="{ row }">
        <span :class="getColorByState(row.reportState)" v-if="item.prop === 'reportState'">{{
          row.reportState
        }}</span>
        <span
          v-if="item.prop === 'SourceExcelLink'"
          @click="row.SourceExcelLink && downloadUrl(row.SourceExcelLink)"
          class="font-ble"
          >{{ row.SourceExcelLink ? '上传文件' : '' }}</span
        >

        <span
          @click="downloadUrl(row.reportLink)"
          v-if="item.prop === 'reportLink'"
          class="font-ble"
          >{{ getReportLinkTxt(row) }}</span
        >
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    class="pagination"
    v-model:current-page="state.pageNum"
    v-model:page-size="state.pageSize"
    :page-sizes="[10, 20, 30, 40]"
    layout="total,sizes, prev, pager, next, jumper"
    :total="state.tableTotal"
  />
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import QueryReport from '../components/QueryReport.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import { getTaskListReq } from '../api/report'
import { getLocalStore } from '../util/localStorage'
import { formatLink, downloadUrl } from '../util/formatLink'
import { orgMap, periodType, periodTypeMap, taskStatusMap } from '../constant/index'
import { getColorByState } from '../util/statefont'

const userId = getLocalStore('userInfo').userId
const orgId = getLocalStore('userInfo').orgnization
const tabs = ref([{ label: '一次性任务', value: 0 }, ...periodType])
const state = reactive({
  chooseTab: 0,
  page: {
    pageSize: 10,
    pageNum: 0
  },
  pageNum: 1,
  pageSize: 10,
  querys: {
    reportTypeName: ''
  },
  tableTotal: 0,
  tableColumns: [
    {
      label: '任务名称',
      prop: 'reportName'
    },
    {
      label: '状态',
      prop: 'reportState'
    },
    {
      label: '结果Excel',
      prop: 'reportLink'
    },
    {
      label: '上传匹配文件',
      prop: 'SourceExcelLink'
    },
    {
      label: '任务所属部门',
      prop: 'taskAssignOrg'
    },
    {
      label: '创建人',
      prop: 'username'
    },
    {
      label: '创建时间',
      prop: 'createTime'
    }
  ],
  tableData: [],
  total: 0,
  tableOperations: []
})
watch(
  () => state.chooseTab,
  (val) => {
    let reportTypeName
    switch (val) {
      case 0:
        reportTypeName = ''
        break
      case 1:
        reportTypeName = '日报'
        break
      case 2:
        reportTypeName = '周报'
        break
      case 3:
        reportTypeName = '月报'
        break
      case 4:
        reportTypeName = '年报'
        break
      default:
        break
    }
    state.querys.reportTypeName = reportTypeName
    getReportList()
  }
)

watch(
  () => [state.pageNum, state.pageSize],
  (val) => {
    state.page.pageNum = val[0] - 1
    state.page.pageSize = val[1]
    getReportList()
  }
)

const getReportLinkTxt = computed(() => {
  return function (row) {
    if (row.isChild && row.LargeCategory === '周期性' && row.reportLink) {
      return `结果excel(生成日期${row.reportLink.substr(36, 8)})`
    }
    if (row.LargeCategory === '一次性' && row.reportLink) {
      return '结果excel'
    }
  }
})

const insertIdIntoArr = (data) => {
  const result = data.map((i) => {
    if (i.LargeCategory === '周期性') {
      return {
        ...i,
        id: i.reportId,
        children: i.reportLink.length
          ? i.reportLink.map((m) => {
              return {
                ...i,
                reportLink: m,
                isChild: true
              }
            })
          : []
      }
    }
    return i
  })
  return result
}
const formatDate = (date, format) => dayjs(date).format(format || 'YYYY-MM-DD')
const getReportList = async () => {
  state.tableData = []
  let params = {
    ...state.querys,
    ...state.page,
    custID: userId,
    orgId,
    LargeCategory: '一次性'
  }
  if (state.chooseTab !== 0) {
    params = {
      ...state.querys,
      ...state.page,
      orgId
    }
  }
  const result = await getTaskListReq(params)
  state.tableData = result.data.list.map((i) => {
    return {
      ...i,
      reportState: taskStatusMap[i.reportState],
      reportLink: i.reportLink
        ? i.reportLink.split(',').map((i) => {
            return formatLink(i, 'out')
          })
        : '',
      SourceExcelLink: formatLink(i.SourceExcelLink, 'upload'),
      createTime: formatDate(i.createTime, 'YYYY-MM-DD HH:mm:ss'),
      taskAssignOrg: orgMap[i.taskAssignOrg]
    }
  })
  state.tableData = insertIdIntoArr(state.tableData)
  state.tableTotal = result.data.total
}

getReportList()
</script>
<style scoped>
.font-ble {
  color: #0076fe;
  cursor: pointer;
}
.pagination {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
}
.font-grey {
  color: #b1b3b8;
}
.font-yellow {
  color: #e6a23c;
}
.font-red {
  color: #f56c6c;
}

.font-green {
  color: #67c23a;
}
</style>
