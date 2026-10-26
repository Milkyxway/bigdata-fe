<template>
  <div class="row-item">
    <el-button @click="onUpload" :type="btnType">{{ props.btnTxt }}</el-button>
    <input ref="uploadRef" type="file" :accept="props.accept" @change="beforeUpload" hidden />
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  btnTxt: {
    type: String
  },
  btnType: {
    type: String,
    default: 'primary'
  },
  accept: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['handleFileChange'])
const uploadRef = ref()
const beforeUpload = (e) => {
  emits('handleFileChange', e.target.files[0])
}
const onUpload = () => {
  uploadRef.value.click()
}
</script>
