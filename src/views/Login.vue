<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">班导师管理系统</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="register-link">
            还没有账号？
            <el-link type="primary" @click="goToRegister">立即注册</el-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const success = await userStore.login(loginForm)
        if (success) {
          ElMessage.success('登录成功')
          router.push('/')
        } else {
          ElMessage.error('登录失败，请检查用户名和密码')
        }
      } catch (error) {
        ElMessage.error('登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-sizing: border-box;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 30px 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
  font-size: 22px;
  font-weight: 500;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
}

.register-link {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #606266;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
    align-items: flex-start;
    padding-top: 20vh;
  }
  
  .login-box {
    padding: 25px 15px;
  }
  
  .title {
    font-size: 20px;
    margin-bottom: 25px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .login-box {
    padding: 20px 15px;
  }
  
  .title {
    font-size: 18px;
    margin-bottom: 20px;
  }
}
</style>

