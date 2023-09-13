<script setup>
import { ElConfigProvider } from 'element-plus'
import { RouterLink, RouterView } from 'vue-router'

import SideBar from './components/SideBar.vue'
// import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
<template>
  <el-config-provider :locale="zhCn">
    <RouterView></RouterView>
  </el-config-provider>
</template>
