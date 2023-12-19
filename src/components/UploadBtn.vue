<template>
  <Upload
    :btn-txt="'上传文件'"
    btn-type="danger"
    @handleFileChange="(file) => handleFileChange(file)"
  />
</template>
<script setup>
import dayjs from 'dayjs'
import Upload from './Upload.vue'
import { uploadReq } from '../api/report'
import { toast } from '../util/toast'
const emits = defineEmits(['updateFile'])

const handleFileChange = async (file) => {
  const now = dayjs().format('YYYYMMDDHHmmss')
  const fileSuffix = file.name.split('.')[1]
  const fileName = `${now}.${fileSuffix}`
  const copyFile = new File([file], `${fileName}`)
  const formData = new FormData()
  formData.append('file', copyFile)
  await uploadReq(formData)
  toast('上传成功')
  emits('updateFile', copyFile.name)
}
</script>
