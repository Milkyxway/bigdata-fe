<template>
  <div class="common-title">各站新开5g卡数量</div>
  <newcustbarchart :data="props.data.newCust"></newcustbarchart>
  <div class="common-title">各站5g活跃率排名</div>
  <el-radio-group v-model="state.choice" @change="handleChange">
    <el-radio label="itvNum">按当前在网数</el-radio>
    <el-radio label="default1">按当前活跃数</el-radio>
    <el-radio label="hyl">按当前活跃率</el-radio>
    <el-radio label="default3">按活跃数净增长</el-radio>
    <el-radio label="itvIncrease">按在网数净增长</el-radio>
  </el-radio-group>
  <sectionrank
    columnName1="当前在网数"
    columnName2="去年末在网数"
    columnName3="在网数净增长"
    columnName4="当前活跃率"
    columnName5="当前活跃数"
    columnName6="去年末活跃数"
    columnName7="活跃数净增长"
    :sectionTask="state.hylArr"
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
const state = reactive({
  choice: 1,
  hylArr: props.data.hyl
})
const handleChange = (label) => {
  const data = props.data.hyl
  state.hylArr = data.sort((a, b) => b[label] - a[label])
}
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
