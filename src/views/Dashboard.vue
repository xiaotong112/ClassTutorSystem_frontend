<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card" shadow="hover" @click="handleCardClick(stat.route)">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="32"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行：活动状态和计划进度 -->
    <el-row :gutter="20" class="second-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" style="color: #409EFF; margin-right: 8px;"><Calendar /></el-icon>
              <span>活动状态</span>
            </div>
          </template>
          <div class="status-content">
            <div class="status-item">
              <div class="status-label">
                <el-icon><Clock /></el-icon>
                未开始
              </div>
              <div class="status-value pending">{{ activityStats.pendingActivities || 0 }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">
                <el-icon><Loading /></el-icon>
                进行中
              </div>
              <div class="status-value ongoing">{{ activityStats.ongoingActivities || 0 }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">
                <el-icon><CircleCheck /></el-icon>
                已结束
              </div>
              <div class="status-value completed">{{ activityStats.completedActivities || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" style="color: #67C23A; margin-right: 8px;"><Document /></el-icon>
              <span>计划进度</span>
            </div>
          </template>
          <div class="status-content">
            <div class="status-item">
              <div class="status-label">
                <el-icon><Clock /></el-icon>
                未开始
              </div>
              <div class="status-value pending">{{ planStats.pendingPlans || 0 }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">
                <el-icon><Loading /></el-icon>
                进行中
              </div>
              <div class="status-value ongoing">{{ planStats.ongoingPlans || 0 }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">
                <el-icon><CircleCheck /></el-icon>
                已完成
              </div>
              <div class="status-value completed">{{ planStats.completedPlans || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第三行：最近活动和最近计划 -->
    <el-row :gutter="20" class="third-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" style="color: #E6A23C; margin-right: 8px;"><Calendar /></el-icon>
              <span>最近活动</span>
              <el-button type="text" @click="goToActivity" style="margin-left: auto;">查看更多</el-button>
            </div>
          </template>
          <div class="list-content">
            <div v-if="recentActivities.length === 0" class="empty-state">
              <el-empty description="暂无活动" :image-size="80" />
            </div>
            <div v-else>
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id" 
                class="list-item"
                @click="goToActivity"
              >
                <div class="item-main">
                  <div class="item-title">{{ activity.activityName }}</div>
                  <div class="item-meta">
                    <el-tag :type="getActivityStatusType(activity.status)" size="small">
                      {{ getActivityStatusText(activity.status) }}
                    </el-tag>
                    <span class="item-time">{{ activity.startTime }}</span>
                  </div>
                </div>
                <el-icon class="item-icon"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" style="color: #909399; margin-right: 8px;"><Document /></el-icon>
              <span>最近计划</span>
              <el-button type="text" @click="goToPlan" style="margin-left: auto;">查看更多</el-button>
            </div>
          </template>
          <div class="list-content">
            <div v-if="recentPlans.length === 0" class="empty-state">
              <el-empty description="暂无计划" :image-size="80" />
            </div>
            <div v-else>
              <div 
                v-for="plan in recentPlans" 
                :key="plan.id" 
                class="list-item"
                @click="goToPlan"
              >
                <div class="item-main">
                  <div class="item-title">{{ plan.planName }}</div>
                  <div class="item-meta">
                    <el-progress 
                      :percentage="plan.progress || 0" 
                      :stroke-width="6"
                      :color="getProgressColor(plan.progress)"
                    />
                    <span class="item-time">{{ plan.startDate }}</span>
                  </div>
                </div>
                <el-icon class="item-icon"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-row :gutter="20" class="quick-actions-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" style="color: #409EFF; margin-right: 8px;"><Operation /></el-icon>
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <div class="action-item" @click="goToPage('/class')">
              <el-icon :size="24" style="color: #409EFF;"><School /></el-icon>
              <span>班级管理</span>
            </div>
            <div class="action-item" @click="goToPage('/student')">
              <el-icon :size="24" style="color: #67C23A;"><UserFilled /></el-icon>
              <span>学生管理</span>
            </div>
            <div class="action-item" @click="goToPage('/activity')">
              <el-icon :size="24" style="color: #E6A23C;"><Calendar /></el-icon>
              <span>活动管理</span>
            </div>
            <div class="action-item" @click="goToPage('/plan')">
              <el-icon :size="24" style="color: #909399;"><Document /></el-icon>
              <span>计划管理</span>
            </div>
            <div class="action-item" @click="goToPage('/evaluation')">
              <el-icon :size="24" style="color: #F56C6C;"><EditPen /></el-icon>
              <span>学生评估</span>
            </div>
            <div class="action-item" @click="goToPage('/statistics')">
              <el-icon :size="24" style="color: #606266;"><DataAnalysis /></el-icon>
              <span>数据统计</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { statisticsApi, activityApi, planApi } from '../api'
import { 
  School, UserFilled, Reading, Calendar, Document, EditPen,
  Clock, Loading, CircleCheck, ArrowRight, Operation, DataAnalysis
} from '@element-plus/icons-vue'

const router = useRouter()

const stats = ref([
  { title: '班级总数', value: 0, icon: 'School', color: '#409EFF', route: '/class' },
  { title: '学生总数', value: 0, icon: 'UserFilled', color: '#67C23A', route: '/student' },
  { title: '课程总数', value: 0, icon: 'Reading', color: '#E6A23C', route: '/course' },
  { title: '活动总数', value: 0, icon: 'Calendar', color: '#F56C6C', route: '/activity' }
])

const activityStats = reactive({
  pendingActivities: 0,
  ongoingActivities: 0,
  completedActivities: 0
})

const planStats = reactive({
  pendingPlans: 0,
  ongoingPlans: 0,
  completedPlans: 0
})

const recentActivities = ref([])
const recentPlans = ref([])

const getActivityStatusText = (status) => {
  const map = { 0: '未开始', 1: '进行中', 2: '已结束' }
  return map[status] || '未知'
}

const getActivityStatusType = (status) => {
  const map = { 0: 'info', 1: 'success', 2: 'warning' }
  return map[status] || ''
}

const getProgressColor = (progress) => {
  if (progress >= 80) return '#67c23a'
  if (progress >= 50) return '#e6a23c'
  if (progress >= 20) return '#409eff'
  return '#f56c6c'
}

const loadOverview = async () => {
  try {
    const res = await statisticsApi.getOverview()
    if (res.code === '200' && res.data) {
      stats.value[0].value = res.data.classCount || 0
      stats.value[1].value = res.data.studentCount || 0
      stats.value[2].value = res.data.courseCount || 0
      stats.value[3].value = res.data.activityCount || 0
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

const loadRecentActivities = async () => {
  try {
    const res = await activityApi.getPage({ current: 1, size: 5 })
    if (res.code === '200' && res.data) {
      recentActivities.value = res.data.records || []
    }
  } catch (error) {
    console.error('获取最近活动失败:', error)
  }
}

const loadRecentPlans = async () => {
  try {
    const res = await planApi.getPage({ current: 1, size: 5 })
    if (res.code === '200' && res.data) {
      recentPlans.value = res.data.records || []
    }
  } catch (error) {
    console.error('获取最近计划失败:', error)
  }
}

const handleCardClick = (route) => {
  if (route) {
    router.push(route)
  }
}

const goToActivity = () => {
  router.push('/activity')
}

const goToPlan = () => {
  router.push('/plan')
}

const goToPage = (path) => {
  router.push(path)
}

onMounted(() => {
  loadOverview()
  loadActivityStats()
  loadPlanStats()
  loadRecentActivities()
  loadRecentPlans()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
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
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

.second-row {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.status-content {
  padding: 10px 0;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #606266;
  font-weight: 500;
}

.status-label .el-icon {
  margin-right: 8px;
  font-size: 16px;
}

.status-value {
  font-size: 24px;
  font-weight: bold;
}

.status-value.pending {
  color: #909399;
}

.status-value.ongoing {
  color: #409EFF;
}

.status-value.completed {
  color: #67C23A;
}

.third-row {
  margin-bottom: 20px;
}

.list-content {
  padding: 10px 0;
  max-height: 300px;
  overflow-y: auto;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fafafa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.list-item:hover {
  background-color: #f0f9ff;
  transform: translateX(5px);
}

.item-main {
  flex: 1;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-time {
  font-size: 12px;
  color: #909399;
}

.item-icon {
  color: #c0c4cc;
  font-size: 18px;
}

.quick-actions-row {
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 100px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-item span {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-row .el-col {
    margin-bottom: 15px;
  }
  
  .stat-value {
    font-size: 32px;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 768px) {
  .stats-row .el-col {
    span: 12;
  }
  
  .second-row .el-col,
  .third-row .el-col {
    span: 24;
    margin-bottom: 15px;
  }
  
  .quick-actions {
    gap: 15px;
  }
  
  .action-item {
    width: 100px;
    height: 90px;
  }
}
</style>
