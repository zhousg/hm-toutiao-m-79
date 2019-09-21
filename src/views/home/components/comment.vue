<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list :immediate-check="false" @load="getComments" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image round width="1rem" height="1rem" fit="fill"  :src="item.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate|relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id)">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px">
        </van-loading>
        <span @click="submit()" class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复 -->
    <van-action-sheet v-model="showReply" class="reply_dailog" title="回复评论" @closed="commentId=null">
      <van-list :immediate-check="false"  @load="getReplys()" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{item.pubdate|relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
import { getComments, commentOrReply } from '@/api/article'
export default {
  name: 'article-comment',
  props: {
    articleId: {
      type: String,
      default: ''
    }
  },
  // 组件被缓存  使用激活钩子  加载数据
  activated () {
    // 获取评论列表数据  第一次van-list会自动加载   禁用自动加载功能
    // 进入需要重置上一篇文章评论的数据
    this.loading = true
    this.offset = null
    this.finished = false
    this.comments = []
    this.getComments()
  },
  data () {
    return {
      // 评论列表相关数据
      loading: false,
      finished: false,
      offset: null,
      comments: [],
      // 内容
      value: '',
      // 正在提交中
      submiting: false,
      // 回复相关的数据
      showReply: false,
      // 评论ID
      commentId: null,
      reply: {
        loading: false,
        finished: false,
        list: [],
        offset: null
      }
    }
  },
  methods: {
    // 发表评论或者回复
    async submit () {
      // 判断是否有内容
      if (!this.value) return false
      // 开启加载中
      this.submiting = true
      await this.$sleep()
      // 1. 区分现在行为
      if (this.commentId) {
        // 回复
        // 2. 请求
        const data = await commentOrReply(this.commentId, this.value, this.articleId)
        // 3. 成功
        // 在列表的顶部，追加一条新的回复
        // data.new_obj 和回复列表中的每一项数据结构一致
        this.reply.list.unshift(data.new_obj)
        // 清空内容
        this.value = ''
        // 更新当前评论的回复数量
        const comment = this.comments.find(item => item.com_id === this.commentId)
        comment.reply_count++
        // 关闭加载中
        this.submiting = false
      } else {
        // 评论
        // 2. 请求
        const data = await commentOrReply(this.articleId, this.value)
        // 3. 成功
        // 在评论列表的顶部
        this.comments.unshift(data.new_obj)
        // 清空内容
        this.value = ''
        // 关闭加载中
        this.submiting = false
      }
    },
    // 打开回复
    openReply (id) {
      this.showReply = true
      // 点击的评论ID
      this.commentId = id
      // 重置数据  获取到新的回复列表
      this.reply.finished = false
      this.reply.list = []
      this.reply.loading = true
      this.reply.offset = null
      // 获取回复
      this.getReplys()
    },
    // 获取回复
    async getReplys () {
      await this.$sleep()
      // 注意 自己来转换字符串
      const data = await getComments(this.commentId.toString(), 'c', this.reply.offset)
      this.reply.list.push(...data.results)
      // 数据加载完毕
      this.reply.loading = false
      if (data.end_id < data.last_id) {
        this.reply.offset = data.last_id
      } else {
        this.reply.finished = true
      }
    },
    // 获取评论
    async getComments () {
      await this.$sleep()
      const data = await getComments(this.articleId, 'a', this.offset)
      this.comments.push(...data.results)
      // 数据加载完毕
      this.loading = false
      // 判断是否全部加载完毕
      // 总结：每段数据最后一个的时间如果比所有数据的最后一个时间要小，代表有数据
      if (data.end_id < data.last_id) {
        // 有数据  更新offset获取下一段数据
        this.offset = data.last_id
      } else {
        // 没有数据
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
