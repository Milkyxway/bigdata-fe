import { orgnizationTree, orgnizationTree_jy, orgnizationTree_yx } from '../constant/index'
import { getLocalStore } from './localStorage'
export const orgnizationToName = (id) => {
  if (!id) return ''
  const orgId = Number(id)
  return orgnizationTree.filter((i) => i.value === orgId)[0].label
}

/**
 * 组织id字符串-->组织name字符串
 * @param {*} str
 * @returns
 */
export const orgnizationListIdToName = (str) => {
  if (str == '' || !str) {
    return ''
  }
  const listOrg = str.split(',')
  return listOrg
    .map((i) => {
      return orgnizationTree.filter((treeItem) => treeItem.value == i)[0].label
    })
    .join('、')
}

export const getOrgTreeByRegion = () => {
  const region = getLocalStore('userInfo').region
  let org
  switch (region) {
    case 'wx':
      org = orgnizationTree
      break
    case 'jy':
      org = orgnizationTree_jy
      break
    case 'yx':
      org = orgnizationTree_yx
      break
    default:
      break
  }
  return org
}
