import request from './request'

// 用户相关
export const userApi = {
  login: (data) => request.post('/user/login', data),
  register: (data) => request.post('/user/register', data),
  getUserInfo: (id) => request.get(`/user/query?id=${id}`)
}

// 班级相关
export const classApi = {
  getPage: (params) => request.get('/class/page', { params }),
  getById: (id) => request.get(`/class/${id}`),
  save: (data) => request.post('/class', data),
  update: (data) => request.put('/class', data),
  delete: (id) => request.delete(`/class/${id}`)
}

// 学生相关
export const studentApi = {
  getPage: (params) => request.get('/student/page', { params }),
  getById: (id) => request.get(`/student/${id}`),
  save: (data) => request.post('/student', data),
  update: (data) => request.put('/student', data),
  delete: (id) => request.delete(`/student/${id}`)
}

// 课程相关
export const courseApi = {
  getPage: (params) => request.get('/course/page', { params }),
  getById: (id) => request.get(`/course/${id}`),
  save: (data) => request.post('/course', data),
  update: (data) => request.put('/course', data),
  delete: (id) => request.delete(`/course/${id}`)
}

// 活动相关
export const activityApi = {
  getPage: (params) => request.get('/activity/page', { params }),
  getById: (id) => request.get(`/activity/${id}`),
  save: (data) => request.post('/activity', data),
  update: (data) => request.put('/activity', data),
  delete: (id) => request.delete(`/activity/${id}`)
}

// 计划相关
export const planApi = {
  getPage: (params) => request.get('/plan/page', { params }),
  getById: (id) => request.get(`/plan/${id}`),
  save: (data) => request.post('/plan', data),
  update: (data) => request.put('/plan', data),
  delete: (id) => request.delete(`/plan/${id}`),
  updateProgress: (id, progress) => request.put(`/plan/progress/${id}`, null, { params: { progress } })
}

// 评估相关
export const evaluationApi = {
  getPage: (params) => request.get('/evaluation/page', { params }),
  getById: (id) => request.get(`/evaluation/${id}`),
  save: (data) => request.post('/evaluation', data),
  update: (data) => request.put('/evaluation', data),
  delete: (id) => request.delete(`/evaluation/${id}`)
}

// 统计相关
export const statisticsApi = {
  getOverview: () => request.get('/statistics/overview'),
  getClassStudentStats: (classId) => request.get('/statistics/class/student', { params: { classId } }),
  getActivityStats: () => request.get('/statistics/activity'),
  getPlanStats: () => request.get('/statistics/plan')
}

