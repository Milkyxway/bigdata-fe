<template>
  <div class="row-item">
    <div class="row-item">
      <span class="paddingLR10">计划完成目标</span>
      <el-input
        v-model="props.data.taskGoal"
        placeholder="请填写计划完成目标"
        :disabled="props.taskStatus > 2"
      ></el-input>
    </div>
    <div class="row-item">
      <span class="paddingLR10">计划完成时间</span>
      <el-date-picker
        v-model="props.data.finishTime"
        placeholder="请选择计划完成时间"
        :disabled="[3, 7, 6].includes(props.taskStatus)"
      ></el-date-picker>
    </div>
    <div class="row-item" v-if="props.taskStatus == 5">
      <span class="paddingLR10">延期说明</span>
      <el-input placeholder="请填写延期说明" v-model="props.data.delayReason"></el-input>
    </div>
    <div class="row-item" v-if="[3, 7].includes(props.taskStatus)">
      <span class="paddingLR10">实际完成时间</span>
      <el-date-picker
        placeholder="请选择实际完成时间"
        v-model="props.data.actualFinish"
      ></el-date-picker>
    </div>
    <div class="row-item" v-if="[3, 7].includes(props.taskStatus)">
      <span class="paddingLR10">完成情况说明</span>
      <el-input placeholder="请填写完成情况说明" v-model="props.data.completeDesc"></el-input>
    </div>
    <el-icon color="#409eff" @click="addChild" v-if="props.isFirst">
      <CirclePlus v-if="props.fatherStatus == 1" />
    </el-icon>
    <el-icon @click="deleteChild(index)" v-if="!props.isFirst"
      ><Delete v-if="props.fatherStatus == 1"
    /></el-icon>
    <div v-if="[3, 5, 7].includes(props.taskStatus)" @click="handleItemSubmit" class="submit-btn">
      提交
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  isFirst: {
    type: Boolean,
    default: true
  },
  taskStatus: {
    type: Number,
    default: 0
  },
  fatherStatus: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['addChild', 'deleteChild', 'handleItemSubmit'])

const addChild = () => {
  emits('addChild')
}

const deleteChild = () => {
  emits('deleteChild')
}

const handleItemSubmit = () => {
  emits('handleItemSubmit', props.data)
}
</script>
<style scoped>
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
}
.paddingLR10 {
  padding: 0 10px;
}
.submit-btn {
  color: #409eff;
}
</style>
