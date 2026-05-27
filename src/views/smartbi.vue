<template>
  <div class="chart-page">
    <div class="top-content">
      <div class="left">
        <el-date-picker v-model="state.pickdate" @change="handleDateChange"></el-date-picker>
        <el-dropdown type="primary" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            选择业务
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="dtv">数字电视业务</el-dropdown-item>
              <el-dropdown-item command="lan">宽带业务</el-dropdown-item>
              <el-dropdown-item command="5g">5g业务</el-dropdown-item>
              <el-dropdown-item command="all">全部</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="title">无锡分公司数据智看</div>
      <div class="right">
        数据更新时间：{{ state.updateTime }}
        <span @click="exportExcel()"
          >一键导出<el-icon><Download /></el-icon
        ></span>
      </div>
      <el-tabs v-model="state.activeName" class="demo-tabs" @tab-click="handleClickTab">
        <el-tab-pane label="广电站" name="广电站">
          <div class="data-part" v-if="state.init">
            <div class="common-container">
              <div class="common-title">
                数据总览
                <el-switch v-model="state.switch" class="ml-2" />
              </div>
              <div class="common-container_1">
                <threedata :data="state.previewData" :yw="state.yw_hyl_fz"></threedata>
              </div>
              <div @click="showModal('xz')" style="width: 100%">
                <div class="common-title">各站月销账金额</div>
                <xzlinechart
                  :data="state.switch ? state.fzxData.xzAmt : state.xzAmt"
                  :data1="state.switch ? state.fzxData.xzAmt_lastmonth : state.xzAmt_lastmonth"
                ></xzlinechart>
              </div>
              <div @click="showModal('xz')" style="width: 100%">
                <div class="common-title">各站新发展客户数量</div>
                <newcustbarchart
                  :data="state.switch ? state.fzxData.newCust : state.newCust"
                ></newcustbarchart>
              </div>
            </div>
            <div class="common-container" style="width: 30%">
              <div class="common-title">各业务销账金额占比</div>
              <hlwpiechart :data="state.xzPropotion" :hlwTotal="state.hlwTotal"></hlwpiechart>
              <div class="common-title">各站电视缴费拍照客户留存率排名</div>
              <sectionrank
                :sectionTask="state.switch ? state.fzxData.sectionTask : state.sectionTask"
                :sectionList="sectionList"
                @handleExpand="handleExpand"
                :expandTxt="!state.switch && state.expandTxt"
                columnName1="当前缴费"
                columnName2="去年末缴费"
                columnName3="保有率"
                columnName4="净增长"
              ></sectionrank>
            </div>
          </div>
          <div v-if="state.showType === 'dtv'">
            <dtvview
              :data="{
                sectionTask: state.jfBaoyou,
                sectionList: state.sectionList,
                newCust: formatNewCust(state.newCust, 'tvCust')
              }"
            ></dtvview>
          </div>
          <div v-if="state.showType === 'lan'">
            <lanview
              :data="{
                newCust: formatNewCust(state.newCust, 'lanCust'),
                bnkd: formatNewCust(state.bnkd, 'lanCust')
              }"
            ></lanview>
          </div>
          <div v-if="state.showType === '5g'">
            <mobileview
              :data="{
                newCust: formatNewCust(state.newCust, 'mobileCust'),
                hyl: state.yw_hyl_fz
              }"
            ></mobileview>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分中心" name="广电中心"
          ><div class="data-part" v-if="state.initFzx">
            <div class="common-container">
              <el-radio-group
                v-model="state.chooseCenter"
                size="small"
                @change="handleChangeCenter"
              >
                <el-radio-button label="锡山" value="xishan" />
                <el-radio-button label="惠山" value="huishan" />
                <el-radio-button label="新吴" value="xinwu" />
                <el-radio-button label="梁溪" value="liangxi" />
                <el-radio-button label="滨湖" value="binhu" />
                <el-radio-button label="全部" value="allCenter" />
              </el-radio-group>
            </div></div
        ></el-tab-pane>
        <el-tab-pane label="发展人" name="发展人">发展人</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import dayjs from 'dayjs'
