<template>
  <el-dialog
    v-model="visible"
    :title="formData.id ? '编辑计划' : '新增计划'"
    width="700px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="计划名称" prop="planName">
        <el-input v-model="form.planName" placeholder="请输入计划名称" />
      </el-form-item>
      <el-form-item label="计划类型" prop="planType">
        <el-select 
          v-model="form.planType" 
          placeholder="请选择计划类型" 
          style="width: 100%"
          clearable
          popper-append-to-body
        >
          <el-option label="学习计划" value="学习计划" />
          <el-option label="活动计划" value="活动计划" />
          <el-option label="培养计划" value="培养计划" />
        </el-select>
      </el-form-item>
      <el-form-item label="制定者ID" prop="creatorId">
        <el-input-number v-model="form.creatorId" :min="1" placeholder="请输入制定者ID" style="width: 100%" />
      </el-form-item>
      <el-form-item label="关联班级ID" prop="classId">
        <el-input-number v-model="form.classId" :min="1" placeholder="请输入关联班级ID" style="width: 100%" />
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          placeholder="选择开始日期"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          placeholder="选择结束日期"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="计划进度" prop="progress">
        <el-slider v-model="form.progress" :min="0" :max="100" show-input />
      </el-form-item>
      <el-form-item label="计划状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">未开始</el-radio>
          <el-radio :label="1">进行中</el-radio>
          <el-radio :label="2">已完成</el-radio>
          <el-radio :label="3">已取消</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计划目标" prop="goal">
        <el-input v-model="form.goal" placeholder="请输入计划目标" />
      </el-form-item>
      <el-form-item label="计划内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入计划内容"
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
import { planApi } from '../api'
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
  planName: '',
  planType: '',
  creatorId: null,
  classId: null,
  startDate: '',
  endDate: '',
  progress: 0,
  status: 0,
  goal: '',
  content: ''
})

const rules = {
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  planType: [{ required: true, message: '请选择计划类型', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }]
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
    if (key === 'id' || key === 'creatorId' || key === 'classId') {
      form[key] = null
    } else if (key === 'progress' || key === 'status') {
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
        const api = form.id ? planApi.update : planApi.save
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

