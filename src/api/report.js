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
    url: '/api/commonsql/list',
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
 * 删除文件
 * @param {*} data
 * @returns
 */
export const deleteFileReq = (data) => {
  return createRequest()({
    url: '/api/report/deletefile',
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
    url: '/api/commonsql/delete',
    method: 'delete',
    data
  })
}

/**
 * 修改常用sql
 * @param {*} data
 * @returns
 */
export const updateCommonSqlReq = (data) => {
  return createRequest()({
    url: '/api/commonsql/update',
    method: 'post',
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
 * 删除任务类型
 * @param {*} data
 * @returns
 */
export const deleteTaskTypeReq = (data) => {
  return createRequest()({
    url: '/api/report/deletetype',
    method: 'post',
    data
  })
}

/**
 * 修改任务类型
 * @param {*} data
 * @returns
 */
export const updateTaskTypeReq = (data) => {
  return createRequest()({
    url: '/api/report/updatetype',
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
 * 修改任务sql语句
 * @param {*} data
 * @returns
 */
export const updateSqlReq = (data) => {
  return createRequest()({
    url: '/api/report/updatesql',
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

/**
 * 修改任务
 * @param {*} data
 * @returns
 */
export const updateTaskReq = (data) => {
  return createRequest()({
    url: '/api/report/update',
    method: 'post',
    data
  })
}

/**
 * 获取任务的sql语句
 * @param {*} data
 * @returns
 */
export const getTaskSqlsReq = (data) => {
  return createRequest()({
    url: '/api/report/tasksqls',
    method: 'post',
    data
  })
}

/**
 * 删除任务
 * @param {*} data
 * @returns
 */
export const deleteTaskReq = (data) => {
  return createRequest()({
    url: '/api/report/deletetask',
    method: 'delete',
    data
  })
}

/**
 *  增加常用脚本
 * @param {*} data
 * @returns
 */
export const addCommonUseSqlAddReq = (data) => {
  return createRequest()({
    url: '/api/commonsql/add',
    method: 'post',
    data
  })
}

/**
 * 参数类型列表
 * @param {*} data
 * @returns
 */
export const getParamsListReq = (data) => {
  return createRequest()({
    url: '/api/report/paramslist',
    method: 'post',
    data
  })
}

/**
 * 增加sql参数类型
 * @param {*} data
 * @returns
 */
export const addParamsReq = (data) => {
  return createRequest()({
    url: '/api/report/addparams',
    method: 'post',
    data
  })
}

/**
 * 删除任务的一条sql语句
 * @param {*} data
 * @returns
 */
export const deleteTaskSqlReq = (data) => {
  return createRequest()({
    url: '/api/report/deletesql',
    method: 'post',
    data
  })
}

/**
 * 批量插入sql
 */
export const addSqlBatchReq = (data) => {
  return createRequest()({
    url: '/api/report/addsqlbatch',
    method: 'post',
    data
  })
}

/**
 * 获取任务执行排序情况
 * @param {*} data
 * @returns
 */
export const getTaskSortReq = (data) => {
  return createRequest()({
    url: '/api/report/tasksort',
    method: 'post',
    data
  })
}
