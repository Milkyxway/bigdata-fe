<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Skill 知识库管理</span>
      </div>
    </template>

    <div class="ai-append-section">
      <div class="section-title">新增内容</div>
      <div class="section-hint">
        选择对应的分类后输入内容，AI 将自动解析为结构化数据并写入知识库
      </div>

      <div class="type-section">
        <div class="type-label">表结构</div>
        <div class="append-row">
          <el-input
            type="textarea"
            :rows="2"
            v-model="tableContent"
            placeholder="例如：rep2.rep_fact_unpay_yyyymmdd 欠费表，fee 欠费金额(分)，acct_id 账户ID"
            class="append-input"
          />
          <el-button
            type="primary"
            @click="aiAppend('table')"
            :loading="tableLoading"
            class="append-btn"
          >
            添加
          </el-button>
        </div>
      </div>

      <div class="type-section">
        <div class="type-label">表关联关系</div>
        <div class="append-row">
          <el-input
            type="textarea"
            :rows="2"
            v-model="relationContent"
            placeholder="例如：rep2.rep_fact_cust_info_yyyymmdd.CUST_ID 关联 files2.um_subscriber.cust_id，1:1，客户对应终端"
            class="append-input"
          />
          <el-button
            type="primary"
            @click="aiAppend('relation')"
            :loading="relationLoading"
            class="append-btn"
          >
            添加
          </el-button>
        </div>
      </div>

      <div class="type-section">
        <div class="type-label">业务规则</div>
        <div class="append-row">
          <el-input
            type="textarea"
            :rows="2"
            v-model="ruleContent"
            placeholder="例如：订购正常 = 产品订购状态为正常 + 停开机状态为正常"
            class="append-input"
          />
          <el-button
            type="primary"
            @click="aiAppend('rule')"
            :loading="ruleLoading"
            class="append-btn"
          >
            添加
          </el-button>
        </div>
      </div>
    </div>

    <el-divider />

    <div class="section" v-loading="loading">
      <div class="section-title">
        <span>表结构</span>
        <span class="count-tag">{{ state.tables.length }}</span>
      </div>
      <div class="item-list" v-if="state.tables.length">
        <div class="item-row" v-for="(item, index) in state.tables" :key="'table-' + index">
          <div class="item-content">
            <span class="item-name">{{ item.fullName }}</span>
            <span class="item-alias" v-if="item.alias">{{ item.alias }}</span>
            <span class="item-fields" v-if="item.fields?.length">
              ({{ item.fields.map((f) => f.name).join(', ') }})
            </span>
          </div>
          <el-icon class="item-delete" @click="handleDelete('table', index)"><Close /></el-icon>
        </div>
      </div>
      <div class="empty-tip" v-else>暂无表结构</div>
    </div>

    <el-divider />

    <div class="section" v-loading="loading">
      <div class="section-title">
        <span>关联关系</span>
        <span class="count-tag">{{ state.relations.length }}</span>
      </div>
      <div class="item-list" v-if="state.relations.length">
        <div class="item-row" v-for="(item, index) in state.relations" :key="'relation-' + index">
          <div class="item-content">
            <span>{{ item.table1 }}.{{ item.field1 }}</span>
            <span class="relation-arrow">→</span>
            <span>{{ item.table2 }}.{{ item.field2 }}</span>
            <span class="relation-type" v-if="item.relationType">({{ item.relationType }})</span>
            <span class="relation-desc" v-if="item.description">- {{ item.description }}</span>
          </div>
          <el-icon class="item-delete" @click="handleDelete('relation', index)"><Close /></el-icon>
        </div>
      </div>
      <div class="empty-tip" v-else>暂无关联关系</div>
    </div>

    <el-divider />

    <div class="section" v-loading="loading">
      <div class="section-title">
        <span>业务规则</span>
        <span class="count-tag">{{ state.rules.length }}</span>
      </div>
      <div class="item-list" v-if="state.rules.length">
        <div class="item-row" v-for="(item, index) in state.rules" :key="'rule-' + index">
          <div class="item-content">
            <span>{{ item.description }}</span>
          </div>
          <el-icon class="item-delete" @click="handleDelete('rule', index)"><Close /></el-icon>
        </div>
      </div>
      <div class="empty-tip" v-else>暂无业务规则</div>
    </div>

    <el-divider />

    <div class="section" v-loading="loading">
      <div class="section-title">
        <span>Few-Shot 示例</span>
        <span class="count-tag">{{ state.fewShotExamples.length }}</span>
      </div>
      <div class="item-list" v-if="state.fewShotExamples.length">
        <div
          class="item-row example-row"
          v-for="(item, index) in state.fewShotExamples"
          :key="'example-' + index"
        >
          <div class="item-content">
            <div class="example-requirement">{{ item.requirement }}</div>
            <div class="example-sql">{{ item.sql }}</div>
          </div>
          <el-icon class="item-delete" @click="handleDelete('example', index)"><Close /></el-icon>
        </div>
      </div>
      <div class="empty-tip" v-else>暂无示例</div>
    </div>
  </el-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { getSkillConfigReq, aiAppendSkillReq, deleteSkillReq } from '../api/report'
