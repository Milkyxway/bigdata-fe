<template>
  <Table
    :tableData="state.paramsList"
    :tableColumns="tableColumns"
    :tableTotal="state.tableTotal"
    :tableOperations="tableOperations"
    noPagination
  />
</template>
<script setup>
import { reactive, ref } from 'vue'
import { getParamsListReq } from '../api/report'
import { copyContent } from '../util/common'
const state = reactive({
  paramsList: [],
  tableTotal: 0
})
const tableColumns = ref([
  {
    label: '参数名称',
    prop: 'parameterName'
  },
  {
    label: '参数通配符',
    prop: 'parameterKey'
  },
  {
    label: '参数内容',
    prop: 'parameterData'
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

const getParamsList = async () => {
  const result = await getParamsListReq()
  state.paramsList = result.data.list
}
getParamsList()
</script>
