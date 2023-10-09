const taskStatusMap = {
  0: '全部',
  1: '待确认',
  2: '待调整',
  3: '进行中',
  4: '已完成',
  5: '已延期',
  6: '已提交', // 部门完成所有的任务提交后状态
  7: '延期后再进行',
  8: '已取消'
}

const taskStatusList = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '待确认',
    value: 1
  },
  {
    label: '待调整',
    value: 2
  },
  {
    label: '进行中',
    value: 3
  },
  {
    label: '已完成',
    value: 4
  },
  {
    label: '已延期',
    value: 5
  },
  {
    label: '已提交',
    value: 6
  },
  {
    label: '延期后再进行',
    value: 7
  },
  {
    label: '已取消',
    value: 8
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

const taskCategory = [
  {
    label: '全部',
    value: 0
  },

  {
    label: '市场营销',
    value: 1
  },
  {
    label: '政企业务',
    value: 2
  },
  {
    label: '指标考核',
    value: 3
  },
  {
    label: '网络建设',
    value: 4
  },
  {
    label: '公众客户',
    value: 5
  },
  {
    label: '后勤保障',
    value: 6
  },
  {
    label: '器材保障',
    value: 7
  },
  {
    label: '技术支撑',
    value: 8
  },
  {
    label: '组织人事',
    value: 9
  },
  {
    label: '制度管理',
    value: 10
  },
  {
    label: '财务资产',
    value: 11
  }
]

const taskCategoryMap = {
  1: '市场营销',
  2: '政企业务',
  3: '指标考核',
  4: '网络建设',
  5: '公众客户',
  6: '后勤保障',
  7: '器材保障',
  8: '技术支撑',
  9: '组织人事',
  10: '制度管理',
  11: '财务资产'
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

const appealCategory = [
  {
    label: '任务表述调整',
    value: 1
  },
  {
    label: '非问题仅需解释',
    value: 2
  },
  {
    label: '暂时无法解决，需持续跟进',
    value: 3
  },
  {
    label: '已完成',
    value: 4
  }
]

const taskOrigin = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '专项调研',
    value: 1
  },
  {
    label: '公司重点工作',
    value: 2
  },
  {
    label: '安全检查整改',
    value: 3
  },
  {
    label: '审计整改',
    value: 4
  },
  {
    label: '党委巡察整改',
    value: 5
  }
]
const taskSourceMap = {
  1: '专项调研',
  2: '公司重点工作',
  3: '安全检查整改',
  4: '审计整改',
  5: '党委巡察整改'
}

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
const periodTypeMap = {
  1: '日报',
  2: '周报',
  3: '月报',
  4: '年报'
}

export {
  taskStatusMap,
  taskStatusList,
  taskCategory,
  taskCategoryMap,
  orgnizationTree,
  appealCategory,
  taskOrigin,
  taskSourceMap,
  statusWeight,
  periodTypeMap,
  periodType,
  priority
}
