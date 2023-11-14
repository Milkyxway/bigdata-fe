import { createRequest } from '../request'

/**
 * 登录
 * @param {*} data
 * @returns
 */
export const loginReq = (data) => {
  return createRequest()({
    url: '/api/login',
    method: 'post',
    data
  })
}

/**
 * 登出
 * @param {*} data
 * @returns
 */
export const logoutReq = (data) => {
  return createRequest()({
    url: '/api/logout',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param {*} data
 * @returns
 */
export const modifyPwdReq = (data) => {
  return createRequest()({
    url: '/api/modifypwd',
    method: 'post',
    data
  })
}

/**
 * 创建账号
 * @param {*} data
 * @returns
 */
export const createAccountReq = (data) => {
  return createRequest()({
    url: '/api/createaccount',
    method: 'post',
    data
  })
}

/**
 * 获取用户列表
 * @param {*} data
 * @returns
 */
export const getUsersReq = (data) => {
  return createRequest()({
    url: '/api/userlist',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param {*} data
 * @returns
 */
export const deleteUserReq = (data) => {
  return createRequest()({
    url: '/api/userdelete',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 * @param {*} data
 * @returns
 */
export const updateUserReq = (data) => {
  return createRequest()({
    url: '/api/userupdate',
    method: 'post',
    data
  })
}
