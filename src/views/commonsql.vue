<template>
  <QuerySql @handleQuery="handleQuery" @refreshList="getSqlList" />
  <WhiteSpace />
  <el-table :data="state.tableData">
    <el-table-column
      v-for="item in state.tableColumns"
      :label="item.columnName"
      :prop="item.prop"
      :key="item.key"
    ></el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="{ row }">
        <!-- <el-button link type="primary" size="small" @click="download(row.sqlLink)">下载</el-button> -->
        <el-button link type="danger" size="small" @click="deleteSQL(row.sqlId, row.sqlName)"
          >删除</el-button
        >
        <el-button
          link
          type="primary"
          size="small"
          @click="
            () => {
              state.showEdit = true
              state.editContent = row.sqlContent
              state.sqlName = row.sqlName
              state.selectSqlId = row.sqlId
            }
          "
          >查看</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <EditorInDialog
    v-model:content="state.editContent"
    v-model:sqlName="state.sqlName"
    v-model:sqlId="state.selectSqlId"
    v-model:showUploadDialog="state.showEdit"
    @updateContent="(val, type) => (state[type] = val)"
    @closeModal="state.showEdit = false"
    @refreshList="getSqlList"
    type="update"
  />
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import EditorInDialog from '../components/EditorInDialog.vue'
import QuerySql from '../components/QuerySql.vue'
import { getSQLListReq, deleteSqlReq } from '../api/report'
import { toast } from '../util/toast'
import { getLocalStore } from '../util/localStorage'
import { ElMessageBox } from 'element-plus'
import WhiteSpace from '../components/WhiteSpace.vue'
const state = reactive({
  showEdit: false,
  chooseTab: 3,
  page: {
    pageSize: 10,
    pageNum: 0
  },
  querys: {},

  tableColumns: [
    {
      columnName: '脚本名称',
      prop: 'sqlName'
    }
  ],
  tableData: [],
  total: 0,
  editContent: '',
  sqlName: '',
  selectSqlId: ''
})

const getSqlList = async () => {
  state.tableData = []
  const result = await getSQLListReq({
    ...state.page,
    ...state.querys
  })
  state.tableData = result.data.list
  state.total = result.data.total
}

getSqlList()

const handleQuery = (query) => {
  state.querys = {
    ...query
  }
  getSqlList()
}

const deleteSQL = async (sqlId, sqlName) => {
  ElMessageBox.confirm(`确定要删除${sqlName}?`, '警告', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    callback: async (action) => {
      if (action === 'confirm') {
        try {
          await deleteSqlReq({ sqlId })
          toast()
          getSqlList()
        } catch (e) {}
      }
    }
  })
}
</script>
