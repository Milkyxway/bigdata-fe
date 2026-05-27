<template>
  <div class="common-title">各站新发展单宽带客户数量</div>
  <newcustbarchart :data="props.data.newCust"></newcustbarchart>

  <div class="common-title">有价宽带缴费终端数</div>
  <el-radio-group v-model="state.choice" @change="handleChange">
    <el-radio label="itvNum">按当前缴费终端数</el-radio>
    <el-radio label="itvRate">按当前保有率</el-radio>
  </el-radio-group>
  <sectionrank
    :sectionTask="state.hylArr"
    :sectionList="props.data.sectionList"
    columnName1="当前缴费终端数"
    columnName2="去年末缴费终端数"
    columnName3="保有率"
    columnName4="净增长"
  ></sectionrank>

  <div class="common-title">各站订购包年宽带数量</div>
  <el-switch v-model="state.switch" class="ml-2" />
  <newcustbarchart
    :data="!state.switch ? props.data.bnkd : props.data.bnkdScore"
    title="订购客户数"
  ></newcustbarchart>
  <!-- <div class="common-title">明厨亮灶订购数量</div>
  <newcustbarchart :data="props.data.mclz" title="订购客户数"></newcustbarchart>
  <div class="common-title">智慧家庭</div>
  <newcustbarchart :data="props.data.zhjt" title="订购客户数"></newcustbarchart> -->
</template>
<script setup>
import { computed, reactive } from 'vue'
import newcustbarchart from './newcustbarchart.vue'
import sectionrank from './sectionrank.vue'
const props = defineProps({
  data: {
    type: Array
  }
})
console.log(props.data)
const state = reactive({
  hylArr: props.data.yjkd,
  switch: false
})
const handleChange = (label) => {
  const data = props.data.yjkd
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
