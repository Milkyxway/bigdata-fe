<template>
  <el-select v-model="selectVal" clearable>
    <el-option
      v-for="(item, index) in selections"
      v-bind:key="index"
      :label="item.label"
      :value="item.value"
      >{{ item.label }}</el-option
    ></el-select
  >
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
const props = defineProps({
  selections: {
    type: Array,
    default: []
  },
  select: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['updateSelect'])
const selectVal = ref(null)
const updateVal = (val) => {
  emits('updateSelect', val)
}
watch(
  () => selectVal.value,
  (val) => {
    updateVal(val)
  },
  {
    immediate: true
  }
)
</script>
