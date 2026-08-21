<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>按模板提数</span>
      </div>
    </template>
    <div class="row-item">
      <span class="label">无需匹配</span>
      <SelectCommon
        :selections="state.noMatch"
        v-model:select="state.selectTask"
        @updateSelect="(val) => (state.selectTask = val)"
      />
      <el-date-picker
        type="daterange"
        v-model="state.timeRange"
        start-placeholder="起始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-select
        v-model="state.selectStand"
        multiple
        collapse-tags
        placeholder="请选择广电站 不选为全部"
      >
        <el-option
          v-for="item in stands"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="state.pickMonth"
        placeholder="其他灵活参数"
        class="pick-month confirm-btn"
      ></el-input>
      <Upload
        btn-txt="上传一列参数"
        @handleFileChange="turnExcel2params"
        class="confirm-btn"
        btnType="plain"
      />
      <el-button type="primary" plain @click="createTask('noMatch')" class="confirm-btn"
        >立即执行</el-button
      >
    </div>
    <div class="row-item font-hint">*按需选择时间范围和广电站 广电站不选择为全量</div>
    <WhiteSpace />
    <div class="row-item">
      <span class="label">需要匹配</span>
      <SelectCommon
        :selections="state.needMatch"
        v-model:select="state.selectTask"
        @updateSelect="(val) => (state.selectTask = val)"
      />
      <el-button type="primary" plain @click="createTask('needMatch')" class="confirm-btn"
        >创建任务</el-button
      >
      <div class="btn-wrap">
        <Upload :btnTxt="'上传匹配文件并执行'" @handleFileChange="handleFileChange" />
      </div>
      <!-- <el-button type="primary" plain @click="confirm">开始执行</el-button> -->
    </div>
    <WhiteSpace />
  </el-card>
  <WhiteSpace />
  <el-card>
    <template #header>
      <div class="card-header">
        <span>输入脚本提数</span>
      </div>
    </template>
    <div class="row-item">
      <div>脚本可选</div>
      <SelectCommon
        :selections="state.commonSqls"
        v-model:select="state.inputSql"
        @updateSelect="
          (val) => {
            if (val !== '') {
              state.inputSql = val
            }
          }
        "
      />
    </div>

    <div class="row-item font-hint">*任务创建后可在任务列表查看执行结果</div>

    <WhiteSpace />
    <div class="ai-section">
      <div class="ai-header">
        <span class="ai-badge">✨ AI 取数助手</span>
        <span class="ai-model-tag">DeepSeek-V4-Pro</span>
        <span class="ai-subtitle">用自然语言描述需求，AI 自动生成 SQL</span>
      </div>
      <div class="ai-input-row">
        <div class="ai-input-wrap">
          <el-input
            type="textarea"
            :rows="3"
            v-model="state.aiInput"
            placeholder="请输入你的取数需求 例如：查询无锡2025年各个业务的销账总额"
            class="ai-input-box"
          />
          <input
            ref="fileInputRef"
            type="file"
            accept=".txt,.csv,.sql,.json,.xlsx,.xls"
            style="display: none"
            @change="handleFileUpload"
          />
          <div
            class="ai-upload-icon"
            @click="$refs.fileInputRef.click()"
            title="上传Excel文件，第一行表头+数据列作为条件"
          >
            <el-icon :size="16"><Plus /></el-icon>
          </div>
        </div>
        <el-button class="ai-btn-generate" @click="aiGenerateSql" :loading="state.aiLoading">
          <el-icon v-if="!state.aiLoading"><MagicStick /></el-icon>
          {{ state.aiLoading ? '生成中...' : '生成 SQL' }}
        </el-button>
      </div>
      <div class="ai-file-tag" v-if="state.aiFile.count > 0">
        <el-icon><FolderOpened /></el-icon>
        <span>已上传：{{ state.aiFile.header }}（{{ state.aiFile.count }}条）</span>
        <el-icon
          class="ai-file-close"
          @click="state.aiFile = { header: '', values: [], count: 0, rawFile: null }"
          ><Close
        /></el-icon>
      </div>
    </div>
    <div class="recent-prompts" v-if="state.recentPrompts.length">
      <el-tag
        v-for="(prompt, index) in state.recentPrompts"
        :key="'prompt-' + index"
        class="prompt-tag"
        @click="state.aiInput = prompt"
      >
        {{ prompt }}
      </el-tag>
    </div>
    <div class="row-item font-hint">*AI生成SQL后会自动填入下方输入框，请确认后再执行</div>
    <WhiteSpace />
    <el-input
      type="textarea"
      rows="15"
      class="text-area"
      v-model="state.inputSql"
      placeholder="该输入框可以选择下拉框中的脚本，也可以自主输入脚本；AI生成的SQL会自动填入此处"
    ></el-input>
    <WhiteSpace />
    <el-button type="primary" @click="inputTypeExe">立即执行</el-button>
    <el-button :disabled="!state.inputSql" @click="copySql" class="ai-btn-copy">
      <el-icon><DocumentCopy /></el-icon>
      复制SQL
    </el-button>
    <div v-if="state.reportLink" @click="downloadFn()" class="font-ble">
      {{ `http://172.16.179.2:7002/public/out/${state.reportLink}` }}
    </div>
  </el-card>

  <!-- 语音助手小人 -->
  <div class="voice-assistant" :class="{ listening: state.isListening }" @click="startVoiceInput">
    <div class="va-bubble" v-if="!state.isListening">说说你的需求吧~</div>
    <div class="va-bubble listening-text" v-else>正在聆听...</div>
    <div class="va-body">
      <div class="va-head">
        <div class="va-face">
          <span class="va-eye left"></span>
          <span class="va-eye right"></span>
          <span class="va-mouth"></span>
        </div>
      </div>
      <div class="va-dress"></div>
    </div>
  </div>

  <WhiteSpace />
  <el-card>
    <template #header>
      <div class="card-header">
        <span>日报合并</span>
      </div>
    </template>
    <div class="row-item">
      <span class="label">模板表</span>
      <input
        ref="templateInputRef"
        type="file"
        accept=".xlsx,.xls"
        style="display: none"
        @change="handleTemplateUpload"
      />
      <el-button plain @click="$refs.templateInputRef.click()">
        {{ state.mergeTemplateName || '选择模板表' }}
      </el-button>
      <el-icon v-if="state.mergeTemplateName" class="merge-remove" @click="removeTemplate"
        ><Close
      /></el-icon>
    </div>
    <div class="row-item">
      <span class="label">日报文件</span>
      <input
        ref="dailyInputRef"
        type="file"
        multiple
        accept=".xlsx,.xls"
        style="display: none"
        @change="handleDailyUpload"
      />
      <el-button plain @click="$refs.dailyInputRef.click()">
        {{
          state.mergeDailyReports.length
            ? `已选${state.mergeDailyReports.length}个日报`
            : '选择日报文件（可多选）'
        }}
      </el-button>
      <el-icon v-if="state.mergeDailyReports.length" class="merge-remove" @click="removeDaily"
        ><Close
      /></el-icon>
    </div>
    <WhiteSpace />
    <el-button
      type="primary"
      @click="mergeDaily"
      :loading="state.mergeLoading"
      :disabled="!state.mergeTemplate || !state.mergeDailyReports.length"
    >
      开始合并
    </el-button>
  </el-card>
