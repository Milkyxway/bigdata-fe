<template>
  <div class="login-page">
    <img src="../assets/loginbg.png" class="login-bg" />
    <div class="login-form">
      <el-form :model="formData" ref="loginFormRef">
        <el-form-item
          prop="username"
          :label="accountProps.label"
          :rules="[
            {
              required: true,
              message: accountProps.placeHolder,
              trigger: 'blur'
            }
          ]"
        >
          <el-input :placeholder="accountProps.placeHolder" v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :label="passwordProps.label"
          :rules="[
            {
              required: true,
              message: passwordProps.placeHolder,
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            :placeholder="passwordProps.placeHolder"
            v-model="formData.password"
            type="password"
            :show-password="true"
          ></el-input>
        </el-form-item>
        <div class="btn-wrap">
          <el-button type="primary" @click="login" class="login-btn">确认登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { loginReq } from '../api/login'

import { getLocalStore, setLocalStore } from '../util/localStorage'
import { userLoginStore } from '../stores/login'
const authStore = userLoginStore()
const { userInfo } = storeToRefs(authStore)
const { loginFn, setUserInfo } = authStore
const loginFormRef = ref()
const formData = ref({
  username: '',
  password: ''
})
const router = useRouter()
const accountProps = ref({
  placeHolder: '请输入账号',
  clearable: true,
  label: '账号',
  required: true
})
const passwordProps = ref({
  placeHolder: '请输入密码',
  type: 'password',
  clearable: true,
  label: '密码',
  required: true
})

const login = () => {
  loginFormRef.value
    .validate()
    .then(async (res) => {
      const result = await loginReq(formData.value)
      setLocalStore('userInfo', result.data.userInfo)
      router.replace('/develop/tasklist')
    })
    .catch((err) => {
      // console.log(err)
    })
}

const redirect = () => {
  const userInfo = getLocalStore('userInfo')
  if (userInfo && userInfo.role) {
    router.replace('/develop/tasklist')
  }
}
redirect()
</script>
<style scoped>
.login-page {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100vh;
  width: 100%;
  font-size: 32px;
  /* position: relative; */
  /* background-image: url('../assets/loginbg.png');
  background-repeat: no-repeat;
  background-size: contain; */
}
.login-bg {
  width: 100%;
  height: auto;
}

.login-form {
  width: 336px;
  position: absolute;
  top: 360px;
  left: 860px;
}
.title {
  color: #cecece;
  font-weight: bold;
  font-size: 28px;
}
.btn-wrap {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.login-btn {
  width: 10.5rem;
  height: 2rem;
  background-color: #0076fe;
  border-radius: 37px;
  margin-top: 4rem;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 2rem;
}
</style>
