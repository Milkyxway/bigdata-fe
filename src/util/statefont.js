export const getColorByState = (state) => {
  let fontClass
  switch (state) {
    case '已创建':
      fontClass = 'font-grey'
      break
    case '执行中':
      fontClass = 'font-yellow'
      break
    case '完结归档':
      fontClass = 'font-green'
      break
    case '中止':
      fontClass = 'font-ref'
      break
    case '执行错误':
      fontClass = 'font-red'
      break
    default:
      break
  }
  return fontClass
}
