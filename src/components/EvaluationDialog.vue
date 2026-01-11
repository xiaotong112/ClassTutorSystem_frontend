<template>
  <el-dialog
    v-model="visible"
    :title="formData.id ? '编辑评估' : '新增评估'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="学生ID" prop="studentId">
        <el-input-number v-model="form.studentId" :min="1" placeholder="请输入学生ID" style="width: 100%" />
      </el-form-item>
      <el-form-item label="评估类型" prop="evaluationType">
        <el-select 
          v-model="form.evaluationType" 
          placeholder="请选择评估类型" 
          style="width: 100%"
          clearable
          popper-append-to-body
        >
          <el-option label="学习" value="学习" />
          <el-option label="品德" value="品德" />
          <el-option label="活动参与" value="活动参与" />
        </el-select>
      </el-form-item>
      <el-form-item label="评估分数" prop="score">
        <el-input-number v-model="form.score" :min="0" :max="100" :precision="2" placeholder="请输入评估分数" style="width: 100%" />
      </el-form-item>
      <el-form-item label="评估等级" prop="level">
        <el-select 
          v-model="form.level" 
          placeholder="请选择评估等级" 
          style="width: 100%"
          clearable
          popper-append-to-body
        >
          <el-option label="优秀" value="优秀" />
          <el-option label="良好" value="良好" />
          <el-option label="中等" value="中等" />
          <el-option label="及格" value="及格" />
          <el-option label="不及格" value="不及格" />
        </el-select>
      </el-form-item>
      <el-form-item label="学期" prop="semester">
        <el-input v-model="form.semester" placeholder="请输入学期，如：2024-2025-1" />
      </el-form-item>
      <el-form-item label="评估内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入评估内容"
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
import { evaluationApi } from '../api'
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
  studentId: null,
  evaluationType: '',
  score: null,
  level: '',
  semester: '',
  content: ''
})

const rules = {
  studentId: [{ required: true, message: '请输入学生ID', trigger: 'blur' }],
  evaluationType: [{ required: true, message: '请选择评估类型', trigger: 'change' }],
  score: [{ required: true, message: '请输入评估分数', trigger: 'blur' }],
  level: [{ required: true, message: '请选择评估等级', trigger: 'change' }],
  semester: [{ required: true, message: '请输入学期', trigger: 'blur' }]
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
    if (key === 'id' || key === 'studentId' || key === 'score') {
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
        const api = form.id ? evaluationApi.update : evaluationApi.save
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

