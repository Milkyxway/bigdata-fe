const taskStatusMap = {
  0: '已创建',
  1: '执行中',
  2: '完结归档',
  3: '中止',
  4: '执行错误'
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
  },
  {
    label: '执行错误',
    value: 4
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
]

const stands = [
  {
    value: 18,
    label: '安镇广电站'
  },
  {
    value: 19,
    label: '东亭广电站'
  },
  {
    value: 20,
    label: '东北塘广电站'
  },
  {
    value: 21,
    label: '羊尖广电站'
  },
  {
    value: 22,
    label: '锡北广电站'
  },
  {
    value: 23,
    label: '东港广电站'
  },
  {
    value: 24,
    label: '钱桥阳山广电站'
  },
  {
    value: 25,
    label: '洛社广电站'
  },
  {
    value: 26,
    label: '堰桥长安广电站'
  },
  {
    value: 27,
    label: '前洲玉祁长安广电站'
  },
  {
    value: 28,
    label: '山北黄巷广电站'
  },
  {
    value: 29,
    label: '太湖滨湖黄巷广电站'
  },
  {
    value: 30,
    label: '华庄广电站'
  },
  {
    value: 31,
    label: '马山广电站'
  },
  {
    value: 32,
    label: '胡埭广电站'
  },
  {
    value: 33,
    label: '河埒广电站'
  },
  {
    value: 34,
    label: '蠡园广电站'
  },
  {
    value: 35,
    label: '鸿山梅村广电站'
  },
  {
    value: 36,
    label: '硕放西南广电站'
  },
  {
    value: 37,
    label: '鹅湖广电站'
  },
  {
    value: 38,
    label: '旺庄广电站'
  },
  {
    value: 39,
    label: '江溪广益扬名广电站'
  },
  {
    value: 40,
    label: '湖滨广电站'
  },
  {
    value: 41,
    label: '崇安广电站'
  },
  {
    value: 42,
    label: '盛岸广电站'
  },
  {
    value: 43,
    label: '长江路广电站'
  },
  {
    value: 44,
    label: '中桥广电站'
  },
  {
    value: 45,
    label: '北塘广电站'
  }
]
const standMap = {
  18: '安镇广电站',
  19: '东亭广电站',
  20: '东北塘广电站',
  21: '羊尖广电站',
  22: '锡北广电站',
  23: '东港广电站',
  24: '钱桥阳山广电站',
  25: '洛社广电站',
  26: '堰桥长安广电站',
  27: '前洲玉祁长安广电站',
  28: '玉祁广电站',
  29: '长安广电站',
  30: '山北黄巷广电站',
  31: '太湖广电站',
  32: '滨湖广电站',
  33: '黄巷广电站',
  34: '华庄广电站',
  35: '马山广电站',
  36: '胡埭广电站',
  37: '河埒广电站',
  38: '蠡园广电站',
  39: '鸿山广电站',
  40: '梅村广电站',
  41: '硕放广电站',
  42: '鹅湖广电站',
  43: '旺庄广电站',
  44: '广益广电站',
  45: '扬名广电站',
  46: '湖滨广电站',
  47: '崇安广电站',
  48: '盛岸广电站',
  49: '长江路广电站',
  50: '中桥广电站',
  51: '北塘广电站'
}

const orgnizationTree_jy = [
  {
    label: '党群工作部',
    value: 12
  },
  {
    label: '公众客户部',
    value: 13
  },
  {
    label: '政企客户部',
    value: 14
  },
  {
    label: '综合管理部',
    value: 15
  },
  {
    label: '安播运维部',
    value: 16
  },
  {
    label: '技术工程部',
    value: 17
  }
]

const orgnizationTree_yx = [
  {
    label: '综合管理部',
    value: 18
  },
  {
    label: '公众客户部',
    value: 19
  },
  {
    label: '政企客户部',
    value: 20
  },
  {
    label: '技术工程部',
    value: 21
  },
  {
    label: '安播运维部',
    value: 22
  },
  {
    label: '党群工作部',
    value: 23
  },
  {
    label: '企业发展科',
    value: 24
  },
  {
    label: '人力资源科',
    value: 25
  },
  {
    label: '工会',
    value: 26
  }
]

const orgMap = {
  1: '综合管理部',
  2: '党群工作部',
  3: '人力资源部',
  4: '财务资产部',
  5: '企业发展部',
  6: '市场运营部',
  7: '政企客户部',
  8: '公众客户部',
  9: '技术支撑部',
  10: '工程建设部',
  11: '安播运维部',
  12: '党群工作部',
  13: '公众客户部',
  14: '政企客户部',
  15: '综合管理部',
  16: '安播运维部',
  17: '技术工程部',
  18: '综合管理部',
  19: '公众客户部',
  20: '政企客户部',
  21: '技术工程部',
  22: '安播运维部',
  23: '党群工作部',
  24: '企业发展科',
  25: '人力资源科',
  26: '工会'
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

const sqlType = {
  1: '执行类无输出',
  2: '上传',
  3: '查询类有输出'
}

const priorityMap = {
  99: '高',
  50: '中',
  1: '低'
}
const priorityMapNum = {
  高: ' 99',
  中: ' 50',
  低: '1'
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
const roleList = [
  {
    label: '管理员',
    value: 'admin'
  },
  {
    label: '领导',
    value: 'leader'
  },
  {
    label: '部门',
    value: 'section'
  },
  {
    label: '员工',
    value: 'employee'
  },
  {
    label: '开发者',
    value: 'developer'
  }
]

const regions = [
  {
    label: '无锡分公司',
    value: 'wx',
    name: '无锡分公司'
  },
  {
    label: '江阴分公司',
    value: 'jy',
    name: '江阴分公司'
  },
  {
    label: '宜兴分公司',
    value: 'yx',
    name: '宜兴分公司'
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
  orgMap,
  statusWeight,
  periodTypeMap,
  periodType,
  priority,
  priorityMap,
  priorityMapNum,
  weekMap,
  week,
  sqlType,
  roleList,
  stands,
  standMap,
  regions,
  orgnizationTree_jy,
  orgnizationTree_yx
}
