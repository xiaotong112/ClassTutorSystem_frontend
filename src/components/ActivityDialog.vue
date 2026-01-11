<template>
  <el-dialog
    v-model="visible"
    :title="formData.id ? '编辑活动' : '新增活动'"
    width="700px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="活动名称" prop="activityName">
        <el-input v-model="form.activityName" placeholder="请输入活动名称" />
      </el-form-item>
      <el-form-item label="活动类型" prop="activityType">
        <el-select 
          v-model="form.activityType" 
          placeholder="请选择活动类型" 
          style="width: 100%"
          clearable
          popper-append-to-body
        >
          <el-option label="学术" value="学术" />
          <el-option label="文体" value="文体" />
          <el-option label="社会实践" value="社会实践" />
        </el-select>
      </el-form-item>
      <el-form-item label="组织者ID" prop="organizerId">
        <el-input-number v-model="form.organizerId" :min="1" placeholder="请输入组织者ID" style="width: 100%" />
      </el-form-item>
      <el-form-item label="参与班级ID" prop="classId">
        <el-input-number v-model="form.classId" :min="1" placeholder="请输入参与班级ID" style="width: 100%" />
      </el-form-item>
      <el-form-item label="活动地点" prop="location">
        <el-input v-model="form.location" placeholder="请输入活动地点" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择开始时间"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择结束时间"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">未开始</el-radio>
          <el-radio :label="1">进行中</el-radio>
          <el-radio :label="2">已结束</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参与人数" prop="participantCount">
        <el-input-number v-model="form.participantCount" :min="0" placeholder="请输入参与人数" style="width: 100%" />
      </el-form-item>
      <el-form-item label="活动描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入活动描述"
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
import { activityApi } from '../api'
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
  activityName: '',
  activityType: '',
  organizerId: null,
  classId: null,
  location: '',
  startTime: '',
  endTime: '',
  status: 0,
  participantCount: 0,
  description: ''
})

const rules = {
  activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
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
    if (key === 'id' || key === 'organizerId' || key === 'classId') {
      form[key] = null
    } else if (key === 'status') {
      form[key] = 0
    } else if (key === 'participantCount') {
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
        const api = form.id ? activityApi.update : activityApi.save
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

