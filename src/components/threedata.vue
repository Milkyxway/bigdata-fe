<template>
  <div class="grid">
    <div class="grid-item">
      <div class="commob-title">缴费客户数</div>
      <div class="total-amount">3690000</div>
    </div>
    <div class="grid-item">
      <div class="commob-title">数字电视保有率</div>
      <div class="total-amount">90.5%</div>
      <!-- <processchart :data="state.statusRate.finishRate" type="已完成" /> -->
    </div>
    <div class="grid-item">
      <div class="commob-title">有价宽带终端数</div>
      <div class="total-amount">3690000</div>
    </div>
    <div class="grid-item">
      <div class="commob-title">上月收现总额</div>
      <div class="total-amount">2345566778</div>
      <!-- <processchart :data="state.statusRate.processRate" type="进行中" /> -->
    </div>
  </div>
</template>
<style scoped>
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
  /* color: #fff; */
}
</style>
