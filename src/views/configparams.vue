<template>
  <NavBack />
  <el-card>
    <template #header>
      <div class="card-header">
        <span>增加参数</span>
      </div>
    </template>
    <el-form ref="formRef" :model="state.formData">
      <el-form-item label="参数名称">
        <el-input placeholder="请输入参数名称" v-model="state.formData.parameterName"></el-input>
      </el-form-item>
      <el-form-item label="参数通配符">
        <el-input placeholder="请输入参数通配符" v-model="state.formData.parameterKey"></el-input>
      </el-form-item>
      <el-form-item label="参数内容">
        <el-input placeholder="请输入参数内容" v-model="state.formData.parameterData"></el-input>
      </el-form-item>
      <el-form-item label="参数注释">
        <el-input placeholder="请输入参数注释" v-model="state.formData.parameterRemark"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="addParams">确认增加</el-button>
  </el-card>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import { addParamsReq } from '../api/report'
import NavBack from '../components/NavBack.vue'
import { toast } from '../util/toast'
const formRef = ref()
const state = reactive({
  formData: {
    parameterName: '',
    parameterData: '',
    parameterRemark: '',
    parameterKey: ''
  }
})

const addParams = () => {
  formRef.value.validate(async (resolve) => {
    if (resolve) {
      const result = await addParamsReq(state.formData)
      toast('添加成功！')
    }
  })
}
</script>
