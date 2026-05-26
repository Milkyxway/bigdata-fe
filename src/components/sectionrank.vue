<template>
  <div class="rank rank-title">
    <span class="rank-index">排名</span>
    <span class="rank-grid">站名</span>
    <span class="rank-index" v-if="props.columnName1"> {{ props.columnName1 }}</span>
    <span class="rank-index" v-if="props.columnName2"> {{ props.columnName2 }}</span>
    <span class="rank-index" v-if="props.columnName3"> {{ props.columnName3 }}</span>
    <span class="rank-index" v-if="props.columnName4"> {{ props.columnName4 }}</span>
    <span class="rank-index" v-if="props.columnName5"> {{ props.columnName5 }}</span>
    <span class="rank-index" v-if="props.columnName6"> {{ props.columnName6 }}</span>
    <span class="rank-index" v-if="props.columnName7"> {{ props.columnName7 }}</span>
  </div>
  <div
    v-for="(item, index) in props.sectionTask"
    v-bind:key="index"
    :class="getStyleByIndex(index)"
  >
    <span class="rank-index">{{ index + 1 }}</span>
    <span class="rank-grid">{{ item.districtName }}</span>
    <span class="rank-index">{{ item.itvNum }}</span>
    <span class="rank-index">{{ item.itvNum_ly }}</span>
    <span class="rank-index" v-if="item.itvRate">{{ (item.itvRate * 100).toFixed(2) }}%</span>
    <span class="rank-index" v-if="item.hyl">{{ item.hyl }}%</span>
    <span class="rank-index" v-if="item.itvIncrease">{{ item.itvIncrease }}</span>
    <span class="rank-index" v-if="item.default1">{{ item.default1 }}</span>
    <span class="rank-index" v-if="item.default2">{{ item.default2 }}</span>
    <span class="rank-index" v-if="item.default3">{{ item.default3 }}</span>
  </div>
  <div @click="handleClick" class="expand" v-if="props.expandTxt">
    <el-icon v-if="props.expandTxt === '展开'"><ArrowDown /></el-icon>
    <el-icon v-if="props.expandTxt === '收起'"><ArrowUp /></el-icon>
    {{ props.expandTxt }}
  </div>
</template>
<script setup>
import { computed, reactive } from 'vue'
const props = defineProps({
  sectionTask: {
    type: Array
  },
  sectionList: {
    type: Array
  },
  expandTxt: {
    type: String
  },
  columnName1: {
    type: String
  },
  columnName2: {
    type: String
  },
  columnName3: {
    type: String
  },
  columnName4: {
    type: String
  },
  columnName5: {
    type: String
  },
  columnName6: {
    type: String
  },
  columnName7: {
    type: String
  }
})

const emits = defineEmits(['handleExpand'])
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

const handleClick = () => {
  emits('handleExpand', props.expandTxt)
}
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
  width: 20%;
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
.expand {
  font-size: 10px;
  text-align: center;
  width: 100%;
}
</style>
