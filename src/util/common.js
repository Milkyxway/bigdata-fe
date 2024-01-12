import { copyText } from 'vue3-clipboard'
import { toast } from './toast'

export const copyContent = (content) => {
  copyText(content, undefined, (error, event) => {
    if (error) {
      toast('复制失败！', 'error')
      console.log(error)
    } else {
      toast('复制成功！')
      console.log(event)
    }
  })
}

export const getResultTxt = (row) => {
  if (row.isChild && row.LargeCategory === '周期性' && row.excelData) {
    return `结果excel(生成日期${row.excelData[0].substr(36, 8)})`
  }
  if (row.LargeCategory === '一次性' && row.excelData) {
    return '结果excel'
  }
}
