<template>
  <el-dialog
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    v-model="props.showUploadDialog"
    title="输入脚本"
    :destroy-on-close="true"
  >
    <div class="row-item">
      <span class="sql-name">脚本名称</span>
      <el-input placeholder="请输入脚本名称" v-model="sqlName"></el-input>
    </div>
    <WhiteSpace />
    <MdEditor v-model="sqlContent" />
    <WhiteSpace />
    <el-button type="primary" @click="closeModal">取消</el-button>
    <el-button @click="uploadSqls" type="danger">确认</el-button>
  </el-dialog>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import { MdEditor } from 'md-editor-v3'
import WhiteSpace from './WhiteSpace.vue'
import 'md-editor-v3/lib/style.css'
import { addCommonUseSqlAddReq, updateCommonSqlReq } from '../api/report'
import { toast } from '../util/toast'
const props = defineProps({
  content: {},
  showUploadDialog: {
    type: Boolean
  },
  sqlName: {
    type: String
  },
  type: {
    type: String
  },
  sqlId: {
    type: Number
  }
})
const emits = defineEmits(['updateContent', 'refreshList'])
const sqlContent = ref()
const sqlName = ref()
watch(
  () => props.content,
  (val) => {
    sqlContent.value = val
  }
)
watch(
  () => props.sqlName,
  (val) => {
    sqlName.value = val
  }
)
const closeModal = () => {
  emits('closeModal')
  sqlName.value = ''
  sqlContent.value = ''
}

const uploadSqls = async () => {
  if (!sqlName.value) {
    return toast('请输入脚本名称', 'warning')
  }
  if (!sqlContent.value) {
    return toast('请输入脚本内容', 'warning')
  }

  const params = {
    sqlContent: sqlContent.value,
    sqlName: sqlName.value
  }

  const result =
    props.type === 'add'
      ? await addCommonUseSqlAddReq({
          ...params
        })
      : await updateCommonSqlReq({
          ...params,
          sqlId: props.sqlId
        })
  toast('上传成功！')
  closeModal()
  emits('refreshList')
}
</script>
<style scoped>
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.sql-name {
  white-space: nowrap;
  min-width: 100px;
  display: inline-block;
  text-align: left;
}
</style>
