<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>修改密码</span>
      </div>
    </template>
    <el-form ref="formRef" :model="form">
      <el-form-item
        :label-width="formLabelWidth"
        prop="oldPwd"
        label="旧密码"
        :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]"
      >
        <el-input placeholder="请输入旧密码" v-model="form.oldPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        prop="newPwd"
        label="新密码"
        :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]"
      >
        <el-input placeholder="请输入新密码" v-model="form.newPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        prop="newPwdAgn"
        label="新密码重复"
        :rules="[{ required: true, message: '请再次输入旧密码', trigger: 'blur' }]"
      >
        <el-input
          placeholder="请再次输入新密码"
          v-model="form.newPwdAgn"
          type="password"
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="modifyPwd">确认修改</el-button>
    </el-form>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
import { modifyPwdReq } from '../api/login'
import { toast } from '../util/toast'
import { getLocalStore, rmLocalStore } from '../util/localStorage'
import router from '../router/index'
const formRef = ref()
const form = ref({
  oldPwd: '',
  newPwd: '',
  newPwdAgn: ''
})
const formLabelWidth = '140px'
const modifyPwd = () => {
  const { userId } = getLocalStore('userInfo')
  formRef.value.validate().then(async (res) => {
    await modifyPwdReq({
      ...form.value,
      userId
    })
    toast('修改成功，将重新登录')
    rmLocalStore('userInfo')
    router.replace('/login')
  })
}
</script>
<style scoped></style>