</template>
<script setup>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { DocumentCopy, MagicStick, Plus, FolderOpened, Close } from '@element-plus/icons-vue'
import {
  getTaskListReq,
  updateTaskReq,
  uploadReq,
  createTaskReq,
  getTaskSqlsReq,
  addSqlBatchReq,
  addSqlReq,
  deleteTaskSqlReq,
  getSQLListReq,
  getRecentPromptsReq
} from '../api/report'
import { ElLoading } from 'element-plus'
import SelectCommon from '../components/SelectCommon.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import Upload from '../components/Upload.vue'
import { getLocalStore } from '../util/localStorage'
import { toast } from '../util/toast'
import { copyContent } from '../util/common'
import { stands, standMap } from '../constant/index'
const state = reactive({
  taskList: [],
  selectTask: '',
  taskId: 0,
  noMatch: [],
  needMatch: [],
  newReportId: '',
  timeRange: null,
  selectStand: null,
  inputSql: '',
  reportLink: '',
  commonSqls: [],
  selectSql: '',
  paramsStr: '',
  pickMonth: '',
  aiInput: '',
  aiLoading: false,
  isListening: false,
  aiFile: { header: '', values: [], count: 0, rawFile: null },
  mergeTemplate: null,
  mergeTemplateName: '',
  mergeDailyReports: [],
  mergeLoading: false,
  recentPrompts: []
})
const inputSqlSamples = [
  {
    label: '5g在网明细',
    value: `select distinct access_num, pri_package 套餐名称, status_name 用户状态, IS_30D_ACTIVE_2023 是否活跃, department_name 广电站, dev_name 发展人姓名,open_date\nfrom repcx.rep_fact_yw_um_subscriber_info_20240811\nwhere substr(open_date,1,10) >= '2024-02-01'\nand substr(open_date,1,10) <= '2024-03-31'\nand kpi_own_corp_org_id = 3303\nand onnet_status = 1`
  },
  {
    label: '5g活跃明细',
    value: `select distinct access_num, pri_package 套餐名称, status_name 用户状态, IS_30D_ACTIVE_2023 是否活跃, department_name 广电站, dev_name 发展人姓名,open_date\nfrom repcx.rep_fact_yw_um_subscriber_info_20240811\nwhere substr(open_date,1,10) >= '2024-02-01'\nand substr(open_date,1,10) <= '2024-03-31'\nand kpi_own_corp_org_id = 3303\nand onnet_status = 1\nand is_30d_active_2023 = 1\nand user_status in('1', 'E')`
  },
  {
    label: '5g在网数量',
    value: `select department_name, count(*) from repcx.rep_fact_yw_um_subscriber_info_20240811\nwhere substr(open_date,1,10) >= '2024-02-01'\nand substr(open_date,1,10) <= '2024-03-31'\nand kpi_own_corp_org_id = 3303\nand onnet_status = 1 group by department_name`
  },
  {
    label: '5g活跃数量',
    value: `select department_name, count(*) from repcx.rep_fact_yw_um_subscriber_info_20240811\nwhere substr(open_date,1,10) >= '2024-02-01'\nand substr(open_date,1,10) <= '2024-03-31'\nand kpi_own_corp_org_id = 3303\nand onnet_status = 1\nand is_30d_active_2023 = 1 \nand user_status in('1', 'E') \ngroup by department_name`
  },
  {
    label: '账单缴费明细',
    value: `select * from rep.fin2_pay_detail_202409 where to_char(create_date, 'yyyymmdd') between '20240901' and '20240907'\nand corp_org_name in ('无锡分公司','无锡江阴广电','无锡宜兴广电')\nand 入账类型 in ('营业厅', '批量预存', 'UPG', '充值卡', '退-赔', '转账')`
  }
]

