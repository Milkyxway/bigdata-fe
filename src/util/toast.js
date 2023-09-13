import { ElMessage } from 'element-plus'

export const toast = (message = '操作成功！', type = 'success') => {
  ElMessage({
    message,
    type
  })
}
