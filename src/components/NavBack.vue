<template>
  <div @click="clickBack" class="back-icon">
    <el-icon><ArrowLeft /></el-icon>
    <span>返回</span>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const clickBack = () => {
  router.back()
}
</script>
<style scoped>
.back-icon {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0 0 10px 0;
}
</style>