const userId = getLocalStore('userInfo').userId
const region = getLocalStore('userInfo').region
const orgnization = getLocalStore('userInfo').orgnization
const formatArr = (arr) => {
  return arr.map((i) => {
    return {
      label: i.reportName,
      value: i.reportId
    }
  })
}

const turnExcel2params = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target.result
    let datajson = XLSX.read(data, {
      type: 'binary'
    })
    const sheetName = datajson.SheetNames[0]
    const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName])
    let columnName
    let str = ''
    Object.keys(result[0]).map((i) => {
      columnName = i
    })
    str = result.map((i) => i[columnName]).join(',')
    state.paramsStr = `(${str})`
  }
  reader.readAsBinaryString(file)
}

const inputTypeExe = async () => {
  if (!state.inputSql) {
    return toast('请输入sql脚本后再执行', 'warning')
  }
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const noon = new Date().getHours() < 12 ? '09:00:00' : '12:00:00'
  const res = await createTaskReq({
    LargeCategory: '一次性',
    reportName: `自助取数_${getLocalStore('userInfo').username}_${dayjs().format(
      'YYYYMMDDHHmmss'
    )}`,
    reportPriority: '普通',
    OneTime: `${dayjs().format('YYYY-MM-DD')} ${noon}`,
    taskAssignOrg: String(orgnization),
    custID: userId,
    region
  })
  const newTaskId = res.data.reportId
  await addSqlReq({ sqlType: 3, reportSqlData: state.inputSql, reportId: newTaskId })
  await updateTaskReq({
    reportId: newTaskId,
    reportState: 1
  })
  loading.close()
  toast('任务已创建，正在执行中～', 'success')
}

const downloadFn = () => {
  window.location.href = `http://172.16.179.2:7002/public/out/${state.reportLink}`
}
const getDemandList = async () => {
  const result = await getTaskListReq({
    LargeCategory: '',
    pageSize: 500,
    pageNum: 0,
    region,
    reportName: '',
    username: 'dev'
  })
  state.taskList = result.data.list
  const devIdByRegion = region === 'wx' ? [13] : region === 'yx' ? [20] : [19]
  state.needMatch = formatArr(
    result.data.list.filter(
      (i) =>
        i.SourceExcelLink &&
        devIdByRegion.includes(i.custID) &&
        i.taskAssignOrg
          .split(',')
          .map((i) => Number(i))
          .includes(orgnization) &&
        i.LargeCategory === '一次性'
    )
  )
  state.noMatch = formatArr(
    result.data.list.filter(
      (i) =>
        !i.SourceExcelLink &&
        devIdByRegion.includes(i.custID) &&
        i.taskAssignOrg
          .split(',')
          .map((i) => Number(i))
          .includes(orgnization) &&
        i.LargeCategory === '一次性'
    )
  )
}

