<!-- login -->
<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
       <!-- 表单 -->
      <el-form ref="loginFormRef" label-width="0px" class="login-form" :model="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '../api/login'
import { setStorage } from '../utils/localstorage'
export default {
  props: {

  },
  data () {
    return {
      loginForm: {
        username: 'wq',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入登陆用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    restLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login(this.loginForm).then(res => {
            if (res.status === 1) {
              // 存储登陆用户信息
              setStorage('user_key', JSON.stringify(res.data))
              this.$message.success(res.message)
              setStorage('token', res.token)
              this.$router.push('/home')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
    .login_box{
      width: 450px;
      height: 300px;
      background: #fff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background:#fff;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background:#eee;
        }
      }
    }
    .login-form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
