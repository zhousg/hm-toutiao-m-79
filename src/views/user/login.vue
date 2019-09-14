<template>
  <div class="page-login">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登 录"></van-nav-bar>
    <van-cell-group>
      <van-field @blur="checkMobile()" v-model.trim="loginForm.mobile" label="手机号" :error-message="errMsg.mobile" placeholder="请输入手机号" />
      <van-field @blur="checkCode()" v-model.trim="loginForm.code" label="验证码" :error-message="errMsg.code" placeholder="请输入验证码">
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" @click="login()" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
// 第一：绑定错误信息
// 第二：绑定表单数据
// 第三：当失去焦点后 对当前表单元素的数据进行校验
// 获取数据--->校验格式校验是否素输入---> 错误 给绑定错误属性赋值  成功 清除对应的值
// 第四：当点击登录  对整个表单进行校验
// 校验所有的表单元素，校验后如果有错误信息，校验失败，如果没有错误信息，校验成功  发请求
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 错误数据：
      errMsg: {
        mobile: '',
        code: ''
      },
      // 表单数据
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号格式错误'
        return false
      }
      this.errMsg.mobile = ''
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码6个数字'
        return false
      }
      this.errMsg.code = ''
    },
    ...mapMutations(['setUser']),
    async login () {
      // 校验所有的表单
      this.checkMobile()
      this.checkCode()
      // 对错误信息进行判断
      if (this.errMsg.mobile || this.errMsg.code) return false
      // 校验成功
      try {
        // 进行登录
        const data = await login(this.loginForm)
        // 成功
        // 1. 提示
        this.$toast({ type: 'success', message: '登录成功' })
        // 2. 存储token
        this.setUser(data)
        // 3. 跳转  （如果有来源地址，回跳来源地址，如果没有：默认进入 我的  个人中心首页）
        const url = this.$route.query.redirect || '/user'
        this.$router.push(url)
      } catch (e) {
        // 4. 错误提示
        this.$toast({ type: 'fail', message: '登录失败' })
      }
    }
  }
}
</script>

<style scoped lang='less'>
.p5{
  padding: 0 5px;
}
.btn_box{
  padding: 10px;
  .van-button{
    height: 32px;
    line-height: 30px;
  }
}
</style>
