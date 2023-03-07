<template>
  <div class="login-container">
    <div class="login-logo">
      <img src="@/assets/logo.png" alt="欧药师" width="90px" height="90px">
    </div>
    <div class="login-content-box">
      <div class="login-content">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
                 label-position="left">
          <div class="title-container">
            <p class="title">Welcome landing</p>
            <p class="title">心药数字管理平台</p>
          </div>

          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名登录"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"/>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-checkbox v-model="checked" class="rememberme">记住用户名</el-checkbox>
          </el-form-item>
          <el-button :loading="loading" type="primary" class="login-btn"
                     @click.native.prevent="handleLogin">登录
          </el-button>
        </el-form>
      </div>
      <div class="login-middle"></div>
      <div class="login-bottom"></div>
    </div>
  </div>
</template>

<script>
import {validUsername} from '@/utils/validate'
import Cookies from 'js-cookie';

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入用户名！'))
      } else {
        callback()
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入密码！'))
      } else {
        callback()
      }
    };
    return {
      loginForm: {
        username: Cookies.get('username'),
        password: Cookies.get('password'),
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      checked: true,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.checked) {
            Cookies.set('username', this.loginForm.username);
            Cookies.set('password', this.loginForm.password);
          }
          this.loading = true;
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({path: this.redirect || '/'});
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!');
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$light_gray: #333333;
$font-size:18px;
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;

    input {
      font-size: $font-size;
      font-weight: 500;
      border: 0px;
      border-radius: 0px;
      border-bottom: 1px solid #D8D8D8;
      -webkit-appearance: none;
      padding: 12px 0px 16px 0px;
      color: $light_gray;
      height: 47px;
      width: 320px;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
        -webkit-text-fill-color: $light_gray !important;
      }
      &:-webkit-autofill::first-line{
        font-size: $font-size;
      }

      &::-webkit-input-placeholder {
        font-size: $font-size;
        font-weight: 500;
      }
    }
  }

  .el-form-item {
    width: 320px;
  }
}
</style>

<style lang="scss" scoped>
$bg: transparent;
$dark_gray: #889aa4;
$light_gray: #333333;
$content_bg_width: 900px;
$content_bg_height: 580px;

.login-container {
  min-height: 100%;
  width: 100%;
  background: $bg url(../../assets/background.jpg) no-repeat;
  background-size: cover;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .login-logo {
    position: absolute;
    top: 40px;
    right: 40px;
  }

  .login-content-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .login-content {
      width: $content_bg_width;
      height: $content_bg_height;
      background: $bg url(../../assets/bottom.jpg) no-repeat;
      background-size:$content_bg_width $content_bg_height;
      border-radius: 28px;
      z-index: 999999;
      .login-form {
        flex-grow: 1;
        float: left;
        width: 500px;
        max-width: 100%;
        height: 100%;
        padding: 49px 0px 0px 60px;
        margin: 0 auto;
        overflow: hidden;
      }

      .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .title-container {
        position: relative;

        .title {
          font-size: 38px;
          line-height: 59px;
          font-weight: bold;
          letter-spacing: 1px;
          color: $light_gray;
          margin: 0px 0px 10px 0px;

          &:last-child {
            font-size: 30px;
            margin-bottom: 60px;
          }
        }


      }

      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }

      .login-btn {
        flex-shrink: 0;
        width: 130px;
        background: #3060FF;
        border-radius: 28px;
        font-size: 18px;
        font-weight: 500;
        margin-top: 60px;
      }
    }

    .login-middle {
      width: $content_bg_width - 48px;
      height: 580px;
      background: #9CBEFE;
      border-radius: 28px;
      position: absolute;
      top: 15px;
      z-index: 999;
    }

    .login-bottom {
      width: $content_bg_width - 92px;
      height: 580px;
      background: #72A4FE;
      border-radius: 28px;
      position: absolute;
      top: 31px;
    }
  }
}


</style>
