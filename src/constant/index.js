const taskStatusMap = {
  0: '已创建',
  1: '执行中',
  2: '完结归档',
  3: '中止'
}

const taskStatusList = [
  {
    label: '已创建',
    value: 0
  },
  {
    label: '执行中',
    value: 1
  },
  {
    label: '完结归档',
    value: 2
  },
  {
    label: '中止',
    value: 3
  }
]

// 状态权重
const statusWeight = {
  1: 5, // 待确认权重5
  2: 4, // 待调整
  3: 3, // 进行中
  4: 7, // 已完成
  5: 1, // 已延期
  6: 6, // 已提交
  7: 2, // 延期后再进行
  8: 8 // 已取消
}

const orgnizationTree = [
  {
    value: 1,
    label: '综合管理部'
  },
  {
    value: 2,
    label: '党群工作部'
  },
  {
    value: 3,
    label: '人力资源部'
  },
  {
    value: 4,
    label: '财务资产部'
  },
  {
    value: 5,
    label: '企业发展部'
  },
  {
    value: 6,
    label: '市场运营部'
  },
  {
    value: 7,
    label: '政企客户部'
  },
  {
    value: 8,
    label: '公众客户部'
  },
  {
    value: 9,
    label: '技术支撑部'
  },
  {
    value: 10,
    label: '工程建设部'
  },
  {
    value: 11,
    label: '安播运维部'
  }
  // {
  //   value: 12,
  //   label: '锡山广电中心'
  // },
  // {
  //   value: 13,
  //   label: '惠山广电中心'
  // },
  // {
  //   value: 14,
  //   label: '滨湖广电中心'
  // },
  // {
  //   value: 15,
  //   label: '经开广电中心'
  // },
  // {
  //   value: 16,
  //   label: '新吴广电中心'
  // },
  // {
  //   value: 17,
  //   label: '梁溪广电中心'
  // },
  // {
  //   value: 18,
  //   label: '安镇广电网络管理站'
  // },
  // {
  //   value: 19,
  //   label: '东亭广电网络管理站'
  // },
  // {
  //   value: 20,
  //   label: '东北塘广电网络管理站'
  // },
  // {
  //   value: 21,
  //   label: '羊尖广电网络管理站'
  // },
  // {
  //   value: 22,
  //   label: '锡北广电网络管理站'
  // },
  // {
  //   value: 23,
  //   label: '东港广电网络管理站'
  // },
  // {
  //   value: 24,
  //   label: '钱桥阳山广电网络管理站'
  // },
  // {
  //   value: 25,
  //   label: '洛社广电网络管理站'
  // },
  // {
  //   value: 26,
  //   label: '堰桥长安广电网络管理站'
  // },
  // {
  //   value: 27,
  //   label: '前洲玉祁长安广电网络管理站'
  // },
  // {
  //   value: 28,
  //   label: '山北黄巷广电网络管理站'
  // },
  // {
  //   value: 29,
  //   label: '太湖滨湖黄巷广电网络管理站'
  // },
  // {
  //   value: 30,
  //   label: '华庄广电网络管理站'
  // },
  // {
  //   value: 31,
  //   label: '马山广电网络管理站'
  // },
  // {
  //   value: 32,
  //   label: '胡埭广电网络管理站'
  // },
  // {
  //   value: 33,
  //   label: '河埒广电网络管理站'
  // },
  // {
  //   value: 34,
  //   label: '蠡园广电网络管理站'
  // },
  // {
  //   value: 35,
  //   label: '鸿山梅村广电网络管理站'
  // },
  // {
  //   value: 36,
  //   label: '硕放西南广电网络管理站'
  // },
  // {
  //   value: 37,
  //   label: '鹅湖广电网络管理站'
  // },
  // {
  //   value: 38,
  //   label: '旺庄广电网络管理站'
  // },
  // {
  //   value: 39,
  //   label: '江溪广益扬名广电网络管理站'
  // },
  // {
  //   value: 40,
  //   label: '湖滨广电网络管理站'
  // },
  // {
  //   value: 41,
  //   label: '崇安广电网络管理站'
  // },
  // {
  //   value: 42,
  //   label: '盛岸广电网络管理站'
  // },
  // {
  //   value: 43,
  //   label: '长江路广电网络管理站'
  // },
  // {
  //   value: 44,
  //   label: '中桥广电网络管理站'
  // },
  // {
  //   value: 45,
  //   label: '北塘广电网络管理站'
  // }
]

const periodType = [
  {
    label: '日报',
    value: 1
  },
  {
    label: '周报',
    value: 2
  },
  {
    label: '月报',
    value: 3
  },
  {
    label: '年报',
    value: 4
  }
]

const priority = [
  {
    label: '高',
    value: 99
  },
  {
    label: '中',
    value: 50
  },
  {
    label: '低',
    value: 1
  }
]

const priorityMap = {
  99: '高',
  50: '中',
  1: '低'
}
const periodTypeMap = {
  1: '日报',
  2: '周报',
  3: '月报',
  4: '年报'
}
const week = [
  {
    label: '周一',
    value: 'Monday'
  },
  {
    label: '周二',
    value: 'Tuesday'
  },
  {
    label: '周三',
    value: 'Wednesday'
  },
  {
    label: '周四',
    value: 'Thursday'
  },
  {
    label: '周五',
    value: 'Friday'
  },
  {
    label: '周六',
    value: 'Saturday'
  },
  {
    label: '周日',
    value: 'Sunday'
  }
]

const weekMap = {
  Monday: '周一',
  Tuesday: '周二',
  Wednesday: '周三',
  Thursday: '周四',
  Friday: '周五',
  Saturday: '周六',
  Sunday: '周日'
}
export {
  taskStatusMap,
  taskStatusList,
  orgnizationTree,
  statusWeight,
  periodTypeMap,
  periodType,
  priority,
  priorityMap,
  weekMap
}
