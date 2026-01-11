<template>
  <div class="evaluation-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>学生评估</span>
          <el-button type="primary" @click="handleAdd">新增评估</el-button>
        </div>
      </template>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="评估类型">
          <el-select 
            v-model="searchForm.evaluationType" 
            placeholder="请选择评估类型" 
            clearable
            style="width: 200px"
          >
            <el-option label="学习" value="学习" />
            <el-option label="品德" value="品德" />
            <el-option label="活动参与" value="活动参与" />
          </el-select>
        </el-form-item>
        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="studentId" label="学生ID" width="100" />
        <el-table-column prop="evaluationType" label="评估类型" width="140" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-if="scope.row.evaluationType" type="primary" size="small">
              {{ scope.row.evaluationType }}
            </el-tag>
            <el-tag v-else-if="scope.row.evaluation_type" type="primary" size="small">
              {{ scope.row.evaluation_type }}
            </el-tag>
            <span v-else style="color: #909399;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分数" width="100" />
        <el-table-column prop="level" label="等级" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.level" type="success" size="small">{{ scope.row.level }}</el-tag>
            <span v-else style="color: #909399;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="semester" label="学期" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
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
    <EvaluationDialog
      v-model="dialogVisible"
      :form-data="formData"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { evaluationApi } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
import EvaluationDialog from '../components/EvaluationDialog.vue'

const searchForm = reactive({
  evaluationType: ''
})

const tableData = ref([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      current: pagination.current,
      size: pagination.size,
      ...searchForm
    }
    const res = await evaluationApi.getPage(params)
    if (res.code === '200' && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total || 0
      // 调试：打印第一条数据查看字段结构
      if (tableData.value.length > 0) {
        console.log('评估数据示例:', tableData.value[0])
        console.log('评估类型字段:', tableData.value[0].evaluationType, tableData.value[0].evaluation_type)
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchForm.evaluationType = ''
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

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该评估吗？', '提示', {
      type: 'warning'
    })
    const res = await evaluationApi.delete(id)
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
.evaluation-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.search-buttons {
  margin-left: auto;
}
</style>

