<template>
  <div class="plan-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>计划管理</span>
          <el-button type="primary" @click="handleAdd">新增计划</el-button>
        </div>
      </template>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="计划名称">
          <el-input v-model="searchForm.planName" placeholder="请输入计划名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="planName" label="计划名称" />
        <el-table-column prop="planType" label="计划类型" />
        <el-table-column prop="startDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
        <el-table-column prop="progress" label="进度">
          <template #default="scope">
            <el-progress :percentage="scope.row.progress" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button type="success" size="small" @click="handleUpdateProgress(scope.row)">更新进度</el-button>
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
    <PlanDialog
      v-model="dialogVisible"
      :form-data="formData"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { planApi } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
import PlanDialog from '../components/PlanDialog.vue'

const searchForm = reactive({
  planName: ''
})

const tableData = ref([])
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const getStatusText = (status) => {
  const map = { 0: '未开始', 1: '进行中', 2: '已完成', 3: '已取消' }
  return map[status] || '未知'
}

const getStatusType = (status) => {
  const map = { 0: 'info', 1: 'success', 2: 'warning', 3: 'danger' }
  return map[status] || ''
}

const loadData = async () => {
  try {
    const params = {
      current: pagination.current,
      size: pagination.size,
      ...searchForm
    }
    const res = await planApi.getPage(params)
    if (res.code === '200' && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchForm.planName = ''
  handleSearch()
}

const dialogVisible = ref(false)
const formData = ref({})

const handleAdd = () => {
  formData.value = {}
  dialogVisible.value = true
}

const handleEdit = (row) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleSuccess = () => {
  dialogVisible.value = false
  loadData()
}

const handleUpdateProgress = async (row) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入进度（0-100）', '更新进度', {
      inputPattern: /^([0-9]|[1-9][0-9]|100)$/,
      inputErrorMessage: '请输入0-100之间的数字'
    })
    const progress = parseInt(value)
    const res = await planApi.updateProgress(row.id, progress)
    if (res.code === '200') {
      ElMessage.success('进度更新成功')
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('更新失败')
    }
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该计划吗？', '提示', {
      type: 'warning'
    })
    const res = await planApi.delete(id)
    if (res.code === '200') {
      ElMessage.success('删除成功')
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = () => {
  loadData()
}

const handleCurrentChange = () => {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.plan-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>

