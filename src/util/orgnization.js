import { orgnizationTree } from '../constant/index'
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
