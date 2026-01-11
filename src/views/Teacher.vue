<template>
  <div class="teacher-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>教师管理</span>
          <el-button type="primary" @click="handleAdd">新增教师</el-button>
        </div>
      </template>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.realName" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" width="200" />
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
        style="margin-top: 10px; justify-content: flex-end"
      />
    </el-card>
    <TeacherDialog
      v-model="dialogVisible"
      :form-data="formData"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { teacherApi } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
import TeacherDialog from '../components/TeacherDialog.vue'

const searchForm = reactive({
  realName: ''
})

const tableData = ref([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const dialogVisible = ref(false)
const formData = ref({})

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      current: pagination.current,
      size: pagination.size,
      ...searchForm
    }
    const res = await teacherApi.getPage(params)
    if (res.code === '200' && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total ?? res.data.totalCount ?? 0
      console.log('教师分页数据:', { total: pagination.total, records: tableData.value.length, data: res.data })
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
  searchForm.realName = ''
  handleSearch()
}

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
    await ElMessageBox.confirm('确定要删除该教师吗？', '提示', {
      type: 'warning'
    })
    const res = await teacherApi.delete(id)
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
.teacher-page {
  padding: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.search-buttons {
  margin-left: auto;
}

:deep(.el-card__body) {
  padding: 15px;
}

:deep(.el-table) {
  margin-bottom: 0;
}
</style>