const handleFileChange = async (file) => {
  const now = dayjs().format('YYYYMMDDHHmmss')
  const fileSplitLength = file.name.split('.').length
  const fileSuffix = file.name.split('.')[fileSplitLength - 1]
  const fileName = `${now}.${fileSuffix}`
  const copyFile = new File([file], `${fileName}`)
  const formData = new FormData()
  formData.append('file', copyFile)
  await uploadReq(formData)
  toast('上传成功')
  await updateTaskReq({
    reportId: state.newReportId,
    SourceExcelLink: copyFile.name,
    reportState: 1
  })
  toast('收到该需求了，正在努力执行～')
}

// 获取所选任务对应的sql
const getTaskRelatedSql = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getTaskSqlsReq({ taskId: state.selectTask })
      resolve(type === 'needMatch' ? res.data.taskSqls : formatSqlArr(res.data.taskSqls))
    } catch (e) {
      reject(e)
    }
  })
}

const formatSqlArr = (arr) => {
  if (arr.length === 1) {
    return modifySql(arr[0])
  }
  if ([1054, 1067, 1070, 1073, 1180, 2231, 2236, 2256, 2401].includes(state.selectTask)) {
    // 2+2查询每一条sql都要替换参数
    let data = []
    arr.map((i) => {
      data.push(modifySql(i)[0])
    })
    return data
  }
  const firstItem = arr[0]
  return [modifySql(firstItem)[0], ...arr.splice(1)]
}

const modifySql = (result) => {
  let sqlModify = result.reportSqlData
  if (state.timeRange) {
    const { timeRange } = state
    const startTime = dayjs(timeRange[0]).format('YYYYMMDD')
    const startTimeMinus1 = dayjs(timeRange[0]).subtract(1, 'day').format('YYYYMMDD')
    const endTime = dayjs(timeRange[1]).format('YYYYMMDD')
    sqlModify = sqlModify
      .replaceAll('#startTime', startTime)
      .replaceAll('#endTime', endTime)
      .replaceAll('#minus1', startTimeMinus1)
      .replaceAll('#pickMonth', state.pickMonth)
  }
  const condition =
    state.selectStand.length > 0
      ? `(${state.selectStand.map((i) => `'${standMap[i]}'`).join(',')})`
      : `(${stands.map((i) => `'${i.label}'`).join(',')})`
  sqlModify = sqlModify.replace(' #standList', condition)
  sqlModify = sqlModify.replace('#params', state.paramsStr)
  sqlModify = sqlModify.replace('#pickMonth', state.pickMonth)
  return [{ ...result, reportSqlData: sqlModify }]
}