import sectionrank from '../components/sectionrank.vue'
import xzlinechart from '../components/xzlinechart.vue'
import newcustbarchart from '../components/newcustbarchart.vue'
import threedata from '../components/threedata.vue'
import hlwpiechart from '../components/hlwpiechart.vue'
import { getDailyReportReq } from '../api/report'
import { formatLink } from '../util/formatLink'
import lanview from '../components/lanview.vue'
import dtvview from '../components/dtvview.vue'
import mobileview from '../components/mobileview.vue'
import { regionToCenter } from '../constant'
const state = reactive({
  init: false,
  initFzx: false,
  activeName: '广电站',
  expandTxt: '展开',
  hlwTotal: 0,
  sectionTask: [],
  jfBaoyou: [],
  bnkd: [],
  xzAmt: [],
  xzAmt_lastmonth: [],
  newCust: [],
  xzPropotion: [],
  updateTime: '',
  switch: false,
  previewData: {
    jfUser: 0, //缴费客户
    liushi: 0, // 流失
    yjkd: 0, //有价宽带
    shouxian: 0, //收现
    yjkdliushi: 0, //有价宽带流失
    amount_yw: 0,
    yw_hyl: 0,
    shouxian_tb: 0
  },
  pickdate: '',
  fzxData: { xzAmt_lastmonth: [], newCust: [], xzAmt: [], sectionTask: [] },
  yw_hyl_fz: [],
  dailyReportFileName: '',
  showType: '',
  chooseCenter: '',
  centerNewCust: []
})
const showModal = () => {}

const handleCommand = (cmd) => {
  if (cmd !== 'all') {
    state.init = false
    state.showType = cmd
  } else {
    state.init = true
    state.showType = ''
  }
}
const handleExpand = (txt) => {
  state.sectionTask = txt === '展开' ? state.sectionTaskCp : state.sectionTask.slice(0, 17)
  state.expandTxt = txt === '展开' ? '收起' : '展开'
}

const handleChangeCenter = (val) => {
  state.centerNewCust = []
  state.chooseCenter = val
  state.fzxData.newCust = filterDataForRole(val, 'newCust')
  state.fzxData.xzAmt = filterDataForRole(val, 'xzAmt')
  state.fzxData.xzAmt_lastmonth = filterDataForRole(val, 'xzAmt_lastmonth')
  state.fzxData.sectionTask = filterDataForRole(val, 'jfBaoyou')
}

const exportExcel = () => {
  const url = formatLink(state.dailyReportFileName, 'out')
  window.location.href = url
}

const filterDataForRole = (val, type) => {
  const tmp = []
  regionToCenter[val].map((i) => {
    state[type].map((j) => {
      if (i.districtName === j.districtName) {
        tmp.push(j)
      }
    })
  })
  return tmp
}

const formatNewCust = (data, type) => {
  return data
    .map((i) => ({
      districtName: i.districtName,
      [type]: i[type]
    }))
    .sort((a, b) => b[type] - a[type])
}
const handleDateChange = async (date) => {
  const pickdate = dayjs(date).subtract(1, 'day').format('YYYYMMDD')
  getDailyReport(2189, pickdate)
}

const sumHlw = () => {
  let sum = 0
  state.xzPropotion.map((i) => {
    sum += i.amt
  })
  return sum
}

