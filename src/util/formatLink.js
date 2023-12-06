export const formatLink = (fileName, path) =>
  fileName ? `http://172.16.179.2:7002/public/${path}/${fileName}` : null

// export const downloadUrl = async (url, newName, path) => {
//   const splitURL = url.split('/')
//   const fileNameInDB = splitURL[splitURL.length - 1]
//   try {
//     if (path === 'log') {
//       window.location.href = url
//     } else {
//       await renameFileReq({ fileName: fileNameInDB, taskName: newName, path })
//       setTimeout(() => {
//         window.location.href = `http://172.16.179.2:7002/public/${path}/${newName}.xlsx`
//       }, 500)
//     }
//   } catch (e) {
//     window.location.href = url
//   }
// }
// export const downloadUrl = (url, filename) => {
//   getBlob(url, (blob) => {
//     saveAs(blob, filename)
//   })
// }

// const getBlob = (url, cb) => {
//   var xhr = new XMLHttpRequest()
//   xhr.open('GET', url, true)
//   xhr.responseType = 'blob'
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       cb(xhr.response)
//     }
//   }
//   xhr.send()
// }

// const saveAs = (blob, filename) => {
//   if (window.navigator.msSaveOrOpenBlob) {
//     navigator.msSaveBlob(blob, filename)
//   } else {
//     var link = document.createElement('a')
//     var body = document.querySelector('body')

//     link.href = window.URL.createObjectURL(blob)
//     link.download = filename

//     link.style.display = 'none'
//     body.appendChild(link)

//     link.click()
//     body.removeChild(link)
//     window.URL.revokeObjectURL(link.href)
//   }
// }

export const downloadUrl = (url) => {
  window.location.href = url
}
