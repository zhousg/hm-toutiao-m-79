<template>
  <div class='container' ref="container" @scroll="remember($event)">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <van-button @click="follow()" round size="small" type="info">{{article.is_followed?'已关注':'+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button round size="small" @click="updateState(1)" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" @click="updateState(0)" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 评论与回复 -->
      <comment :articleId="articleId"></comment>
    </div>
  </div>
</template>

<script>
import { getArticleDetail, disLikes, undisLikes, likings, unlikings } from '@/api/article'
import { followings, unfollowings } from '@/api/user'
import Comment from './components/comment'
export default {
  name: 'home-article',
  components: { Comment },
  data () {
    return {
      article: {},
      // 阅读位置
      scrollTop: 0
    }
  },
  // 只会执行一次，将来再次进入组件，激活组件 activated
  // created () {
  //   this.getArticleDetail()
  // },
  activated () {
    // 再次激活  滚动到之前的位置
    // 如果再次阅读上一次阅读的文章，才去做约定位置滚动。
    if (this.article.art_id && this.articleId === this.article.art_id.toString()) {
      // 阅读的同一篇文章
      this.$refs['container'].scrollTop = this.scrollTop
    } else {
      // 清除之前文章信息
      this.article = {}
      // 回调顶部
      this.scrollTop = 0
      // 重新获取文章数据
      this.getArticleDetail()
    }
  },
  // 获取地址栏ID  文章详情组件已经被缓存的组件
  computed: {
    articleId () {
      return this.$route.params.id
    }
  },
  methods: {
    // 点赞 取消点赞 不喜欢 取消不喜欢 type 0 不喜欢操作 1 点赞操作
    // article.attitude  -1 无状态  0 不喜欢  1 点赞
    async updateState (type) {
      if (type === 1) {
        if (this.article.attitude === 1) {
          // 取消点赞
          await unlikings(this.articleId)
          // 处理成功
          this.article.attitude = -1
        } else {
          // 点赞
          await likings(this.articleId)
          // 处理成功
          this.article.attitude = 1
        }
      } else {
        if (this.article.attitude === 0) {
          // 取消不喜欢
          await undisLikes(this.articleId)
          // 处理成功
          this.article.attitude = -1
        } else {
          // 不喜欢
          await disLikes(this.articleId)
          // 处理成功
          this.article.attitude = 0
        }
      }
    },
    // 添加关注  取消关注  注意：自己不能关注自己
    async follow () {
      if (this.article.is_followed) {
        // 取消关注
        await unfollowings(this.article.aut_id)
        // 处理成功
        this.$toast.success('取消关注成功')
        // 修改数据
        this.article.is_followed = false
      } else {
        // 添加关注
        await followings(this.article.aut_id)
        // 处理成功
        this.$toast.success('添加关注成功')
        // 修改数据
        this.article.is_followed = true
      }
    },
    // 记住位置
    remember (e) {
      this.scrollTop = e.target.scrollTop
    },
    // 获取文章详情
    async getArticleDetail () {
      const data = await getArticleDetail(this.articleId)
      this.article = data
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    // 代码换行
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
