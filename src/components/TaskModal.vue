<template>
  <el-dialog
    :show-close="false"
    :close-on-press-escape="false"
    v-model="props.modalVisible"
    :title="getModalTitle"
  >
    <el-form :model="form" ref="formRef">
      <el-form-item
        label="任务类别"
        :label-width="formLabelWidth"
        prop="category"
        :rules="rules('请选择任务类别')"
      >
        <el-select v-model="form.category" placeholder="请选择任务类别" :disabled="disableCondition"
          ><el-option
            v-for="(item, index) in state.taskCategory"
            v-bind:key="index"
            :label="item.label"
            :value="item.value"
            >{{ item.label }}</el-option
          ></el-select
        >
      </el-form-item>
      <el-form-item
        label="任务内容"
        :label-width="formLabelWidth"
        prop="taskContent"
        :rules="rules('请输入任务内容')"
      >
        <el-input
          :autosize="inputProps.autoSize"
          :type="inputProps.type"
          :autocomplete="inputProps.autocomplete"
          :placeholder="'请输入任务内容'"
          v-model="form.taskContent"
          :disabled="disableCondition"
        />
      </el-form-item>
      <el-form-item
        label="任务来源"
        :label-width="formLabelWidth"
        prop="taskContent"
        :rules="rules('请选择任务来源')"
      >
        <el-select
          v-model="form.taskSource"
          placeholder="请选择任务来源"
          clearable
          :disabled="disableCondition"
        >
          <el-option
            v-for="item in taskOrigin"
            v-bind:key="item.key"
            :value="item.value"
            :label="item.label"
            >{{ item.label }}</el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item label="来源描述" :label-width="formLabelWidth" prop="sourceDesc">
        <el-input
          clearable
          :disabled="disableCondition"
          placeholder="请填写来源描述"
          v-model="form.sourceDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="提出部门" :label-width="formLabelWidth" prop="ariseOrg">
        <el-select
          v-model="form.ariseOrg"
          placeholder="请选择提出部门"
          clearable
          :disabled="disableCondition"
          ><el-option
            v-for="item in orgnizationList"
            :label="item.label"
            :value="item.value"
            v-bind:key="item.key"
            >{{ item.label }}</el-option
          ></el-select
        >
      </el-form-item>
      <el-form-item
        label="责任部门"
        :label-width="formLabelWidth"
        prop="leadOrg"
        :rules="rules('请选择责任部门')"
      >
        <el-select
          v-model="form.leadOrg"
          placeholder="请选择责任部门"
          clearable
          :disabled="disableCondition"
          ><el-option
            v-for="item in orgnizationList"
            :label="item.label"
            :value="item.value"
            v-bind:key="item.key"
            >{{ item.label }}</el-option
          ></el-select
        >
      </el-form-item>
      <el-form-item label="协办部门" :label-width="formLabelWidth" prop="assistOrg">
        <el-select
          v-model="form.assistOrg"
          placeholder="请选择协办部门"
          clearable
          multiple
          :disabled="disableCondition"
          ><el-option
            v-for="item in orgnizationList"
            :label="item.label"
            :value="item.value"
            v-bind:key="item.key"
            >{{ item.label }}</el-option
          ></el-select
        >
      </el-form-item>
      <el-form-item
        label="备注"
        :label-width="formLabelWidth"
        prop="comment"
        :rules="[{ required: modalType === 'appeal', message: '请输入调整内容' }]"
      >
        <el-input
          :autosize="inputProps.autoSize"
          :type="inputProps.type"
          :autocomplete="inputProps.autocomplete"
          :placeholder="inputProps.placeHolder"
          v-model="form.comment"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleCommit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import {
  taskStatusList,
  taskCategory,
  orgnizationTree,
  appealCategory,
  taskOrigin
} from '../constant/index'
const props = defineProps({
  modalVisible: {
    default: false,
    type: Boolean
  },
  modalType: {
    default: '',
    type: String
  },
  formData: {
    default: {},
    type: Object
  }
})

const emit = defineEmits(['handleCancel', 'handleCommit'])

const rules = computed(() => {
  return function (message) {
    return [
      {
        required: true,
        trigger: 'change',
        message
      }
    ]
  }
})
const formLabelWidth = '140px'

let form = reactive({
  category: '',
  taskContent: '',
  orgnization: '',
  taskGoal: '',
  status: 0,
  comment: '',
  childTask: true,
  leadOrg: '',
  assistOrg: '',
  ariseOrg: null,
  taskSource: '',
  sourceDesc: ''
})
let state = reactive({
  taskCategory
})

const formRef = ref()
const inputProps = ref({
  placeHolder: '请输入',
  type: 'textarea',
  autoSize: {
    minRows: 2,
    maxRows: 6
  },
  autocomplete: false
})
const taskStatus = ref(taskStatusList)
const orgnizationList = ref(orgnizationTree)

watch(
  () => props.formData,
  (val) => (form = val),
  {
    immediate: true
  }
)
state.taskCategory = state.taskCategory.filter((i) => i.value !== 0)

const getModalTitle = computed(() => {
  let title = ''
  switch (props.modalType) {
    case 'add':
      title = '新建任务'
      break
    case 'update':
      title = '修改任务'
      break
    case 'appeal':
      title = '调整任务'
      break
    default:
      break
  }
  return title
})
const disableCondition = computed(() => {
  return props.modalType === 'appeal'
})
const handleCancel = () => {
  emit('handleCancel')
}
const handleCommit = () => {
  formRef.value
    .validate()
    .then((res) => {
      emit('handleCommit', {
        ...form,
        assistOrg: form.assistOrg ? form.assistOrg.join(',') : ''
      })
    })
    .catch((err) => {
      // console.log(err)
    })
}
</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
