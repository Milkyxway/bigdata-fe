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
