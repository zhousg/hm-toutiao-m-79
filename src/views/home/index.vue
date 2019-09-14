<template>
  <div class="container">
    <van-tabs swipeable v-model="activeIndex">
      <van-tab v-for="item in channels" :title="item.name" :key="item.id">
        <!-- 一个内容可以滚动的容器（记录浏览的位置） -->
        <div class="scroll-wrapper">
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list v-model="activeChannel.upLoading" :finished="activeChannel.finished" finished-text="没有更多了" @load="onLoad">
              <van-cell v-for="article in activeChannel.articles" :key="article.art_id.toString()">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{article.title}}</h3>
                  <div class="img_box" v-if="article.cover.type===3">
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="article.cover.type===1">
                    <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{article.aut_name}}</span>
                    <span>{{article.comm_count}}评论</span>
                    <span>{{article.pubdate|relTime}}</span>
                    <span class="close">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
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
import { getMyChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'home-index',
  data () {
    return {
      // 上拉加载中...
      upLoading: false,
      // 所有数据加载完毕
      finished: false,
      // 刷新中...
      downLoading: false,
      // 文章列表
      articles: [],
      // 刷新后的文本提示
      refreshSuccessText: null,
      // 我的频道（目前没有登录 系统默认给的频道）
      channels: [],
      // 当前激活的频道的索引
      activeIndex: 0
    }
  },
  computed: {
    // 当前频道
    activeChannel () {
      return this.channels[this.activeIndex]
    }
  },
  created () {
    // 当你频道加载完毕，文章列表会自动进行加载
    // 默认的第一个频道 是推荐频道  索引一定是0
    this.getMyChannels()
    // 代码调用  文章列表数据  默认是推荐频道的数据
    // 默认tab中 van-list 组件 默认执行一次onload
  },
  methods: {
    // 获取频道列表
    async getMyChannels () {
      const data = await getMyChannels()
      // data.channels [{id,name}] 结构无法渲染页面
      // map 作用：遍历，返回新的数组  新的数组中的每一项（遍历时候返回值）
      // item => {}  之前：如果只有return 数据 （注意对象不行, ({})）
      this.channels = data.channels.map(item => ({
        id: item.id,
        name: item.name,
        // 其他数据  渲染列表时候使用
        // 上拉加载中...
        upLoading: false,
        // 所有数据加载完毕
        finished: false,
        // 刷新中...
        downLoading: false,
        // 文章列表
        articles: [],
        // 时间戳 加载数据（页码）
        timestamp: Date.now()
      }))
    },
    async onLoad () {
      // // 获取数据 渲染列表
      // window.setTimeout(() => {
      //   // 模拟获取了数据
      //   const data = []
      //   for (
      //     let i = this.articles.length + 1;
      //     i <= this.articles.length + 10;
      //     i++
      //   ) {
      //     data.push(i)
      //   }
      //   // 追加到 articles 中
      //   this.articles.push(...data)
      //   // 把加载中状态  加载结束
      //   this.upLoading = false
      //   // 假设所有的数据 50 条
      //   if (this.articles.length >= 50) {
      //     this.finished = true
      //   }
      // }, 1000)

      // 注意：请勿模仿   真实的开发不需要的。
      await this.$sleep()
      // 当前选中的频道ID,时间戳
      // 动态获取当前频道的数据
      const data = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      // 给数据赋值  追加
      this.activeChannel.articles.push(...data.results)
      // 把加载中状态  加载结束
      this.activeChannel.upLoading = false
      // 如果数据加载完毕   pre_timestamp 值null  没有下一页
      if (!data.pre_timestamp) {
        this.activeChannel.finished = true
      } else {
        // 将来会继续加载
        this.activeChannel.timestamp = data.pre_timestamp
      }
    },
    async onRefresh () {
      // // 获取数据 渲染列表
      // window.setTimeout(() => {
      //   // 模拟获取了数据  (有数据，没有数据)
      //   const data = []
      //   // 把刷新中状态  刷新结束
      //   this.downLoading = false
      //   if (data.length) {
      //     // 替换 articles 数据
      //     this.articles = data
      //     // 把之前全部加载完毕的状态改成  没有全部加载完毕
      //     this.finished = false
      //     // 更新成功
      //     this.refreshSuccessText = '更新成功'
      //     // 防止加载的数据不够一屏  主动加载一次数据
      //     this.onLoad()
      //   } else {
      //     // 不做为
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1000)

      await this.$sleep()
      // 当前频道的ID和时间戳   刷新 使用最新的时间戳
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      // 停止刷新效果
      this.activeChannel.downLoading = false
      if (data.results.length) {
        // 替换 articles 数据
        this.activeChannel.articles = data.results
        this.refreshSuccessText = '更新成功'
        // 把当前的时间戳 替换成后台给你的  获取下一页需要的数据
        this.activeChannel.timestamp = data.pre_timestamp
        // 把之前全部加载完毕的状态改成  没有全部加载完毕
        this.activeChannel.finished = false
        // 防止加载的数据不够一屏  主动加载一次数据
        this.onLoad()
      } else {
        this.refreshSuccessText = '暂无更新'
      }
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
// 文章内容
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
