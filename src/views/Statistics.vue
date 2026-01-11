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

    <!-- 学生评估等级统计 -->
    <el-card class="evaluation-card" shadow="hover" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <div style="display: flex; align-items: center;">
            <el-icon class="header-icon" :size="20" style="color: #E6A23C"><DataAnalysis /></el-icon>
            <span>学生评估等级统计</span>
          </div>
          <el-button-group>
            <el-button type="success" :icon="Download" @click="exportToExcel" :loading="exporting">
              导出Excel
            </el-button>
            <el-button type="primary" :icon="Document" @click="exportToPDF" :loading="exporting">
              导出PDF
            </el-button>
          </el-button-group>
        </div>
      </template>
      <el-form :inline="true" :model="evaluationFilter" class="filter-form">
        <el-form-item label="学期">
          <el-select 
            v-model="evaluationFilter.semester" 
            placeholder="请选择学期" 
            clearable
            style="width: 250px"
            @change="loadEvaluationLevelStats"
          >
            <el-option 
              v-for="semester in semesterOptions" 
              :key="semester.value" 
              :label="semester.label" 
              :value="semester.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select 
            v-model="evaluationFilter.classId" 
            placeholder="请选择班级" 
            clearable
            filterable
            style="width: 250px"
            :loading="classLoading"
            @change="loadEvaluationLevelStats"
          >
            <el-option 
              v-for="classItem in classList" 
              :key="classItem.id" 
              :label="classItem.className" 
              :value="classItem.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadEvaluationLevelStats">查询</el-button>
          <el-button @click="handleResetEvaluationFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="chart-container">
        <div v-if="evaluationLevelStats.total > 0" ref="chartRef" style="width: 100%; height: 400px;"></div>
        <el-empty v-else description="暂无数据" :image-size="100" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { statisticsApi, classApi } from '../api'
