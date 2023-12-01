export const formatLink = (fileName, path) =>
  fileName ? `http://172.16.179.2:7002/public/${path}/${fileName}` : null

export const downloadUrl = (url) => {
  window.location.href = url
}
