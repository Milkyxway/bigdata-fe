<template>
  <div class="grid">
    <div class="grid-item">
      <div class="commob-title">
        <el-tooltip content="截止昨天的数字电视缴费客户数与25年年末相比增长率" placement="top">
          <div>
            电视客户数<el-icon v-if="props.data.liushi > 0" color="#FF6347"><Top /></el-icon
            ><el-icon v-if="props.data.liushi < 0" color="#90EE90"><Bottom /></el-icon>
            <span
              :style="{ color: props.data.liushi > 0 ? '#FF6347' : '#90ee90', fontSize: '14px' }"
              v-if="props.data.liushi"
              >{{ (props.data.liushi * 100).toFixed(2) }} %</span
            >
          </div>
        </el-tooltip>
      </div>
      <div class="total-amount">{{ props.data.jfUser }}</div>
    </div>
    <div class="grid-item">
      <div class="commob-title">
        <el-tooltip content="截止昨天的单宽带电视缴费客户数与25年年末相比增长率" placement="top">
          <div>
            单宽带客户数<el-icon v-if="props.data.liushi > 0" color="#FF6347"><Top /></el-icon
            ><el-icon v-if="props.data.liushi < 0" color="#90EE90"><Bottom /></el-icon>
            <span
              :style="{ color: props.data.liushi > 0 ? '#FF6347' : '#90ee90', fontSize: '14px' }"
              v-if="props.data.liushi"
              >{{ (props.data.liushi * 100).toFixed(2) }} %</span
            >
          </div>
        </el-tooltip>
      </div>
      <div class="total-amount">{{ props.data.jfUser }}</div>
    </div>

    <div class="grid-item">
      <div class="commob-title">
        有价宽带终端数<el-icon v-if="props.data.yjkdliushi > 0" color="#FF6347"><Top /></el-icon
        ><el-icon v-if="props.data.yjkdliushi < 0" color="#90EE90"><Bottom /></el-icon>
        <span
          :style="{ color: props.data.yjkdliushi > 0 ? '#FF6347' : '#90ee90', fontSize: '14px' }"
          v-if="props.data.yjkdliushi"
          >{{ (props.data.yjkdliushi * 100).toFixed(2) }} %</span
        >
      </div>
      <div class="total-amount">{{ props.data.yjkd }}</div>
    </div>
    <div class="grid-item">
      <div class="commob-title">
        <el-tooltip content="2026年以来的现金帐本收现总额与2025年同期相比增长率" placement="top">
          <div>
            <span>收现总额</span
            ><el-icon v-if="props.data.shouxian_tb > 0" color="#FF6347" size="8"><Top /></el-icon
            ><el-icon v-if="props.data.shouxian_tb < 0" color="#90EE90"><Bottom /></el-icon>
            <span
              :style="{
                color: props.data.shouxian_tb > 0 ? '#FF6347' : '#90ee90',
                fontSize: '14px'
              }"
              v-if="props.data.shouxian_tb"
              >{{ (props.data.shouxian_tb * 100).toFixed(2) }} %</span
            >
          </div>
        </el-tooltip>
      </div>
      <div class="total-amount">
        {{ props.data.shouxian }}
      </div>
    </div>
    <div class="grid-item">
      <el-tooltip content="2026年以来移网开卡总数" placement="top">
        <div class="commob-title">移网开卡总数</div>
      </el-tooltip>
      <div class="total-amount">{{ props.data.amount_yw }}</div>
    </div>
    <div class="grid-item" @click="handleClick('5g')">
      <el-tooltip content="截止昨日移网卡活跃数与在网数比值" placement="top">
        <div class="commob-title">移网活跃率</div>
      </el-tooltip>
      <div class="total-amount">{{ (props.data.yw_hyl * 100).toFixed(2) }} %</div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, reactive, watch } from 'vue'
const props = defineProps({
  data: {
    type: Object
  },
  yw: {
    type: Array
  }
})
</script>
<style scoped>
.common-container {
  /* padding: 20px 0; */
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
  font-size: 16px;
  /* color: #fff; */
}
</style>