import { School, UserFilled, Reading, Calendar, Document, Clock, Loading, CircleCheck, DataAnalysis, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

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

// 评估等级统计
const evaluationFilter = reactive({
  semester: '',
  classId: null
})

const evaluationLevelStats = reactive({
  优秀: 0,
  良好: 0,
  中等: 0,
  及格: 0,
  不及格: 0,
  total: 0
})

const chartRef = ref(null)
let chartInstance = null
let resizeHandler = null
const exporting = ref(false)

const classList = ref([])
const classLoading = ref(false)

// 生成学期选项
const generateSemesterOptions = () => {
  const options = []
  for (let year = 2020; year <= 2026; year++) {
    options.push({
      label: `${year}-${year + 1}-1（${year}-${year + 1}学年第一学期）`,
      value: `${year}-${year + 1}-1`
    })
    options.push({
      label: `${year}-${year + 1}-2（${year}-${year + 1}学年第二学期）`,
      value: `${year}-${year + 1}-2`
    })
  }
  return options
}

const semesterOptions = ref(generateSemesterOptions())

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

// 加载班级列表
const loadClasses = async () => {
  classLoading.value = true
  try {
    const res = await classApi.getPage({ current: 1, size: 1000 })
    if (res.code === '200' && res.data) {
      classList.value = res.data.records || []
    }
  } catch (error) {
    console.error('加载班级列表失败:', error)
  } finally {
    classLoading.value = false
  }
}

// 加载评估等级统计
const loadEvaluationLevelStats = async () => {
  try {
    const params = {}
    if (evaluationFilter.semester) {
      params.semester = evaluationFilter.semester
    }
    if (evaluationFilter.classId) {
      params.classId = evaluationFilter.classId
    }
    const res = await statisticsApi.getEvaluationLevelStats(params)
    if (res.code === '200' && res.data) {
      Object.assign(evaluationLevelStats, res.data)
      await nextTick()
      renderChart()
    }
  } catch (error) {
    console.error('获取评估等级统计失败:', error)
  }
}

// 重置评估筛选
const handleResetEvaluationFilter = () => {
  evaluationFilter.semester = ''
  evaluationFilter.classId = null
  loadEvaluationLevelStats()
}

// 获取当前筛选条件的文本描述
const getFilterDescription = () => {
  let desc = '全部数据'
  const parts = []
  if (evaluationFilter.semester) {
    const semester = semesterOptions.value.find(s => s.value === evaluationFilter.semester)
    parts.push(`学期：${semester ? semester.label : evaluationFilter.semester}`)
  }
  if (evaluationFilter.classId) {
    const classItem = classList.value.find(c => c.id === evaluationFilter.classId)
    parts.push(`班级：${classItem ? classItem.className : '未知'}`)
  }
  if (parts.length > 0) {
    desc = parts.join('，')
  }
  return desc
}

// 导出Excel
const exportToExcel = async () => {
  if (evaluationLevelStats.total === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  exporting.value = true
  try {
    // 动态导入xlsx
    const XLSX = await import('xlsx').catch(() => null)
    if (!XLSX) {
      ElMessage.error('xlsx模块未安装，请运行: npm install xlsx html2canvas jspdf')
      exporting.value = false
      return
    }
    
    // 准备数据（过滤掉值为0的项）
    const levelData = [
      { name: '优秀', value: evaluationLevelStats.优秀 },
      { name: '良好', value: evaluationLevelStats.良好 },
      { name: '中等', value: evaluationLevelStats.中等 },
      { name: '及格', value: evaluationLevelStats.及格 },
      { name: '不及格', value: evaluationLevelStats.不及格 }
    ].filter(item => item.value > 0)
    
    const data = [
      ['学生评估等级统计报表'],
      ['生成时间', new Date().toLocaleString('zh-CN')],
      ['筛选条件', getFilterDescription()],
      [],
      ['评估等级', '数量', '占比'],
      ...levelData.map(item => [
        item.name,
        item.value,
        evaluationLevelStats.total > 0 ? ((item.value / evaluationLevelStats.total * 100).toFixed(2) + '%') : '0%'
      ]),
      [],
      ['总计', evaluationLevelStats.total, '100%']
    ]
    
    // 创建 workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(data)
    
    // 设置列宽
    ws['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 }
    ]
    
    // 添加工作表
    XLSX.utils.book_append_sheet(wb, ws, '评估等级统计')
    
    // 生成文件名
    const fileName = `学生评估等级统计_${new Date().toISOString().split('T')[0]}.xlsx`
    
    // 导出
    XLSX.writeFile(wb, fileName)
    
    ElMessage.success('Excel导出成功')
  } catch (error) {
    console.error('导出Excel失败:', error)
    ElMessage.error('导出Excel失败，请确保已安装xlsx依赖')
  } finally {
    exporting.value = false
  }
}

// 导出PDF
const exportToPDF = async () => {
  if (evaluationLevelStats.total === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  exporting.value = true
  try {
    // 动态导入html2canvas和jspdf
    const html2canvasModule = await import('html2canvas').catch(() => null)
    const jsPDFModule = await import('jspdf').catch(() => null)
    
    if (!html2canvasModule || !jsPDFModule) {
      ElMessage.error('PDF导出依赖未安装，请运行: npm install html2canvas jspdf')
      exporting.value = false
      return
    }
    
    const html2canvas = html2canvasModule.default
    const jsPDF = jsPDFModule.default
    
    // 创建临时容器
    const container = document.createElement('div')
    container.style.width = '800px'
    container.style.padding = '20px'
    container.style.backgroundColor = '#fff'
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    document.body.appendChild(container)
    
    // 创建报表内容
    const content = `
      <div style="font-family: 'Microsoft YaHei', Arial, sans-serif;">
        <h1 style="text-align: center; color: #303133; margin-bottom: 10px;">学生评估等级统计报表</h1>
        <div style="text-align: center; color: #909399; margin-bottom: 30px; font-size: 14px;">
          <div>生成时间：${new Date().toLocaleString('zh-CN')}</div>
          <div style="margin-top: 5px;">筛选条件：${getFilterDescription()}</div>
        </div>
        <div style="margin-bottom: 30px;">
          <h2 style="color: #303133; border-bottom: 2px solid #409EFF; padding-bottom: 10px;">统计数据</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f5f7fa;">
                <th style="border: 1px solid #dcdfe6; padding: 12px; text-align: left; font-weight: bold;">评估等级</th>
                <th style="border: 1px solid #dcdfe6; padding: 12px; text-align: center; font-weight: bold;">数量</th>
                <th style="border: 1px solid #dcdfe6; padding: 12px; text-align: center; font-weight: bold;">占比</th>
              </tr>
            </thead>
            <tbody>
              ${[
                { name: '优秀', value: evaluationLevelStats.优秀, color: '#67C23A' },
                { name: '良好', value: evaluationLevelStats.良好, color: '#409EFF' },
                { name: '中等', value: evaluationLevelStats.中等, color: '#E6A23C' },
                { name: '及格', value: evaluationLevelStats.及格, color: '#909399' },
                { name: '不及格', value: evaluationLevelStats.不及格, color: '#F56C6C' }
              ].filter(item => item.value > 0).map(item => `
                <tr>
                  <td style="border: 1px solid #dcdfe6; padding: 12px; color: ${item.color}; font-weight: bold;">${item.name}</td>
                  <td style="border: 1px solid #dcdfe6; padding: 12px; text-align: center;">${item.value}</td>
                  <td style="border: 1px solid #dcdfe6; padding: 12px; text-align: center;">${evaluationLevelStats.total > 0 ? ((item.value / evaluationLevelStats.total * 100).toFixed(2) + '%') : '0%'}</td>
                </tr>
              `).join('')}
              <tr style="background-color: #f5f7fa; font-weight: bold;">
                <td style="border: 1px solid #dcdfe6; padding: 12px;">总计</td>
                <td style="border: 1px solid #dcdfe6; padding: 12px; text-align: center;">${evaluationLevelStats.total}</td>
                <td style="border: 1px solid #dcdfe6; padding: 12px; text-align: center;">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `
    
    container.innerHTML = content
    
    // 等待渲染
    await nextTick()
    
    // 转换为canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    
    // 创建PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // 生成文件名
    const fileName = `学生评估等级统计_${new Date().toISOString().split('T')[0]}.pdf`
    
    // 导出
    pdf.save(fileName)
    
    // 清理
    document.body.removeChild(container)
    
    ElMessage.success('PDF导出成功')
  } catch (error) {
    console.error('导出PDF失败:', error)
    ElMessage.error('导出PDF失败，请确保已安装相关依赖')
  } finally {
    exporting.value = false
  }
}

// 渲染饼状图
const renderChart = () => {
  if (!chartRef.value) {
    console.warn('图表容器不存在')
    return
  }
  
  // 如果图表实例已存在，先销毁
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  // 重新初始化图表
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    title: {
      text: '学生评估等级占比',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '评估等级',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}\n({d}%)'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: evaluationLevelStats.优秀, name: '优秀', itemStyle: { color: '#67C23A' } },
          { value: evaluationLevelStats.良好, name: '良好', itemStyle: { color: '#409EFF' } },
          { value: evaluationLevelStats.中等, name: '中等', itemStyle: { color: '#E6A23C' } },
          { value: evaluationLevelStats.及格, name: '及格', itemStyle: { color: '#909399' } },
          { value: evaluationLevelStats.不及格, name: '不及格', itemStyle: { color: '#F56C6C' } }
        ].filter(item => item.value > 0) // 过滤掉值为0的项
      }
    ]
  }
  
  chartInstance.setOption(option, true) // 使用true参数进行不合并的更新
  
  // 响应式调整 - 先移除旧的监听器
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  
  resizeHandler = () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
  window.addEventListener('resize', resizeHandler)
}

// 监听数据变化，自动更新图表
watch(() => evaluationLevelStats.total, () => {
  if (evaluationLevelStats.total > 0) {
    nextTick(() => {
      renderChart()
    })
  }
}, { immediate: false })

onMounted(async () => {
  await loadOverview()
  await loadActivityStats()
  await loadPlanStats()
  await loadClasses()
  await loadEvaluationLevelStats()
})

// 组件卸载时清理图表实例
onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
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
  justify-content: space-between;
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

.evaluation-card {
  border-radius: 8px;
}

.filter-form {
  margin-bottom: 20px;
}

.chart-container {
  margin-top: 20px;
}
</style>
