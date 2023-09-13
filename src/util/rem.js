// 根据屏幕大小动态设置rem的比例
const baseSize = 32
const setRootFontSize = () => {
  const scale = document.documentElement.clientWidth / 1920
  // 最大放大2倍
  let rootFontSize = baseSize * Math.min(scale, 2)
  // 最小缩放到20px，即0.625，对应宽度为1200px
  rootFontSize = baseSize * Math.max(scale, 0.625)
  document.documentElement.style.fontSize = rootFontSize + 'px'
}
setRootFontSize()
window.addEventListener('resize', setRootFontSize)