// 把所选任务的sql插入到新的任务中 复制
const insertSqlToTask = (reportId, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqls = await getTaskRelatedSql(type)
      await addSqlBatchReq(
        sqls.map((i) => {
          return [reportId, i.reportSqlData, i.sqlType, i.ExcelTable, i.SourceSheet, i.TargetSheet]
        })
      )
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
/**
 * 创建任务 塞sql 更新状态变成执行
 */
const createTask = async (type) => {
  if (!state.selectTask) {
    return toast('请先选择一种需求', 'error')
  }
  const selectTask = state.taskList.filter((i) => i.reportId === state.selectTask)[0]
  const noon = new Date().getHours() < 12 ? '09:00:00' : '12:00:00'
  const { reportId, username, reportTypeName, excelData, ...rest } = selectTask // 这行没有用到的字段不能删除 为了取rest里的字段们
  const res = await createTaskReq({
    ...rest,
    reportLink: '',
    SourceExcelLink: '',
    logLink: '',
    lastTime: '',
    OneTime: `${dayjs().format('YYYY-MM-DD')} ${noon}`,
    lastTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
    reportState: 0,
    custID: userId
  })
  await insertSqlToTask(res.data.reportId, type)
  state.newReportId = res.data.reportId
  if (type === 'noMatch') {
    await updateTaskReq({
      reportId: res.data.reportId,
      reportState: 1
    })
    toast('收到该需求了，正在努力执行～')
  } else {
    toast('创建任务成功！')
  }
}
const getCommonSqlList = async () => {
  const result = await getSQLListReq()
  state.commonSqls = result.data.list.map((i) => {
    return {
      label: i.sqlName,
      value: i.sqlContent
    }
  })
  state.commonSqls = [...inputSqlSamples, ...state.commonSqls]
}

getCommonSqlList()
getDemandList()

const copySql = () => {
  copyContent(state.inputSql)
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  const isExcel = /\.xlsx?$/i.test(file.name)
  if (isExcel) {
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const result = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      if (result.length < 2) {
        toast('Excel至少需要表头和数据两行', 'warning')
        return
      }
      const header = result[0][0] || '字段名'
      const values = result
        .slice(1)
        .map((row) => row[0])
        .filter((v) => v !== undefined && v !== '')
      if (values.length === 0) {
        toast('未读取到有效数据', 'warning')
        return
      }
      state.aiFile = { header, values, count: values.length, rawFile: file }
      toast(`已读取${values.length}条数据`, 'success')
    }
    reader.readAsArrayBuffer(file)
  } else {
    reader.onload = (ev) => {
      state.aiInput = state.aiInput ? state.aiInput + '\n' + ev.target.result : ev.target.result
      toast('文件内容已导入', 'success')
    }
    reader.onerror = () => {
      toast('文件读取失败，请重试', 'error')
    }
    reader.readAsText(file, 'UTF-8')
  }
  e.target.value = ''
}

const startVoiceInput = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    return toast('当前浏览器不支持语音识别，请使用Chrome浏览器', 'warning')
  }
  if (state.isListening) {
    state.isListening = false
    return
  }
  const recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.interimResults = false
  recognition.continuous = false
  state.isListening = true
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    state.aiInput = state.aiInput ? state.aiInput + transcript : transcript
    toast('语音识别成功', 'success')
  }
  recognition.onerror = () => {
    toast('语音识别失败，请重试', 'error')
  }
  recognition.onend = () => {
    state.isListening = false
  }
  recognition.start()
}

const aiGenerateSql = async () => {
  if (!state.aiInput.trim()) {
    return toast('请输入需求描述后再生成', 'warning')
  }
  state.aiLoading = true
  try {
    const formData = new FormData()
    formData.append('requirement', state.aiInput)
    if (state.aiFile.rawFile) {
      formData.append('file', state.aiFile.rawFile)
    }
    const res = await fetch('http://172.16.179.2:7002/api/report/generateSql', {
      method: 'POST',
      body: formData
    })
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let streamDone = false
    while (!streamDone) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const event = JSON.parse(line.slice(6))
        switch (event.type) {
          case 'chunk':
            state.inputSql += event.content
            break
          case 'done':
            state.inputSql = event.prompt ? `-- 用户需求：${event.prompt}\n${event.sql}` : event.sql
            toast('SQL已生成，请确认后点击立即执行', 'success')
            streamDone = true
            break
          case 'error':
            toast(event.message || 'AI生成SQL失败', 'error')
            streamDone = true
            state.inputSql = ''
            break
        }
      }
    }
  } catch (e) {
    toast('AI服务异常，请稍后重试', 'error')
  } finally {
    state.aiLoading = false
  }
}

const handleTemplateUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  state.mergeTemplate = file
  state.mergeTemplateName = file.name
  e.target.value = ''
}

const handleDailyUpload = (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return
  state.mergeDailyReports = files
  e.target.value = ''
}

const removeTemplate = () => {
  state.mergeTemplate = null
  state.mergeTemplateName = ''
}

const removeDaily = () => {
  state.mergeDailyReports = []
}

const mergeDaily = async () => {
  state.mergeLoading = true
  try {
    const formData = new FormData()
    formData.append('template', state.mergeTemplate)
    state.mergeDailyReports.forEach((f) => formData.append('dailyReports', f))

    const resp = await fetch('http://172.16.179.2:7002/api/report/mergeDaily', {
      method: 'POST',
      body: formData
    })

    if (resp.ok) {
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged_daily_report.xlsx'
      a.click()
      URL.revokeObjectURL(url)
      toast('合并完成，正在下载', 'success')
    } else {
      const err = await resp.json()
      toast(err.errMsg || '合并失败', 'error')
    }
  } catch (e) {
    toast('合并服务异常，请稍后重试', 'error')
  } finally {
    state.mergeLoading = false
  }
}

