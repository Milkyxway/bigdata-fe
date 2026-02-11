<template>
  <div class="chart-page" v-if="state.init">
    <div class="common-container">
      <div class="common-title">各站数字电视缴费保有率排名</div>
      <sectionrank :sectionTask="state.sectionTask" :sectionList="sectionList"></sectionrank>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import sectionrank from '../components/sectionrank.vue'
const state = reactive({
  init: true,
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
  ]
})
</script>
<style scoped>
.chart-page {
  width: 100%;
  min-height: 100vh;
  background: #0a1635;
  padding: 22px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1;
}
.common-border {
  background: #14234b;
  border: 2px rgba(255, 255, 255, 0.3);
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

.grid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.grid-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  height: 100px;
  font-size: 16px;
  color: #fff;
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
.title {
  width: 700px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.center-top {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-left: 65px;
}
</style>
