<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>按模板提数</span>
      </div>
    </template>
    <div class="row-item">
      <span class="label">无需匹配需求</span>
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
        placeholder="可输入月份yyyymm"
        class="pick-month confirm-btn"
      ></el-input>
      <Upload
        btn-txt="选择文件"
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
      <span class="label">匹配类型需求</span>
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

    <div class="row-item font-hint">
      *点击执行后每10s轮询任务执行状态。当轮询到提数结果时,页面上将展示结果的下载地址，因此点击执行后切勿关闭页面、切换页面等动作。
    </div>

    <WhiteSpace />
    <el-input
      type="textarea"
      rows="15"
      class="text-area"
      v-model="state.inputSql"
      placeholder="该输入框可以选择下拉框中的脚本，也可以自主输入脚本；"
    ></el-input>
    <WhiteSpace />
    <el-button type="primary" @click="inputTypeExe">立即执行</el-button>
    <div v-if="state.reportLink" @click="downloadFn()" class="font-ble">
      {{ `http://172.16.179.2:7002/public/out/${state.reportLink}` }}
    </div>
  </el-card>
</template>
<script setup>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import {
  getTaskListReq,
  updateTaskReq,
  uploadReq,
  createTaskReq,
  getTaskSqlsReq,
  addSqlBatchReq,
  addSqlReq,
  deleteTaskSqlReq,
  getSQLListReq
} from '../api/report'
import { ElLoading } from 'element-plus'
import SelectCommon from '../components/SelectCommon.vue'
import WhiteSpace from '../components/WhiteSpace.vue'
import Upload from '../components/Upload.vue'
import { getLocalStore } from '../util/localStorage'
import { toast } from '../util/toast'
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
  pickMonth: ''
})
const inputSqlSamples = [
  {
    label: '5g在网明细',
    value: `select distinct access_num, pri_package 套餐名称, status_name 用户状态, IS_30D_ACTIVE_2023 是否活跃, department_name 广电站, dev_name 发展人姓名,open_date\nfrom repcx.rep_fact_yw_um_subscriber_info_20240811\nwhere to_date(open_date, 'yyyy-mm-dd hh24:mi:ss') >= date '2024-02-01'\nand to_date(open_date, 'yyyy-mm-dd hh24:mi:ss') <= date '2024-03-31'\nand kpi_own_corp_org_id = 3303\nand onnet_status = 1`
  },
  {
    label: '5g活跃明细',
    value: `select distinct access_num, pri_package 套餐名称, status_name 用户状态, IS_30D_ACTIVE_2023 是否活跃, department_name 广电站, dev_name 发展人姓名,open_date\nfrom repcx.rep_fact_yw_um_subscriber_info_20240811\nwhere to_date(open_date, 'yyyy-mm-dd hh24:mi:ss') >= date '2024-02-01'\nand to_date(open_date, 'yyyy-mm-dd hh24:mi:ss') <= date '2024-03-31'\nand kpi_own_corp_org_id = 3303\nand onnet_status = 1\nand is_30d_active_2023 = 1`
  },
  {
    label: '5g在网数量',
    value: `select department_name, count(*) from repcx.rep_fact_yw_um_subscriber_info_20240811\nwhere to_date(open_date, 'yyyy-mm-dd hh24:mi:ss') >= date '2024-02-01'\nand to_date(open_date, 'yyyy-mm-dd hh24:mi:ss') <= date '2024-03-31'\nand kpi_own_corp_org_id = 3303\nand onnet_status = 1 group by department_name`
  },
  {
    label: '5g活跃数量',
    value: `select department_name, count(*) from repcx.rep_fact_yw_um_subscriber_info_20240811\nwhere to_date(open_date, 'yyyy-mm-dd hh24:mi:ss') >= date '2024-02-01'\nand to_date(open_date, 'yyyy-mm-dd hh24:mi:ss') <= date '2024-03-31'\nand kpi_own_corp_org_id = 3303\nand onnet_status = 1\nand is_30d_active_2023 = 1 group by department_name`
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
  const res = await getTaskSqlsReq({ taskId: 800 })
  if (res.data.taskSqls.length) {
    const reportSqlId = res.data.taskSqls[0].reportSqlId
    await deleteTaskSqlReq({ reportSqlId })
  }
  await addSqlReq({ sqlType: 3, reportSqlData: state.inputSql, reportId: 800 })
  await updateTaskReq({
    reportId: 800,
    reportState: 1,
    OneTime: `${dayjs().format('YYYY-MM-DD')} ${noon}`,
    lastTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00')
  })
  toast('收到该需求了，正在努力执行～')
  let timer
  timer = setInterval(async () => {
    const result = await getTaskListReq({
      reportId: 800,
      LargeCategory: '',
      pageSize: 200,
      pageNum: 0,
      region
    })
    if (result.data.list[0].reportState == 2) {
      loading.close()
      state.reportLink = result.data.list[0].excelData.reverse()[0].excelData
      clearInterval(timer)
      timer = null
    }
  }, 10000)
}

const downloadFn = () => {
  window.location.href = `http://172.16.179.2:7002/public/out/${state.reportLink}`
}
const getDemandList = async () => {
  const result = await getTaskListReq({
    LargeCategory: '',
    pageSize: 200,
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
        orgnization === i.taskAssignOrg &&
        i.LargeCategory === '一次性'
    )
  )
  state.noMatch = formatArr(
    result.data.list.filter(
      (i) =>
        !i.SourceExcelLink &&
        devIdByRegion.includes(i.custID) &&
        orgnization === i.taskAssignOrg &&
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
  if ([1054, 1067].includes(state.selectTask)) {
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
</style>
