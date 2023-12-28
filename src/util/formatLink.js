export const formatLink = (fileName, path) =>
  fileName ? `http://172.16.179.2:7002/public/${path}/${fileName}` : null

export const downloadUrl = (url, filename) => {
  let fileNameCopy = filename
  const urlSplitArr = typeof url === 'string' ? url.split('/') : url[0].split('/')
  let timeStampInUrl = urlSplitArr[urlSplitArr.length - 1]
  timeStampInUrl = timeStampInUrl.split('.')[0]
  fileNameCopy = `${filename}(${timeStampInUrl})`

  getBlob(url, (blob) => {
    saveAs(blob, fileNameCopy)
  })
}

const getBlob = (url, cb) => {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    if (xhr.status === 200) {
      cb(xhr.response)
    }
  }
  xhr.send()
}

const saveAs = (blob, filename) => {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    var link = document.createElement('a')
    var body = document.querySelector('body')

    link.href = window.URL.createObjectURL(blob)
    link.download = filename

    link.style.display = 'none'
    body.appendChild(link)

    link.click()
    body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}

// export const downloadUrl = (url) => {
//   window.location.href = url
// }

export const getResultTxt = (row) => {
  if (row.isChild && row.LargeCategory === '周期性' && row.reportLink) {
    return `结果excel(生成日期${row.reportLink.substr(36, 8)})`
  }
  if (row.LargeCategory === '一次性' && row.reportLink) {
    return '结果excel'
  }
}

/**
 * format成table组件的树形结构
 * @param {*} data
 * @returns
 */
export const insertIdIntoArr = (data) => {
  const result = data.map((i) => {
    if (i.LargeCategory === '周期性') {
      return {
        ...i,
        id: i.reportId,
        children: i.reportLink?.length
          ? i.reportLink.map((m) => {
              return {
                ...i,
                reportLink: m,
                isChild: true
              }
            })
          : []
      }
    }
    return i
  })
  return result
}
