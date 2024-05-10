<template>
  <el-card>
    <template #header>
      <div>将excel的某列转化成字符串形式</div>
    </template>
    <div class="row-item">
      <div class="row-item">
        <span class="item-title">字段名称</span>
        <el-select
          v-model="state.fieldName"
          clearable
          placeholder="请选择需要匹配的字段名称"
          class="field-input"
        >
          <el-option
            v-for="(item, index) in state.commonFieldsList"
            v-bind:key="index"
            :label="item.label"
            :value="item.value"
            >{{ item.label }}</el-option
          >
        </el-select>
      </div>
      <Upload btn-txt="选择文件" @handleFileChange="handleFileChange" />

      <!-- <div class="row-item">
          <el-button @click="onUpload" type="primary">选择文件</el-button>
          <input ref="uploadRef" type="file" @change="beforeUpload" accept=".xlsx, .xls" hidden />
        </div> -->
    </div>
    <div class="row-item">
      <span class="item-title">分隔符</span>
      <el-input
        v-model="state.divideChar"
        class="text-area"
        placeholder="请输入分隔符 默认英文逗号"
      ></el-input>
    </div>

    <div class="file-row" v-if="state.fileName">
      <div class="row-item icon-margin">
        <el-icon><Files /></el-icon>
        <span>{{ state.fileName }}</span>
      </div>
      <el-icon @click="handleDeleteFile"><Delete /></el-icon>
    </div>
    <div class="type-name">产出结果</div>
    <el-input type="textarea" v-model="state.matchArrToStr" rows="10" class="text-area"></el-input>
    <el-button @click="createMatchStr" v-if="state.fileName && !state.matchArrToStr"
      >生成</el-button
    >
    <el-button @click="handleCopy(state.matchArrToStr)" v-if="state.matchArrToStr" type="primary"
      >复制</el-button
    >
    <el-button @click="removeContent('matchArrToStr')" type="plain" v-if="state.matchArrToStr"
      >清空</el-button
    >
  </el-card>
</template>

<script setup>
import * as XLSX from 'xlsx'
import { ref, reactive, watch } from 'vue'
import { copyText } from 'vue3-clipboard'
import { toast } from '../util/toast'
import Upload from '../components/Upload.vue'
import SelectCommon from '../components/SelectCommon.vue'
//导入
// const uploadRef = ref()
// const onUpload = () => {
//   uploadRef.value.click()
// }
const state = reactive({
  fieldName: '',
  matchArrToStr: '',
  matchArrToSql: '',
  tmpTableName: '',
  excelData: [],
  fileName: '',
  commonFieldsList: [
    // {
    //   label: 'cust_code',
    //   value: 'cust_code'
    // },
    // {
    //   label: 'village_id',
    //   value: 'village_id'
    // },
    // {
    //   label: '标准地址',
    //   value: '标准地址'
    // }
  ],
  divideChar: ',',
  createTableSql: 'create table'
})

const beforeUpload = async (e) => {
  analysisExcel(e.target.files[0])
}

const handleFileChange = (file) => {
  let columns = []
  // return new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target.result
    let datajson = XLSX.read(data, {
      type: 'binary'
    })
    const sheetName = datajson.SheetNames[0]
    const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName])
    state.excelData = result
    Object.keys(result[0]).map((i, k) => {
      columns.push({ label: i, value: i })
    })
    state.commonFieldsList = columns
  }
  state.fileName = file.name
  reader.readAsBinaryString(file)
  // })
}
const removeContent = (type) => {
  state[type] = ''
}

const createMatchStr = () => {
  const { excelData, fieldName } = state
  if (validFieldName()) {
    if (fieldName === '标准地址') {
      const addr = []
      excelData.map((item) => {
        const i = item['标准地址']
        if (i.indexOf('、') > -1) {
          i.split('、').map((i) => addr.push(i))
        } else if (i.indexOf('，') > -1) {
          i.split('，').map((i) => addr.push(i))
        } else {
          addr.push(i)
        }
      })
      state.matchArrToStr = addr
        .map((i, k) => {
          return k === 0
            ? `a.stand_name like '%${i.replace(/\s*/g, '')}%'\n`
            : `or a.stand_name like '%${i.replace(/\s*/g, '')}%'\n`
        })
        .join('')
    } else {
      state.matchArrToStr = `${excelData
        .map((i) => `'${i[fieldName.toUpperCase()]}'`)
        .join(`${state.divideChar}`)}`
    }
  }
}

const validFieldName = () => {
  const { excelData, fieldName } = state
  const hasField = excelData[0][fieldName] || excelData[0][fieldName.toUpperCase()]
  if (!fieldName) {
    toast('请输入需要匹配的字段名称', 'error')
    return false
  }
  if (!hasField) {
    toast('excel文件中没有匹配到字段名称相同的列', 'error')
    return false
  }
  return true
}

const createInsertStr = () => {
  const { tmpTableName, excelData, fieldName } = state
  if (validFieldName()) {
    if (!tmpTableName) {
      return toast('请填写临时表名称', 'error')
    }
    state.matchArrToSql = excelData
      .map(
        (i, k) =>
          `insert into ${tmpTableName} values(${k + 1}, ${i[fieldName.toUpperCase()]}, ${
            i['CUST_ID']
          });\n`
      )
      .join('')
  }
}

const handleCopy = (content) => {
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

const handleDeleteFile = () => {
  state.excelData = []
  state.fileName = ''
}
</script>

<style scoped>
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.item-title {
  display: inline-block;
  width: 100px;
  text-align: left;
}
.field-input {
  width: 250px;
  margin-right: 20px;
}
.text-area {
  margin: 20px 0;
}
.file-row {
  color: #aaa;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.icon-margin {
  margin: 0 20px 0 0;
}

.type-name {
  font-weight: bold;
  text-align: left;
}
</style>
