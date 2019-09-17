<template>
  <div id="app">
    <!-- 一级路由  视图位置 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less"></style>
