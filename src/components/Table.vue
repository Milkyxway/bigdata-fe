<template>
  <div class="table">
    <div class="table_wrapper">
      <el-table
        height="100%"
        :data="tableData"
        :stripe="tableConfig.stripe"
        v-loading="tableLoading"
        @sortChange="handleSortChange"
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :sortable="column.sortable"
          :formatter="column.formatter"
          :align="column.align || 'left'"
          :className="column.className + (column.cellClick ? ' column_cell_click' : '')"
          :show-overflow-tooltip="true"
        >
          <template #header v-if="column.slot">
            <span class="label_text">{{ column.label }}</span>
            <el-popover placement="bottom" trigger="hover" :width="250">
              <template #reference>
                <i class="icon icon_tips"></i>
              </template>
              <div v-for="(tip, index) in column.tips" :key="index">
                {{ tip }}
              </div>
            </el-popover>
          </template>
          <template #default="{ row }" v-if="column.cellClick">
            <span @click="column.handleCellClickFn(row)">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              v-for="operation in tableOperations"
              class="btn_operation"
              type="text"
              size="small"
              :key="operation.code"
              @click="operation.fn(row)"
              >{{ operation.label }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <WhiteSpace />
    <el-pagination
      class="pagination"
      v-model:currentPage="currentPageNum"
      v-model:pageSize="currentPageSize"
      background
      layout="total, sizes, jumper, prev, pager, next"
      :total="tableTotal || tableData.length"
    >
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import WhiteSpace from './WhiteSpace.vue'
const props = defineProps({
  tableColumns: {
    type: Array,
    default: () => []
  },
  tableOperations: {
    type: Array,
    default: () => []
  },
  tableData: {
    type: Array,
    default: () => []
  },
  tableTotal: {
    type: Number,
    default: 0
  },
  tableLoading: {
    type: Boolean,
    default: false
  },
  tableConfig: {
    type: Object,
    default: () => ({
      loading: false,
      stripe: true
    })
  }
})
const handleSortChange = ({ prop, order }) => {
  let isUpdateTimeDesc
  let isNameDesc
  if (prop === 'updateTime') {
    // null不排序，ascending正序,descending倒序
    isUpdateTimeDesc = order === 'descending' ? true : order === 'ascending' ? false : undefined
  }
  // 名称首字母排序
  else if (prop === 'name') {
    isNameDesc = order === 'descending' ? true : order === 'ascending' ? false : undefined
  }
  emits('queryWithExtraParams', {
    // true倒序，false正序
    isUpdateTimeDesc,
    isNameDesc
  })
}
const emits = defineEmits(['queryWithExtraParams'])
const currentPageNum = ref(1)
const currentPageSize = ref(10)
watch(
  () => currentPageNum.value,
  (newValue, oldValue) => {
    emits('queryWithExtraParams', {
      pageNum: newValue,
      pageSize: currentPageSize.value
    })
  }
)
watch(
  () => currentPageSize.value,
  (newValue, oldValue) => {
    // 当页面大小发生变化时，重置到第一页
    currentPageNum.value = 1
    emits('queryWithExtraParams', {
      pageNum: 1,
      pageSize: newValue
    })
  }
)
</script>
<style scoped>
.pagination {
  justify-content: flex-end;
}
</style>