const fetchRecentPrompts = async () => {
  try {
    const res = await getRecentPromptsReq()
    if (res.code === 200) {
      state.recentPrompts = res.data || []
    }
  } catch (e) {
    // 静默失败
  }
}

fetchRecentPrompts()
</script>
<style scoped>
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.column-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.merge-remove {
  cursor: pointer;
  color: #909399;
  margin-left: 6px;
}
.merge-remove:hover {
  color: #f56c6c;
}
.label {
  display: inline-block;
  width: max-content;
  text-align: left;
  margin-right: 10px;
  white-space: no-wrap;
}
.btn-wrap {
  margin: 0 10px;
}
.confirm-btn {
  margin-left: 10px;
}
:deep(.el-date-editor) {
  margin: 0 10px;
}
.font-hint {
  color: #f56c6c;
  font-size: 12px;
}
.font-ble {
  color: #0076fe;
  cursor: pointer;
}
.pick-month {
  max-width: 200px;
}
/* AI写SQL区域 */
.ai-section {
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 20px;
  background: linear-gradient(#fff, #fff) padding-box,
    linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) border-box;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.15);
  transition: box-shadow 0.3s ease;
}
.ai-section:hover {
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.25);
}
.ai-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.ai-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  white-space: nowrap;
}
.ai-model-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  color: #8b8fa3;
  border: 1px solid #e0e0e0;
  background: #f8f8fa;
  letter-spacing: 0.3px;
}
.ai-subtitle {
  color: #909399;
  font-size: 13px;
}
.ai-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ai-input-box {
  flex: 1;
}
.ai-btn-copy {
  border: 1px solid #c0c4cc;
  color: #606266;
  background: #fafafa;
  transition: all 0.2s;
}
.ai-btn-copy:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f0f0ff;
}
.ai-input-wrap {
  position: relative;
  flex: 1;
}
.ai-upload-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0f0f4;
  color: #8b8fa3;
  cursor: pointer;
  transition: all 0.2s;
}
.ai-upload-icon:hover {
  background: #667eea;
  color: #fff;
}
.ai-file-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  color: #667eea;
  background: #f0f0ff;
  border: 1px solid #d4d4f7;
}
.ai-file-close {
  cursor: pointer;
  color: #999;
  font-size: 14px;
}
.ai-file-close:hover {
  color: #e04040;
}
.recent-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.prompt-tag {
  cursor: pointer;
}
.prompt-tag:hover {
  color: #409eff;
  border-color: #409eff;
}
.ai-btn-generate {
  border: none;
  color: #fff;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: all 0.3s;
  white-space: nowrap;
}
.ai-btn-generate:hover {
  background: linear-gradient(135deg, #764ba2, #667eea);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}
.ai-btn-generate:active {
  transform: translateY(0);
}
.ai-btn-generate.is-loading {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* 语音助手小人 - 右下角悬浮 */
.voice-assistant {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}
.voice-assistant:hover {
  transform: scale(1.05);
}
.voice-assistant:hover .va-bubble {
  opacity: 1;
}
.va-bubble {
  position: absolute;
  bottom: 130px;
  right: -10px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 8px 14px;
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.va-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 24px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #fff;
}
.va-bubble.listening-text {
  opacity: 1;
  color: #e04040;
  font-weight: 500;
}
.va-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.va-head {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd1d1, #ffb3b3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(255, 150, 150, 0.4);
  position: relative;
  z-index: 2;
}
.va-face {
  display: flex;
  flex-wrap: wrap;
  width: 28px;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}
.va-eye {
  display: inline-block;
  width: 6px;
  height: 7px;
  border-radius: 50%;
  background: #333;
}
.va-eye.right {
  margin-left: 4px;
}
.va-mouth {
  display: inline-block;
  width: 10px;
  height: 5px;
  border-radius: 0 0 10px 10px;
  background: #e88;
  margin: 4px auto 0;
}
.va-dress {
  width: 50px;
  height: 24px;
  border-radius: 0 0 20px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  margin-top: -4px;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
.voice-assistant.listening .va-head {
  animation: girlPulse 1.2s ease-in-out infinite;
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  box-shadow: 0 0 24px rgba(255, 120, 120, 0.6);
}
.voice-assistant.listening .va-mouth {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e55;
  animation: mouthTalk 0.4s ease-in-out infinite;
}
@keyframes girlPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 120, 120, 0.6);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 16px rgba(255, 120, 120, 0);
  }
}
@keyframes mouthTalk {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.4);
  }
}
</style>
