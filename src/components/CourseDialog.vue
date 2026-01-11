<template>
  <el-dialog
    v-model="visible"
    :title="formData.id ? '编辑课程' : '新增课程'"
    width="700px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="form.courseName" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="课程编号" prop="courseCode">
        <el-input v-model="form.courseCode" placeholder="请输入课程编号" />
      </el-form-item>
      <el-form-item label="授课教师ID" prop="teacherId">
        <el-input-number v-model="form.teacherId" :min="1" placeholder="请输入授课教师ID" style="width: 100%" />
      </el-form-item>
      <el-form-item label="课程学分" prop="credit">
        <el-input-number v-model="form.credit" :min="0" :max="10" :precision="1" placeholder="请输入课程学分" style="width: 100%" />
      </el-form-item>
      <el-form-item label="课程学时" prop="hours">
        <el-input-number v-model="form.hours" :min="0" placeholder="请输入课程学时" style="width: 100%" />
      </el-form-item>
      <el-form-item label="课程类型" prop="courseType">
        <el-select 
          v-model="form.courseType" 
          placeholder="请选择课程类型" 
          style="width: 100%"
          clearable
          popper-append-to-body
        >
          <el-option label="必修" value="必修" />
          <el-option label="选修" value="选修" />
        </el-select>
      </el-form-item>
      <el-form-item label="上课地点" prop="location">
        <el-input v-model="form.location" placeholder="请输入上课地点" />
      </el-form-item>
      <el-form-item label="上课时间" prop="schedule">
        <el-input v-model="form.schedule" placeholder="请输入上课时间，如：周一 8:00-10:00" />
      </el-form-item>
      <el-form-item label="学期" prop="semester">
        <el-input v-model="form.semester" placeholder="请输入学期，如：2024-2025-1" />
      </el-form-item>
      <el-form-item label="课程描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入课程描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { courseApi } from '../api'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  formData: Object
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  courseName: '',
  courseCode: '',
  teacherId: null,
  credit: null,
  hours: null,
  courseType: '',
  location: '',
  schedule: '',
  semester: '',
  description: ''
})

const rules = {
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  courseCode: [{ required: true, message: '请输入课程编号', trigger: 'blur' }],
  credit: [{ required: true, message: '请输入课程学分', trigger: 'blur' }],
  hours: [{ required: true, message: '请输入课程学时', trigger: 'blur' }]
}

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.formData) {
    Object.assign(form, props.formData)
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
  Object.keys(form).forEach(key => {
    if (key === 'id' || key === 'teacherId' || key === 'credit' || key === 'hours') {
      form[key] = null
    } else {
      form[key] = ''
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const api = form.id ? courseApi.update : courseApi.save
        const res = await api(form)
        if (res.code === '200') {
          ElMessage.success(form.id ? '更新成功' : '新增成功')
          emit('success')
          handleClose()
        }
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

