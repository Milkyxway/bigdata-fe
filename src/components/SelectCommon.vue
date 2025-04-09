<template>
  <el-select v-model="selectVal" clearable :disabled="props.disabled" :multiple="props.multiple">
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
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['updateSelect'])
const selectVal = ref(props.select)
const updateVal = (val) => {
  emits('updateSelect', val)
}
watch(
  () => selectVal.value,
  (val) => {
    // if (val !== null) {
    updateVal(val)
    // }
  },
  {
    immediate: true
  }
)
</script>
