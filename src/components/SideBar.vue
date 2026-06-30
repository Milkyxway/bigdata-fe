<template>
  <el-menu
    :default-active="currentSiderPath"
    class="menu_wrap"
    @open="handleOpen"
    @close="handleClose"
    :router="true"
  >
    <el-sub-menu v-for="item in homeMenu" :key="item.path" :index="item.path" class="sub_menu">
      <template #title>
        <el-icon><component :is="iconMap[item.path]" /></el-icon>
        <span>{{ item.label }}</span>
      </template>
      <el-menu-item-group :key="item.path">
        <template
          v-for="child in (item.children || []).filter(
            (i) => i.isSider && (!i.auth || i.auth.includes(role))
          )"
          :key="child.path"
        >
          <el-menu-item
            v-if="showMenuItem(child) && !child.externalLink"
            :key="child.path"
            :index="child.path"
            class="menu_item"
            >{{ child.label }}</el-menu-item
          >
          <el-menu-item
            v-else-if="showMenuItem(child) && child.externalLink"
            :key="child.path"
            class="menu_item external-link"
            @click="handleExternalLink(child.externalLink, child.ssoApiUrl)"
            >{{ child.label }}</el-menu-item
          >
        </template>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>
<script setup>
import { reactive, computed } from 'vue'
import { getLocalStore } from '../util/localStorage'
import router, { routeList } from '../router/index'
import { DataAnalysis, List, Document, Setting, User, Monitor } from '@element-plus/icons-vue'
const role = getLocalStore('userInfo').role
const homeMenu =
  routeList
    .filter((item) => item.id === 'home')[0]
    ?.children.filter((i) => {
      if (i.auth) {
        return i.auth?.includes(role) && i
      }
      return i
    }) || []
let menuLevel = router.currentRoute.value.matched?.length || 0
let currentPath = router.currentRoute.value.fullPath
const currentSiderPath = computed(() => {
  let fullPath = router.currentRoute.value.fullPath
  let siderPath = fullPath.split('/')?.splice(0, 3)?.join('/')
  return siderPath
})
const defaultSelectedKey =
  currentPath === '/' || menuLevel < 3 ? '/dataCenter/project' : currentPath

const handleOpen = () => {}
const handleClose = () => {}
const iconMap = {
  '/report': DataAnalysis,
  '/develop': List,
  '/sql': Document,
  '/tools': Setting,
  '/personal': User,
  '/dashboard': Monitor
}
const handleExternalLink = async (externalLink, ssoApiUrl) => {
  try {
    const apiUrl = ssoApiUrl || `${externalLink}/api/auth/login-by-key?key=data-dashboard-sso-2024`
    const res = await fetch(apiUrl)
    const data = await res.json()
    let targetUrl = externalLink
    if (data.code === 200) {
      const token = data.data.token
      targetUrl = `${externalLink}/login?token=${token}`
    }
    const a = document.createElement('a')
    a.href = targetUrl
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    window.open(externalLink, '_blank')
  }
}
const showMenuItem = computed(() => {
  return function (item) {
    if (item.auth) {
      return item.auth.includes(role)
    }
    return true
  }
})
</script>
<style scoped>
@keyframes moveRight {
  0% {
    left: 0;
    top: 0;
  }
  100% {
    left: 30%;
    top: 0;
  }
}
.menu_wrap {
  font-size: 14px;
  line-height: 22px;
  color: #666666;
  --el-menu-text-color: #666666;
}
.sub_menu {
  &.is-active {
    :deep(.el-sub-menu__title) {
      position: relative;
      color: #333333;
      .sub_menu_title {
        font-weight: 600;
      }
    }
  }
  .menu_item {
    --el-menu-hover-bg-color: transparent;
    /* --el-menu-text-color: #666666; */
    border-radius: 6px;
    padding: 0;
    display: inline-block;
    width: 90%;
    /* width: 90%; */
    &.is-active {
      color: var(--el-color-primary-light-3);
      background: var(--el-color-primary-light-9);
      /* animation: moveRight 0.5s;
      animation-timing-function: ease-out;
      animation-iteration-count: 2;
      animation-direction: alternate; */
    }
  }
}
.el-menu-vertical-demo {
  /* background: rgba(1, 92, 172, 0.2); */
}
</style>
