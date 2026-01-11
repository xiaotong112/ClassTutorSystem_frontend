<template>
  <div class="log-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>日志管理</span>
        </div>
      </template>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="操作人">
          <el-input 
            v-model="searchForm.operatorName" 
            placeholder="请输入操作人姓名" 
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select 
            v-model="searchForm.operationType" 
            placeholder="请选择操作类型" 
            clearable
            style="width: 200px"
          >
            <el-option label="新增" value="新增" />
            <el-option label="修改" value="修改" />
            <el-option label="删除" value="删除" />
            <el-option label="查询" value="查询" />
            <el-option label="登录" value="登录" />
            <el-option label="导出" value="导出" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作模块">
          <el-select 
            v-model="searchForm.operationModule" 
            placeholder="请选择操作模块" 
            clearable
            style="width: 200px"
          >
            <el-option label="班级管理" value="班级管理" />
            <el-option label="学生管理" value="学生管理" />
            <el-option label="教师管理" value="教师管理" />
            <el-option label="课程管理" value="课程管理" />
            <el-option label="活动管理" value="活动管理" />
            <el-option label="计划管理" value="计划管理" />
            <el-option label="学生评估" value="学生评估" />
            <el-option label="数据统计" value="数据统计" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 400px"
            @change="handleDateRangeChange"
          />
        </el-form-item>
        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="operatorName" label="操作人" width="120" />
        <el-table-column prop="operationModule" label="操作模块" width="120" />
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="scope">
            <el-tag :type="getOperationTypeTag(scope.row.operationType)" size="small">
              {{ scope.row.operationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationContent" label="操作内容" min-width="250" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 1 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" width="180" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { logApi } from '../api'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  operatorName: '',
  operationType: '',
  operationModule: '',
  startTime: '',
  endTime: ''
})

const dateRange = ref(null)

const tableData = ref([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const getOperationTypeTag = (type) => {
  const map = {
    '新增': 'success',
    '修改': 'warning',
    '删除': 'danger',
    '查询': 'info',
    '登录': 'primary',
    '导出': 'success'
  }
  return map[type] || ''
}

const handleDateRangeChange = (dates) => {
  if (dates && dates.length === 2) {
    searchForm.startTime = dates[0]
    searchForm.endTime = dates[1]
  } else {
    searchForm.startTime = ''
    searchForm.endTime = ''
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      current: pagination.current,
      size: pagination.size,
      ...searchForm
    }
    // 移除空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    })
    const res = await logApi.getPage(params)
    if (res.code === '200' && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total ?? res.data.totalCount ?? 0
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
  searchForm.operatorName = ''
  searchForm.operationType = ''
  searchForm.operationModule = ''
  searchForm.startTime = ''
  searchForm.endTime = ''
  dateRange.value = null
  handleSearch()
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
.log-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
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
