<template>
  <div class="common-title">各站新开5g卡数量</div>
  <newcustbarchart :data="props.data.newCust"></newcustbarchart>
  <div class="common-title">各站5g活跃率排名</div>
  <sectionrank
    columnName1="活跃数"
    columnName2="在网数"
    columnName3="活跃率"
    :sectionTask="props.data.hyl"
  />
</template>
<script setup>
import { computed, reactive } from 'vue'
import newcustbarchart from './newcustbarchart.vue'
const props = defineProps({
  data: {
    type: Array
  }
})
</script>
<style scoped>
.common-title {
  margin: 0 0 0 20px;
  font-family: 思源黑体;
  font-size: 16px;
  font-weight: 500;
  line-height: 35px;
  letter-spacing: 0px;
  color: #6ccee6;
  position: relative;
  /* 设置字体透明 */
  color: transparent;
  /* 设置线性渐变，从红色渐变到蓝色 */
  background-image: linear-gradient(0deg, #94ffff, #4397ff);
  /* 使用 -webkit-background-clip 属性将背景剪裁至文本形状 */
  -webkit-background-clip: text;
  /* 非Webkit内核浏览器需要使用标准前缀 */
  background-clip: text;
  /* 把当前元素设置为行内块，以便能够应用背景 */
  display: inline-block;
}
</style>
