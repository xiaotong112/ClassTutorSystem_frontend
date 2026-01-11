<template>
  <el-dialog
    v-model="visible"
    :title="formData.id ? '编辑班级' : '新增班级'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="班级名称" prop="className">
        <el-input v-model="form.className" placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item label="班级编号" prop="classCode">
        <el-input v-model="form.classCode" placeholder="请输入班级编号" />
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-input v-model="form.grade" placeholder="请输入年级" />
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="form.major" placeholder="请输入专业" />
      </el-form-item>
      <el-form-item label="班导师ID" prop="teacherId">
        <el-input-number v-model="form.teacherId" :min="1" placeholder="请输入班导师ID" style="width: 100%" />
      </el-form-item>
      <el-form-item label="学生人数" prop="studentCount">
        <el-input-number v-model="form.studentCount" :min="0" placeholder="请输入学生人数" style="width: 100%" />
      </el-form-item>
      <el-form-item label="班级描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入班级描述"
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
import { classApi } from '../api'
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
  className: '',
  classCode: '',
  grade: '',
  major: '',
  teacherId: null,
  studentCount: 0,
  description: ''
})

const rules = {
  className: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  classCode: [{ required: true, message: '请输入班级编号', trigger: 'blur' }]
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
    if (key === 'id') {
      form[key] = null
    } else if (key === 'studentCount') {
      form[key] = 0
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
        const api = form.id ? classApi.update : classApi.save
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

