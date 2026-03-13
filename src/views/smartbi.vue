<template>
  <div class="chart-page">
    <div class="top-content">
      <div class="left">
        <span
          :class="state.view === '广电站' ? 'active-font' : 'common-font'"
          @click="() => (state.view = '广电站')"
          >广电站</span
        >
        <span> | </span>
        <span
          :class="state.view === '发展人' ? 'active-font' : 'common-font'"
          @click="() => (state.view = '发展人')"
        >
          发展人</span
        >
      </div>
      <div class="title">无锡分公司数据智看</div>
      <div class="right">数据更新时间：2026-02-25</div>
    </div>

    <div class="data-part" v-if="state.init">
      <div class="common-container">
        <div class="common-title">数据总览</div>
        <div class="common-container_1">
          <threedata></threedata>
        </div>
        <div @click="showModal('xz')" style="width: 100%">
          <div class="common-title">各站月销账金额</div>
          <xzlinechart :data="state.xzAmt" :data1="state.xzAmt_lastmonth"></xzlinechart>
        </div>
        <div @click="showModal('xz')" style="width: 100%">
          <div class="common-title">各站新发展客户数量</div>
          <newcustbarchart :data="state.newCust"></newcustbarchart>
        </div>
        <!-- <demo></demo> -->
      </div>
      <!-- <div style="width: 1%"></div> -->
      <div class="common-container" style="width: 30%">
        <div class="common-title">增值产品订购占比</div>
        <hlwpiechart :data="state.hlwcpArr" :hlwTotal="state.hlwTotal"></hlwpiechart>
        <div class="common-title">各站数字电视保有率排名</div>
        <sectionrank
          :sectionTask="state.sectionTask"
          :sectionList="sectionList"
          @handleExpand="handleExpand"
          :expandTxt="state.expandTxt"
        ></sectionrank>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import sectionrank from '../components/sectionrank.vue'
import xzlinechart from '../components/xzlinechart.vue'
import newcustbarchart from '../components/newcustbarchart.vue'
import threedata from '../components/threedata.vue'
import hlwpiechart from '../components/hlwpiechart.vue'
import { getDailyReportReq } from '../api/report'
const state = reactive({
  init: false,
  view: '广电站',
  expandTxt: '展开',
  hlwTotal: 0,
  sectionTask: [],
  xzAmt: [],
  xzAmt_lastmonth: [],
  newCust: [],
  hlwcpArr: [
    {
      name: '爱奇艺',
      amt: 404
    },
    {
      name: '炫力少儿',
      amt: 50
    },
    {
      name: '云视听',
      amt: 76
    },
    {
      name: '酷喵',
      amt: 240
    }
  ]
})
const showModal = () => {}

const getActiveStyle = computed((activeName) =>
  activeName === state.view ? 'active-font' : 'common-font'
)

const handleExpand = (txt) => {
  state.sectionTask = txt === '展开' ? state.sectionTaskCp : state.sectionTask.slice(0, 17)
  state.expandTxt = txt === '展开' ? '收起' : '展开'
}

const tabChange = () => {
  state.view === '发展人' ? (state.view = '广电站') : (state.view = '发展人')
}

const sumHlw = () => {
  let sum = 0
  state.hlwcpArr.map((i) => {
    sum += i.amt
  })
  return sum
}

const formatData = (data) => {
  return data.map((i) => {})
}

const getDailyReport = async () => {
  const res = await getDailyReportReq({ taskId: 2189 })
  const {
    data: { jsonData }
  } = res
  state.sectionTask = jsonData['数字电视缴费保有率'].map((i) => {
    return {
      districtName: i.REGION_NAME2,
      itvNum: i['缴费客户数当前'],
      itvRate: i['ROUND(缴费客户数当前/缴费客户数20251231,4)']
    }
  })
  state.newCust = jsonData['各业务新发展'].map((i) => {
    return {
      districtName: i.DISTRICT_NAME,
      tvCust: i.CNT,
      lanCust: i.CNT1,
      mobileCust: i.CNT2
    }
  })
  state.xzAmt = jsonData['各站销账两月对比'].map((i) => {
    return { districtName: i.DISTRICT_NAME, amt: i['销账上月'] }
  })
  state.xzAmt_lastmonth = jsonData['各站销账两月对比'].map((i) => {
    return { districtName: i.DISTRICT_NAME, amt: i['销账上上月'] }
  })
  state.init = true
}
const init = () => {
  state.sectionTaskCp = state.sectionTask
  state.sectionTask = state.sectionTask.slice(0, 17)
  state.hlwTotal = sumHlw()
  getDailyReport()
}
init()
</script>
<style scoped>
.chart-page {
  width: 100%;
  min-height: 100vh;
  background: #0a1635;
}
.title {
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.data-part {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1;
  box-sizing: border-box;
}
.common-border {
  background: #14234b;
  border: 2px rgba(6, 4, 4, 0.3);
  box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.18), inset 0px 0px 99px 0px rgba(255, 255, 255, 0.17);
}
.left-content {
  width: 26%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  margin: 0 30px 0 0;
}
.center-content {
  width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
}

.common-container {
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  opacity: 1;
  background: #121f44;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.18), inset 0px 0px 99px 0px rgba(255, 255, 255, 0.17);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
}
.common-container_1 {
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  opacity: 1;

  display: flex;
  flex-direction: row;
  align-items: space-between;
  box-sizing: border-box;
}

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
.common-title::before {
  content: '';
  width: 4px;
  height: 20px;
  border-radius: 3px;
  opacity: 1;
  background: #6ccee6;
  box-sizing: border-box;
  position: absolute;
  left: -10px;
  top: 8px;
}

.total-amount {
  font-size: 32px;
}

.right-content {
  width: 26%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  margin: 0 0 0 30px;
}

.top-content {
  width: 100%;
  position: relative;
}
.left {
  position: fixed;
  top: 10px;
  left: 10px;
  font-size: 10px;
}
.right {
  position: fixed;
  right: 10px;
  top: 10px;
  font-size: 10px;
}
.active-font {
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
