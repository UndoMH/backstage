<template>
  <div id="login" class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../../src/assets/logo.png">
      </div>
        <!--登录表单-->
        <el-form  :model="loginForm"
                  :rules="loginFormRules"
                  ref="loginFormRef"
                  label-width="0px" class="login_form">
          <!--用户名-->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password"
                      prefix-icon="iconfont icon-3702mima"
                      type="password"></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="loginFormReset">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginFormRules: {
          username: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符之间', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      loginFormReset() {
        this.$refs.loginFormRef.resetFields()
      },
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if(!valid) return;
          const {data} = await this.$http.post('login', this.loginForm)
          if(data.meta.status !== 200) return this.$message.error('登录失败')
          this.$message.success('登录成功')
          /*
          * 将登录成功后的token保存到客户端sessionStorage中
          * 在进入其他API接口之前必须先进行登录
          * token只应在当前网站打开时生效，所以token保存在sessionStorage中
          * */

          window.sessionStorage.setItem('token', data.data.token)
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50% ,-50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>