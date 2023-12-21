<template>
  <QuerySql
    @handleQuery="handleQuery"
    @refreshList="
      () => {
        selectTabByRegion()
        getSqlList()
      }
    "
  />
  <WhiteSpace />
  <el-tabs v-model="state.chooseTab">
    <el-tab-pane
      v-for="(item, index) in regions"
      v-bind:key="index"
      :label="item.label"
      :name="item.value"
    >
    </el-tab-pane>
  </el-tabs>
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
        <el-button
          link
          type="danger"
          size="small"
          @click="deleteSQL(row.sqlId, row.sqlName)"
          v-if="region === regions.filter((i) => i.name === row.region)[0].value"
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
              state.selectSqlRegion = row.region
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
    v-model:region="state.selectSqlRegion"
    v-model:showUploadDialog="state.showEdit"
    @updateContent="(val, type) => (state[type] = val)"
    @closeModal="state.showEdit = false"
    @refreshList="
      () => {
        selectTabByRegion()
        getSqlList()
      }
    "
    type="update"
  />
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue'
import EditorInDialog from '../components/EditorInDialog.vue'
import QuerySql from '../components/QuerySql.vue'
import { getSQLListReq, deleteSqlReq } from '../api/report'
import { toast } from '../util/toast'
import { getLocalStore } from '../util/localStorage'
import { ElMessageBox } from 'element-plus'
import WhiteSpace from '../components/WhiteSpace.vue'
import { regions } from '../constant/index'
const region = getLocalStore('userInfo').region
const state = reactive({
  showEdit: false,
  chooseTab: '',
  page: {
    pageSize: 10,
    pageNum: 0
  },
  querys: {
    region: ''
  },

  tableColumns: [
    {
      columnName: '脚本名称',
      prop: 'sqlName'
    },
    {
      columnName: '所属分公司',
      prop: 'region'
    }
  ],
  tableData: [],
  total: 0,
  editContent: '',
  sqlName: '',
  selectSqlId: '',
  selectSqlRegion: ''
})
watch(
  () => state.chooseTab,
  (val) => {
    if (val) {
      state.querys.region = val
      getSqlList()
    }
  }
)

const getSqlList = async () => {
  state.tableData = []
  const result = await getSQLListReq({
    ...state.page,
    ...state.querys
  })
  state.tableData = result.data.list.map((i) => {
    return {
      ...i,
      region: regions.filter((j) => j.value === i.region)[0].name
    }
  })
  state.total = result.data.total
}

const handleQuery = (query) => {
  state.querys = {
    ...state.querys,
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
const selectTabByRegion = () => {
  state.chooseTab = region
  state.querys.region = region
}
selectTabByRegion()
</script>
