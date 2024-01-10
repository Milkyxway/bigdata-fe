<script setup>
import { storeToRefs } from 'pinia'
import { ElMessageBox } from 'element-plus'
import SideBar from '../components/SideBar.vue'
import router from '../router'
import { rmLocalStore, getLocalStore } from '../util/localStorage'
import { userLoginStore } from '../stores/login'
const authStore = userLoginStore()
const { userInfo } = storeToRefs(authStore)

const userInfoLocal = getLocalStore('userInfo')
const logOutFn = () => {
  ElMessageBox.confirm('确定要登出吗?', '警告', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    callback: async (action) => {
      if (action === 'confirm') {
        rmLocalStore('userInfo')
        router.replace('/login')
      }
    }
  })
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header
        ><span><img src="../assets/logo.png" class="logo-icon" /></span>

        <div class="user-wrap">
          <el-icon><User /></el-icon
          ><span>{{ userInfoLocal.usernameCn || userInfoLocal.username }}</span>
          <span @click="logOutFn" class="logout">登出</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="220px">
          <SideBar></SideBar>
        </el-aside>
        <el-container>
          <el-main
            ><router-view v-slot="{ Component }"
              ><keep-alive include="报表列表"
                ><component :is="Component" /></keep-alive></router-view
          ></el-main>
          <!-- <el-footer>江苏有线无锡分公司版权所有Copyright © 2023 </el-footer> -->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.common-layout {
  .el-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .el-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-header,
  .el-footer {
    background: #fff;
    /* background-color: var(--el-color-primary-light-7); */
    color: var(--el-text-color-primary);
    text-align: center;
  }

  .el-aside {
    /* background: rgba(1, 92, 172, 0.2); */
    /* background-color: var(--el-color-primary-light-8); */
    color: var(--el-text-color-primary);
    text-align: center;
  }

  .el-main {
    background: #f7f8fb;
    /* background-color: var(--el-color-primary-light-9); */
    color: var(--el-text-color-primary);
    text-align: center;
  }
}
.is-vertical {
  height: 100vh;
}
.logo-icon {
  width: 400px;
  height: auto;
}
.user-wrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.logout {
  user-select: none;
  cursor: pointer;
  padding-left: 20px;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
.nav-bar {
}
</style>
