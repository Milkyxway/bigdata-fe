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
        prop="Name"
        label="账号"
        :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]"
        :show-password="true"
      >
        <el-input v-model="form.Name" disabled></el-input>
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        prop="Password"
        label="旧密码"
        :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]"
      >
        <el-input
          placeholder="请输入旧密码"
          v-model="form.Password"
          type="password"
          :show-password="true"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label-width="formLabelWidth"
        prop="newPwd"
        label="新密码"
        :rules="[
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            pattern:
              /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*,\._\.=\.-])[0-9a-zA-Z!@#$%^&*,\\._\.=\.-]{8,20}$/,
            trigger: 'blur',
            message: '密码必须包含大小写字母,特殊字符和数字，且长度8-20位'
          }
        ]"
      >
        <el-input
          placeholder="请输入新密码"
          v-model="form.newPwd"
          type="password"
          :show-password="true"
        ></el-input>
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
          :show-password="true"
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="modifyFsbPwd">确认修改</el-button>
    </el-form>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
import { getFsbAccountPwdReq, updateFsbPwdReq } from '../api/login'
import { toast } from '../util/toast'
const formRef = ref()
const form = ref({
  Password: '',
  newPwd: '',
  newPwdAgn: '',
  Name: ''
})
const Id = ref()
const formLabelWidth = '140px'

const getPsbAccountPwd = async () => {
  const result = await getFsbAccountPwdReq()
  form.value.Name = result.data.Name
  form.value.Password = result.data.Password
  Id.value = result.data.Id
}

const modifyFsbPwd = () => {
  formRef.value.validate().then(async (res) => {
    await updateFsbPwdReq({
      Id: Id.value,
      Password: form.value.newPwd
    })
    toast('防水坝密码修改成功')
  })
}
getPsbAccountPwd()
</script>
<style scoped></style>
