<template>
  <div class="rank rank-title">
    <span class="rank-index">排名</span>
    <span class="rank-grid">站名</span>
    <span class="rank-index">缴费客户数</span>
    <span class="rank-index">保有率</span>
  </div>
  <div
    v-for="(item, index) in props.sectionTask"
    v-bind:key="index"
    :class="getStyleByIndex(index)"
  >
    <span class="rank-index">{{ index + 1 }}</span>
    <span class="rank-grid">{{ item.districtName }}</span>
    <span class="rank-index">{{ item.itvNum }}</span>
    <span class="rank-index">{{ item.itvRate }}</span>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  sectionTask: {
    type: Array
  },
  sectionList: {
    type: Array
  }
})
const getStyleByIndex = computed(() => {
  return function (index) {
    let className = 'rank'
    if (index === 0) {
      className += ` light-purple`
    } else if (index == 1) {
      className += ` dark-purple`
    } else if (index == 2) {
      className += ` dark-ble`
    }
    if (index % 2 === 0) {
      className += ` double-line`
    }
    return className
  }
})

const formatRate = computed(() => {
  return function (rate) {
    return `${(rate * 100).toFixed(2)}%`
  }
})
</script>
<style scoped>
.rank {
  width: 100%;
  padding: 0 10px;
  /* line-height: 2.1; */
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  font-size: 10px;
}
.rank-grid {
  display: inline-block;
  width: 34%;
}
.rank-index {
  display: inline-block;
  width: 22%;
}
.rank-title {
  color: #6ccee6;
  margin-bottom: 5px;
}
.light-purple {
  background-image: linear-gradient(90deg, #e23af5, transparent);
}
.dark-purple {
  background-image: linear-gradient(90deg, #8550f4, transparent);
}
.dark-ble {
  background-image: linear-gradient(90deg, #1d3fd6, transparent);
}
.double-line {
  background-color: #11204a;
}
</style>
