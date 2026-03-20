<template>
  <div class="grid">
    <div class="grid-item">
      <div class="commob-title">
        缴费客户数<el-icon v-if="props.data.liushi > 0" color="#FF6347"><Top /></el-icon
        ><el-icon v-if="props.data.liushi < 0" color="#90EE90"><Bottom /></el-icon>
        <span
          :style="{ color: props.data.liushi > 0 ? '#FF6347' : '#90ee90' }"
          v-if="props.data.liushi"
          >{{ props.data.liushi * 100 }} %</span
        >
      </div>
      <div class="total-amount">{{ props.data.jfUser }}</div>
    </div>

    <div class="grid-item">
      <div class="commob-title">
        有价宽带终端数<el-icon v-if="props.data.yjkdliushi > 0" color="#FF6347"><Top /></el-icon
        ><el-icon v-if="props.data.yjkdliushi < 0" color="#90EE90"><Bottom /></el-icon>
        <span
          :style="{ color: props.data.yjkdliushi > 0 ? '#FF6347' : '#90ee90' }"
          v-if="props.data.yjkdliushi"
          >{{ props.data.yjkdliushi * 100 }} %</span
        >
      </div>
      <div class="total-amount">{{ props.data.yjkd }}</div>
    </div>
    <div class="grid-item">
      <div class="commob-title">上月收现总额</div>
      <div class="total-amount">
        {{ props.data.shouxian }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, reactive, watch } from 'vue'
const props = defineProps({
  data: {
    type: Object
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
