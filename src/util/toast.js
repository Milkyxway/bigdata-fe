import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'

export const toast = (message = '操作成功！', type = 'success') => {
  ElMessage({
    message,
    type
  })
}

export const ElMessageBoxFn = (content, confirmCb, cancelCb, title = '警告', type = 'warning') => {
  ElMessageBox.confirm(content, title, {
    type,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    callback: (action) => {
      if (action === 'confirm') {
        confirmCb()
      } else {
        cancelCb && cancelCb()
      }
    }
  })
}
