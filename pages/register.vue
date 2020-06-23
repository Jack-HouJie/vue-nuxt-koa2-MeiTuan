<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/"
           class="site-logo" />
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <!-- 使用el-ui 按钮 -->
            <el-button type="primary"
                       size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <!-- 使用el-ui表单 -->
      <!-- rules为校验规则 -->
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="昵称"
                      prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="ruleForm.email" />
          <el-button size="mini"
                     round
                     @click="sendMsg">发送验证码</el-button>
          <!-- 提示信息 -->
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码"
                      prop="code">
          <el-input v-model="ruleForm.code"
                    maxlength="4" />
        </el-form-item>
        <el-form-item label="密码"
                      prop="pwd">
          <el-input v-model="ruleForm.pwd"
                    type="password" />
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="cpwd">
          <el-input v-model="ruleForm.cpwd"
                    type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="register">同意以下协议并注册</el-button>
          <!-- 错误提示 -->
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a class="f1"
             href="http://www.meituan.com/about/terms"
             target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js' // 用于密码加密
import axios from 'axios'
export default {
  // 使用blank模版
  layout: 'blank',
  data () {
    return {
      statusMsg: '',
      error: '',
      ruleForm: {
        name: '',
        code: '',
        pwd: '',
        cpwd: '',
        email: ''
      },
      // 定义验证规则数据
      rules: {
        name: [{
          // 必选项
          required: true,
          type: 'string',
          // 提示信息
          message: '请输入昵称',
          // 触发校验时机
          trigger: 'blur'
        }],
        email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        }],
        cpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          // 自定义验证函数
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 发送验证码
    sendMsg: function () {
      const self = this;
      let namePass
      let emailPass
      if (self.timerid) {
        return false
      }
      // 使用el-ui提供的API实现验证逻辑
      this.$refs['ruleForm'].validateField('name', (valid) => {
        namePass = valid
      })
      self.statusMsg = ''
      // 如果验证失败
      if (namePass) {
        return false
      }
      this.$refs['ruleForm'].validateField('email', (valid) => {
        emailPass = valid
      })
      // 如果都验证成功
      if (!namePass && !emailPass) {
        // 通过axios发送Ajax请求
        // 使用.then()语法，也可以用async await语法
        self.$axios.post('/users/verify', {
          // 设置接口需要的参数
          // 中文进行URI编码
          username: encodeURIComponent(self.ruleForm.name),
          email: self.ruleForm.email
        }).then(({ status, data }) => {
          // 如果响应状态成功
          if (status === 200 && data && data.code === 0) {
            let count = 60;
            self.statusMsg = `验证码已发送,剩余${count--}秒`
            // 1秒刷新一次时间
            self.timerid = setInterval(function () {
              self.statusMsg = `验证码已发送,剩余${count--}秒`
              // 如果60秒
              if (count === 0) {
                // 取消延时调用
                clearInterval(self.timerid)
                self.timerid = null
                self.statusMsg = ''
              }
            }, 1000)
          } else {
            self.statusMsg = data.msg
          }
        })
      }
    },
    // 注册
    register: function () {
      let self = this;
      // el-ui提供的输入验证API
      this.$refs['ruleForm'].validate((valid) => {
        // 如果验证通过
        if (valid) {
          // 发送注册请求
          self.$axios.post('/users/signup', {
            // 设置post请求参数
            // 用户名中文编码
            username: window.encodeURIComponent(self.ruleForm.name),
            // password-MD5处理之后会返回一个数组，保存多个值
            // 于是需要toString()函数
            password: CryptoJS.MD5(self.ruleForm.pwd).toString(),
            email: self.ruleForm.email,
            code: self.ruleForm.code
          }).then(({ status, data }) => {
            // 如果响应正常
            if (status === 200) {
              // 如果data正常
              if (data && data.code === 0) {
                // 强制跳转到登录页面
                location.href = '/login'
              } else {
                self.error = data.msg
              }
            } else {
              self.error = `服务器出错，错误码:${status}`
            }
            // 定时清空error（防止error一直存在造成误导）
            setTimeout(function () {
              self.error = ''
            }, 1500)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/register/index.scss';
</style>