const getDailyReport = async (taskId, pickdate) => {
  const res = await getDailyReportReq({ taskId, pickdate })
  const {
    data: { jsonData, fileName }
  } = res
  state.sectionTask = jsonData['数字电视缴费保有率'].map((i) => {
    return {
      districtName: i.REGION_NAME2,
      itvNum: i['缴费客户数当前'],
      itvNum_ly: i['缴费客户数20251231'],
      itvRate: i['保有率'],
      itvIncrease: i['缴费客户数当前'] - i['缴费客户数20251231']
    }
  })
  state.bnkd = jsonData['包年宽带订购'].map((i) => {
    return {
      districtName: i.REGION_NAME,
      lanCust: i.CNT
    }
  })

  state.jfBaoyou = jsonData['数字电视大表18列保有'].map((i) => {
    return {
      districtName: i.REGION_NAME,
      itvNum: i['当前缴费客户'],
      itvNum_ly: i['去年年末'],
      itvRate: i['保有率'],
      itvIncrease: i['净增长']
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
    return { districtName: i.REGION_NAME2, amt: i['销账上月'] }
  })
  state.xzAmt_lastmonth = jsonData['各站销账两月对比'].map((i) => {
    return { districtName: i.REGION_NAME2, amt: i['销账上上月'] }
  })
  state.xzPropotion = jsonData['销账占比'].map((i) => {
    return i['业务类型']
      ? { name: i['业务类型'], amt: i['SUM(TOTAL_AMOUNT)/100'] }
      : {
          name: '未知',
          amt: i['SUM(TOTAL_AMOUNT)/100']
        }
  })
  state.yw_hyl_fz = jsonData['移网卡活跃率'].map((i) => {
    return {
      districtName: i.DEPARTMENT_NAME,
      itvNum: i['当前在网数'],
      itvNum_ly: i['去年年末在网数'],
      hyl: i['当前活跃率'],
      default1: i['当前活跃数'],
      default2: i['去年年末活跃数'],
      itvIncrease: i['当前在网数'] - i['去年年末在网数'],
      default3: i['当前活跃数'] - i['去年年末活跃数']
    }
  })

  state.hlwTotal = sumHlw()
  state.previewData = {
    jfUser: jsonData['总数'][0]['当前缴费客户'],
    liushi: jsonData['总数'][0]['增长率'],
    yjkd: jsonData['总数'][0]['有价宽带终端数'],
    shouxian: jsonData['总数'][0]['收现金额'],
    yjkdliushi: jsonData['总数'][0]['有价宽带增长率'],
    amount_yw: jsonData['总数'][0]['开卡数'],
    yw_hyl: jsonData['总数'][0]['移网活跃率'],
    shouxian_tb: jsonData['总数'][0]['收现同比增长']
  }
  state.updateTime = dayjs(fileName.substring(0, 8)).format('YYYY-MM-DD')
  state.sectionTaskCp = state.sectionTask
  state.sectionTask = state.sectionTask.slice(0, 17)
  state.dailyReportFileName = fileName
  state.init = true
}
const getDailyReportFzx = async (taskId, pickdate) => {
  const res = await getDailyReportReq({ taskId, pickdate })
  const {
    data: { jsonData, fileName }
  } = res
  state.fzxData.newCust = jsonData['各业务新发展'].map((i) => {
    return {
      districtName: i.FZX,
      tvCust: i.CNT,
      lanCust: i.CNT1,
      mobileCust: i.CNT2
    }
  })

  state.fzxData.xzAmt = jsonData['销账两月对比'].map((i) => {
    return { districtName: i.FZX, amt: i['销账上月'] }
  })
  state.fzxData.xzAmt_lastmonth = jsonData['销账两月对比'].map((i) => {
    return { districtName: i.FZX, amt: i['销账上上月'] }
  })
  state.fzxData.sectionTask = jsonData['数字电视保有率'].map((i) => {
    return {
      districtName: i.FZX,
      itvNum: i['当前'],
      itvNum_ly: i['去年年末'],
      itvRate: i['保有率'],
      itvIncrease: i['当前'] - i['去年年末']
    }
  })
  state.initFzx = true
}
const init = () => {
  getDailyReport(2189, null)
  getDailyReportFzx(2424, null)
}
init()
</script>
<style scoped>
.chart-page {
  width: 100%;
  min-height: 100vh;
  background: #0a1635;
  user-select: none;
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

.common-container {
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  opacity: 1;
  background: #121f44;
  margin-right: 10px;
  /* border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.18), inset 0px 0px 99px 0px rgba(255, 255, 255, 0.17);
  display: flex; */
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
:deep(.el-tabs__item.is-active) {
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
