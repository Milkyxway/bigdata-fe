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

    <div class="data-part">
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
const state = reactive({
  init: true,
  view: '广电站',
  expandTxt: '展开',
  hlwTotal: 0,
  sectionTask: [
    {
      districtName: '安镇广电站',
      itvNum: 12795,
      itvRate: 0.89
    },
    {
      districtName: '北塘广电站',
      itvNum: 13512,
      itvRate: 0.89
    },
    {
      districtName: '滨湖广电站',
      itvNum: 5085,
      itvRate: 0.89
    },
    {
      districtName: '长安广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '长江路广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '城区',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '崇安广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '东北塘广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '东港广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '东亭广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '鹅湖广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '坊前广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '广益广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '河埒广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '鸿山广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '胡埭广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '湖滨广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '黄巷广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '华庄广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '洛社广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '马山广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '梅村广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '南站广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '钱桥广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '前洲广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '山北广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '盛岸广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '硕放广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '太湖广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '锡北广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '新安广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '堰桥广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '扬名广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '羊尖广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '阳山广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '玉祁广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '中桥广电站',
      itvNum: 12,
      itvRate: 0.89
    },
    {
      districtName: '蠡园广电站',
      itvNum: 12,
      itvRate: 0.89
    }
  ],
  xzAmt: [
    {
      districtName: '安镇广电站',
      amt: 26793
    },
    {
      districtName: '北塘广电站',
      amt: 11545
    },
    {
      districtName: '滨湖广电站',
      amt: 19585
    },
    {
      districtName: '长安广电站',
      amt: 13604
    },
    {
      districtName: '长江路广电站',
      amt: 13682
    },
    {
      districtName: '城区',
      amt: 17304
    },
    {
      districtName: '崇安广电站',
      amt: 12567
    },
    {
      districtName: '东北塘广电站',
      amt: 14689
    },
    {
      districtName: '东港广电站',
      amt: 34351
    },
    {
      districtName: '东亭广电站',
      amt: 14123
    },
    {
      districtName: '鹅湖广电站',
      amt: 20912
    },
    {
      districtName: '坊前广电站',
      amt: 18620
    },
    {
      districtName: '广益广电站',
      amt: 27394
    },
    {
      districtName: '河埒广电站',
      amt: 20774
    },
    {
      districtName: '鸿山广电站',
      amt: 11163
    },
    {
      districtName: '胡埭广电站',
      amt: 19499
    },
    {
      districtName: '湖滨广电站',
      amt: 25871
    },
    {
      districtName: '黄巷广电站',
      amt: 28257
    },
    {
      districtName: '华庄广电站',
      amt: 16845
    },
    {
      districtName: '洛社广电站',
      amt: 20882
    },
    {
      districtName: '马山广电站',
      amt: 17085
    },
    {
      districtName: '梅村广电站',
      amt: 18670
    },
    {
      districtName: '南站广电站',
      amt: 19785
    },
    {
      districtName: '钱桥广电站',
      amt: 12676
    },
    {
      districtName: '前洲广电站',
      amt: 16411
    },
    {
      districtName: '山北广电站',
      amt: 22833
    },
    {
      districtName: '盛岸广电站',
      amt: 19500
    },
    {
      districtName: '硕放广电站',
      amt: 15363
    },
    {
      districtName: '太湖广电站',
      amt: 25039
    },
    {
      districtName: '锡北广电站',
      amt: 11280
    },
    {
      districtName: '新安广电站',
      amt: 21476
    },
    {
      districtName: '堰桥广电站',
      amt: 18157
    },
    {
      districtName: '扬名广电站',
      amt: 11433
    },
    {
      districtName: '羊尖广电站',
      amt: 15448
    },
    {
      districtName: '阳山广电站',
      amt: 12321
    },
    {
      districtName: '玉祁广电站',
      amt: 21603
    },
    {
      districtName: '中桥广电站',
      amt: 23997
    },
    {
      districtName: '蠡园广电站',
      amt: 21831
    }
  ],
  xzAmt_lastmonth: [
    {
      districtName: '安镇广电站',
      amt: 10418
    },
    {
      districtName: '北塘广电站',
      amt: 19597
    },
    {
      districtName: '滨湖广电站',
      amt: 26289
    },
    {
      districtName: '长安广电站',
      amt: 14806
    },
    {
      districtName: '长江路广电站',
      amt: 15828
    },
    {
      districtName: '城区',
      amt: 2618
    },
    {
      districtName: '崇安广电站',
      amt: 16065
    },
    {
      districtName: '东北塘广电站',
      amt: 21812
    },
    {
      districtName: '东港广电站',
      amt: 29924
    },
    {
      districtName: '东亭广电站',
      amt: 28551
    },
    {
      districtName: '鹅湖广电站',
      amt: 28725
    },
    {
      districtName: '坊前广电站',
      amt: 27630
    },
    {
      districtName: '广益广电站',
      amt: 28250
    },
    {
      districtName: '河埒广电站',
      amt: 29862
    },
    {
      districtName: '鸿山广电站',
      amt: 28280
    },
    {
      districtName: '胡埭广电站',
      amt: 23577
    },
    {
      districtName: '湖滨广电站',
      amt: 12521
    },
    {
      districtName: '黄巷广电站',
      amt: 22446
    },
    {
      districtName: '华庄广电站',
      amt: 26610
    },
    {
      districtName: '洛社广电站',
      amt: 14804
    },
    {
      districtName: '马山广电站',
      amt: 29694
    },
    {
      districtName: '梅村广电站',
      amt: 12270
    },
    {
      districtName: '南站广电站',
      amt: 19669
    },
    {
      districtName: '钱桥广电站',
      amt: 24467
    },
    {
      districtName: '前洲广电站',
      amt: 20413
    },
    {
      districtName: '山北广电站',
      amt: 29916
    },
    {
      districtName: '盛岸广电站',
      amt: 13512
    },
    {
      districtName: '硕放广电站',
      amt: 16986
    },
    {
      districtName: '太湖广电站',
      amt: 28786
    },
    {
      districtName: '锡北广电站',
      amt: 17759
    },
    {
      districtName: '新安广电站',
      amt: 26671
    },
    {
      districtName: '堰桥广电站',
      amt: 12615
    },
    {
      districtName: '扬名广电站',
      amt: 25326
    },
    {
      districtName: '羊尖广电站',
      amt: 28404
    },
    {
      districtName: '阳山广电站',
      amt: 10631
    },
    {
      districtName: '玉祁广电站',
      amt: 18843
    },
    {
      districtName: '中桥广电站',
      amt: 20419
    },
    {
      districtName: '蠡园广电站',
      amt: 24091
    }
  ],
  newCust: [
    {
      districtName: '安镇广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '北塘广电站',
      tvCust: 10,
      lanCust: 15,
      mobileCust: 11
    },
    {
      districtName: '滨湖广电站',
      tvCust: 12,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '长安广电站',
      tvCust: 30,
      lanCust: 54,
      mobileCust: 3
    },
    {
      districtName: '长江路广电站',
      tvCust: 20,
      lanCust: 78,
      mobileCust: 5
    },
    {
      districtName: '城区',
      tvCust: 3,
      lanCust: 89,
      mobileCust: 11
    },
    {
      districtName: '崇安广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '东北塘广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '东港广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '东亭广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '鹅湖广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '坊前广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '广益广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '河埒广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '鸿山广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '胡埭广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '湖滨广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '黄巷广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '华庄广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '洛社广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '马山广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '梅村广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '南站广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '钱桥广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '前洲广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '山北广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '盛岸广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '硕放广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '太湖广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '锡北广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '新安广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '堰桥广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '扬名广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '羊尖广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '阳山广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '玉祁广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '中桥广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    },
    {
      districtName: '蠡园广电站',
      tvCust: 121,
      lanCust: 122,
      mobileCust: 123
    }
  ],
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
  console.log(txt)
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
const init = () => {
  state.sectionTaskCp = state.sectionTask
  state.sectionTask = state.sectionTask.slice(0, 17)
  state.hlwTotal = sumHlw()
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
