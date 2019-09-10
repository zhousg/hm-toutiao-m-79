<template>
  <div class="container">
    <van-nav-bar v-if="active!=='/user'" fixed title="黑马头条" right-text="搜索" @click-right="$router.push('/search')" />
    <div class="my-wrapper" :class="{noTop:active==='/user'}">
      <!-- 二级路由 视图位置 -->
      <router-view></router-view>
    </div>
    <!-- route 开启路由模式 -->
    <van-tabbar :value="active" route>
      <!-- to="/" 点击后跳转的地址  -->
      <van-tabbar-item name="/" to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="/question" to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item name="/video" to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item name="/user" to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  // data () {
  //   return {
  //     // van-tabbar-item name 的值
  //     active: this.$route.path  //当前路径
  //   }
  // }
  // 当去切换二级路由组件的时候 ，当前组件Layout是没有重新初始化的， data中的数据不会变化
  // 计算属性：当依赖的数据变化的时候 自己也会变化
  // 当然你可以不是有  模版内需要使用 $route.path
  computed: {
    active () {
      return this.$route.path
    }
  }
}
</script>

<style lang='less'>
// 去掉scoped 目的让样式在全局生效
// noTop 没有上内边距
// 我的 界面特殊  是没有导航栏   不需要上内边距
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
