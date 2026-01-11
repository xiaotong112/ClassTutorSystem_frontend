<template>
  <div class="statistics-page">
    <!-- 概览统计卡片 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6" v-for="stat in overviewStats" :key="stat.label">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="30"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细统计 -->
    <el-row :gutter="20" class="detail-row">
      <el-col :span="12">
        <el-card class="detail-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon" :size="20" style="color: #409EFF"><Calendar /></el-icon>
              <span>活动统计</span>
            </div>
          </template>
          <div class="stats-container">
            <div class="stat-row">
              <div class="stat-label-text">总活动数</div>
              <div class="stat-number">{{ activityStats.totalActivities || 0 }}</div>
            </div>
            <div class="stat-row">
              <div class="stat-label-text">
                <el-icon><Clock /></el-icon>
                未开始
              </div>
              <div class="stat-number pending">{{ activityStats.pendingActivities || 0 }}</div>
            </div>
            <div class="stat-row">
              <div class="stat-label-text">
                <el-icon><Loading /></el-icon>
                进行中
              </div>
              <div class="stat-number ongoing">{{ activityStats.ongoingActivities || 0 }}</div>
            </div>
            <div class="stat-row">
              <div class="stat-label-text">
                <el-icon><CircleCheck /></el-icon>
                已结束
              </div>
              <div class="stat-number completed">{{ activityStats.completedActivities || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="detail-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon" :size="20" style="color: #67C23A"><Document /></el-icon>
              <span>计划统计</span>
            </div>
          </template>
          <div class="stats-container">
            <div class="stat-row">
              <div class="stat-label-text">总计划数</div>
              <div class="stat-number">{{ planStats.totalPlans || 0 }}</div>
            </div>
            <div class="stat-row">
              <div class="stat-label-text">
                <el-icon><Clock /></el-icon>
                未开始
              </div>
              <div class="stat-number pending">{{ planStats.pendingPlans || 0 }}</div>
            </div>
            <div class="stat-row">
              <div class="stat-label-text">
                <el-icon><Loading /></el-icon>
                进行中
              </div>
              <div class="stat-number ongoing">{{ planStats.ongoingPlans || 0 }}</div>
            </div>
            <div class="stat-row">
              <div class="stat-label-text">
                <el-icon><CircleCheck /></el-icon>
                已完成
              </div>
              <div class="stat-number completed">{{ planStats.completedPlans || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { statisticsApi } from '../api'
import { School, UserFilled, Reading, Calendar, Document, Clock, Loading, CircleCheck } from '@element-plus/icons-vue'

const overviewStats = reactive([
  { label: '班级总数', value: 0, icon: 'School', color: '#409EFF' },
  { label: '学生总数', value: 0, icon: 'UserFilled', color: '#67C23A' },
  { label: '课程总数', value: 0, icon: 'Reading', color: '#E6A23C' },
  { label: '活动总数', value: 0, icon: 'Calendar', color: '#F56C6C' }
])

const activityStats = reactive({
  totalActivities: 0,
  pendingActivities: 0,
  ongoingActivities: 0,
  completedActivities: 0
})

const planStats = reactive({
  totalPlans: 0,
  pendingPlans: 0,
  ongoingPlans: 0,
  completedPlans: 0
})

const loadOverview = async () => {
  try {
    const res = await statisticsApi.getOverview()
    if (res.code === '200' && res.data) {
      overviewStats[0].value = res.data.classCount || 0
      overviewStats[1].value = res.data.studentCount || 0
      overviewStats[2].value = res.data.courseCount || 0
      overviewStats[3].value = res.data.activityCount || 0
    }
  } catch (error) {
    console.error('获取概览数据失败:', error)
  }
}

const loadActivityStats = async () => {
  try {
    const res = await statisticsApi.getActivityStats()
    if (res.code === '200' && res.data) {
      Object.assign(activityStats, res.data)
    }
  } catch (error) {
    console.error('获取活动统计失败:', error)
  }
}

const loadPlanStats = async () => {
  try {
    const res = await statisticsApi.getPlanStats()
    if (res.code === '200' && res.data) {
      Object.assign(planStats, res.data)
    }
  } catch (error) {
    console.error('获取计划统计失败:', error)
  }
}

onMounted(() => {
  loadOverview()
  loadActivityStats()
  loadPlanStats()
})
</script>

<style scoped>
.statistics-page {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.overview-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 15px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

.detail-row {
  margin-top: 20px;
}

.detail-card {
  border-radius: 8px;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.header-icon {
  margin-right: 8px;
}

.stats-container {
  padding: 10px 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-row:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding-left: 10px;
  padding-right: 10px;
}

.stat-label-text {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #606266;
  font-weight: 500;
}

.stat-label-text .el-icon {
  margin-right: 8px;
  font-size: 16px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-number.pending {
  color: #909399;
}

.stat-number.ongoing {
  color: #409EFF;
}

.stat-number.completed {
  color: #67C23A;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .overview-row .el-col {
    margin-bottom: 15px;
  }
}

@media (max-width: 768px) {
  .statistics-page {
    padding: 15px;
  }
  
  .overview-row .el-col {
    span: 12;
    margin-bottom: 15px;
  }
  
  .detail-row .el-col {
    span: 24;
    margin-bottom: 15px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
  }
}
</style>