import { toast } from '../util/toast'

const state = reactive({
  tables: [],
  relations: [],
  rules: [],
  fewShotExamples: []
})

const tableContent = ref('')
const relationContent = ref('')
const ruleContent = ref('')
const tableLoading = ref(false)
const relationLoading = ref(false)
const ruleLoading = ref(false)
const loading = ref(false)

const fetchConfig = async () => {
  loading.value = true
  try {
    const res = await getSkillConfigReq()
    if (res.code === 200) {
      state.tables = res.data.tables || []
      state.relations = res.data.relations || []
      state.rules = res.data.rules || []
      state.fewShotExamples = res.data.fewShotExamples || []
    }
  } catch (e) {
    toast('获取配置失败', 'error')
  } finally {
    loading.value = false
  }
}

const contentMap = {
  table: tableContent,
  relation: relationContent,
  rule: ruleContent
}
const loadingMap = {
  table: tableLoading,
  relation: relationLoading,
  rule: ruleLoading
}

const aiAppend = async (type) => {
  const content = contentMap[type]
  const loadingRef = loadingMap[type]
  if (!content.value.trim()) {
    return toast('请输入内容', 'warning')
  }
  loadingRef.value = true
  try {
    const res = await aiAppendSkillReq({ content: content.value.trim(), type })
    if (res.code === 200) {
      toast(res.data.message || '添加成功', 'success')
      content.value = ''
      fetchConfig()
    } else {
      toast(res.errMsg || '添加失败', 'error')
    }
  } catch (e) {
    toast('添加失败，请稍后重试', 'error')
  } finally {
    loadingRef.value = false
  }
}

const handleDelete = async (type, index) => {
  try {
    const res = await deleteSkillReq({ type, index })
    if (res.code === 200) {
      toast(res.data.message || '删除成功', 'success')
      fetchConfig()
    } else {
      toast(res.errMsg || '删除失败', 'error')
    }
  } catch (e) {
    toast('删除失败，请稍后重试', 'error')
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<style scoped>
.ai-append-section {
  margin-bottom: 10px;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-hint {
  font-size: 12px;
  color: #909399;
  margin-bottom: 14px;
}
.type-section {
  margin-bottom: 12px;
}
.type-label {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 4px;
}
.append-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.append-input {
  flex: 1;
}
.append-btn {
  height: 62px;
  width: 80px;
}
.count-tag {
  font-size: 12px;
  color: #909399;
  background: #f0f2f5;
  padding: 1px 8px;
  border-radius: 10px;
}
.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.item-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
}
.item-content {
  flex: 1;
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
}
.item-name {
  font-weight: 600;
  color: #409eff;
}
.item-alias {
  color: #67c23a;
  margin-left: 6px;
  font-size: 12px;
}
.item-fields {
  color: #909399;
  font-size: 12px;
}
.relation-arrow {
  color: #e6a23c;
  margin: 0 6px;
  font-weight: 600;
}
.relation-type {
  color: #909399;
  font-size: 12px;
  margin-left: 4px;
}
.relation-desc {
  color: #67c23a;
  font-size: 12px;
}
.example-requirement {
  color: #303133;
  margin-bottom: 4px;
}
.example-sql {
  color: #909399;
  font-size: 12px;
  font-family: monospace;
  word-break: break-all;
}
.item-delete {
  cursor: pointer;
  color: #c0c4cc;
  font-size: 14px;
  margin-left: 10px;
  margin-top: 2px;
  flex-shrink: 0;
}
.item-delete:hover {
  color: #f56c6c;
}
.empty-tip {
  font-size: 13px;
  color: #c0c4cc;
  padding: 16px 0;
  text-align: center;
}
</style>
