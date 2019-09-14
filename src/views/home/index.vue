<template>
  <div class="container">
    <van-tabs swipeable>
      <van-tab v-for="index in 8" :title="'标签 ' + index" :key="index">
        <!-- 一个内容可以滚动的容器（记录浏览的位置） -->
        <div class="scroll-wrapper">
          <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in articles" :key="item">{{item}}</van-cell>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 频道管理 -->
    <span class="bar_btn">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 上拉加载中...
      upLoading: false,
      // 所有数据加载完毕
      finished: false,
      // 文章列表
      articles: []
    }
  },
  methods: {
    onLoad () {
      // 获取数据 渲染列表
      window.setTimeout(() => {
        // 模拟获取了数据
        const data = []
        for (let i = this.articles.length + 1; i <= this.articles.length + 10; i++) {
          data.push(i)
        }
        // 追加到 articles 中
        this.articles.push(...data)
        // 把加载中状态  加载结束
        this.upLoading = false
        // 假设所有的数据 50 条
        if (this.articles.length >= 50) {
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang='less'>
// deep 深度
// 组件style标签  scoped属性：让样式在当前组件下生效
// 如果你想 修改子组件的样式  使用 /deep/ 深度修改
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
// 按钮样式
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
