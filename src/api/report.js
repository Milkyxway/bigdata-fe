import { createRequest } from '../request'

// 查询任务列表
export const getReportListReq = (data) => {
  return createRequest()({
    url: '/api/report/list',
    method: 'post',
    data
  })
}
/**
 * 脚本列表
 * @param {*} data
 * @returns
 */
export const getSQLListReq = (data) => {
  return createRequest()({
    url: '/api/report/sqllist',
    method: 'post',
    data
  })
}

// export const downloadSqlReq = (data) => {
//   return createRequest()({
//     url: '/api/report/download',
//     method: 'post',
//     data
//   })
// }

export const uploadReq = (data) => {
  return createRequest()({
    url: '/api/report/upload',
    method: 'post',
    data
  })
}

/**
 * 删除脚本
 * @param {*} data
 * @returns
 */
export const deleteSqlReq = (data) => {
  return createRequest()({
    url: '/api/report/deletesql',
    method: 'delete',
    data
  })
}

/**
 * 创建任务
 * @param {*} data
 * @returns
 */
export const createTaskReq = (data) => {
  return createRequest()({
    url: '/api/report/createtask',
    method: 'post',
    data
  })
}

/**
 * 获取任务列表
 * @param {*} data
 * @returns
 */
export const getTaskListReq = (data) => {
  return createRequest()({
    url: '/api/report/tasklist',
    method: 'post',
    data
  })
}

/**
 * 创建任务类型
 * @param {*} data
 * @returns
 */
export const createTaskTypeReq = (data) => {
  return createRequest()({
    url: '/api/report/addtasktype',
    method: 'post',
    data
  })
}

/**
 * 增加sql语句
 * @param {*} data
 * @returns
 */
export const addSqlReq = (data) => {
  return createRequest()({
    url: '/api/report/addsql',
    method: 'post',
    data
  })
}

/**
 * 获取任务详情
 * @param {*} data
 * @returns
 */
export const getTaskDetailReq = (data) => {
  return createRequest()({
    url: '/api/report/detail',
    method: 'post',
    data
  })
}

/**
 * 获取报表类型
 * @param {*} data
 * @returns
 */
export const getReportTypeReq = (data) => {
  return createRequest()({
    url: '/api/report/type',
    method: 'post',
    data
  })
}
