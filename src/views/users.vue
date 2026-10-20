<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>账号管理</span>
      </div>
    </template>

    <el-table :data="state.userList" border stripe style="width: 100%">
      <el-table-column prop="username" label="用户名" min-width="120" />
      <el-table-column prop="passwordShow" label="密码" min-width="120" />
      <el-table-column prop="role" label="角色" min-width="100" />
      <el-table-column prop="usernameCn" label="用户名（中文）" min-width="140" />
      <el-table-column prop="region" label="所属分公司" min-width="100" />
      <el-table-column prop="orgnization" label="所在部门" min-width="150" />
      <el-table-column label="操作" min-width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog
    v-model="state.showDialog"
    title="编辑账号"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="state.editForm" label-width="100px">
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
      >
        <el-input v-model="state.editForm.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="state.editForm.password"
          type="password"
          show-password
          placeholder="留空则不修改密码"
        />
      </el-form-item>
      <el-form-item
        label="角色"
        prop="role"
        :rules="[{ required: true, message: '请选择角色', trigger: 'blur' }]"
      >
        <SelectCommon
          v-model:select="state.editForm.role"
          :selections="roleList"
          @updateSelect="(val) => (state.editForm.role = val)"
        />
      </el-form-item>
      <el-form-item
        label="中文名"
        prop="usernameCn"
        :rules="[{ required: true, message: '请输入中文名', trigger: 'blur' }]"
      >
        <el-input v-model="state.editForm.usernameCn" />
      </el-form-item>
      <el-form-item
        label="所属分公司"
        prop="region"
        :rules="[{ required: true, message: '请选择分公司', trigger: 'blur' }]"
      >
        <SelectCommon
          v-model:select="state.editForm.region"
          :selections="regionOptions"
          @updateSelect="(val) => (state.editForm.region = val)"
        />
      </el-form-item>
      <el-form-item
        label="所在部门"
        prop="orgnization"
        :rules="[{ required: true, message: '请选择部门', trigger: 'blur' }]"
      >
        <SelectCommon
          v-model:select="state.editForm.orgnization"
          :selections="getOrgTreeByRegion()"
          @updateSelect="(val) => (state.editForm.orgnization = val)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="state.showDialog = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import SelectCommon from '../components/SelectCommon.vue'
import { toast } from '../util/toast'
import { ElMessageBoxFn } from '../util/toast'
import { roleList, regions } from '../constant/index'
import { getOrgTreeByRegion } from '../util/orgnization'
import { getUsersReq, deleteUserReq, updateUserReq } from '../api/login'

const formRef = ref()

const regionOptions = regions.map((r) => ({ label: r.label, value: r.label }))

const state = reactive({
  userList: [],
  showDialog: false,
  editForm: {
    userId: '',
    username: '',
    password: '',
    role: '',
    usernameCn: '',
    region: '',
    orgnization: ''
  }
})

const getUsers = async () => {
  const result = await getUsersReq()
  state.userList = (result.data.list || []).map((u) => ({
    ...u,
    passwordShow: '******'
  }))
}

const openEdit = (row) => {
  state.editForm = {
    userId: row.userId,
    username: row.username,
    password: '',
    role: row.role,
    usernameCn: row.usernameCn || '',
    region: row.region || '',
    orgnization: row.orgnization || ''
  }
  state.showDialog = true
}

const submitEdit = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    const params = { ...state.editForm }
    if (!params.password) {
      delete params.password
    }
    await updateUserReq(params)
    state.showDialog = false
    toast('修改成功')
    getUsers()
  })
}

const handleDelete = (row) => {
  ElMessageBoxFn(`确定要删除 ${row.username}？`, async () => {
    await deleteUserReq({ userId: row.userId })
    toast('删除成功')
    getUsers()
  })
}

getUsers()
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
</style>
