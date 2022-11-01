<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/Wayne.jpg" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :rules="rules"
        ref="loginFormRef"
        :model="form"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password"
            ><i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from "@/api/index";
export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      // 这是表单的验证规则对象
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetForm(loginFormRef) {
      this.$refs[loginFormRef].resetFields();
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        // 原生直接发送请求
        // const { data: res } = await this.$http.post("login", this.form);
        const { data: res } = await loginAPI(this.form);
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message({
            message: "登录失败",
            type: "error",
          });
        else {
          this.$message({
            message: "登录成功",
            type: "success",
          });
          /* 
          1. 将登录成功之后的token，保存到客户端的sessionStorage中
            1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
          2. 通过编程式导航跳转到后台主页，路由地址是 /home
          */
          window.localStorage.setItem("token", res.data.token);
          this.$router.replace("/home");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #29323c;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

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