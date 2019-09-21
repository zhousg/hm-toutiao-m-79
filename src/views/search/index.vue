<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" @search="onSearch" />
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search" @click="onSearch(item.replace(`<span>${q}</span>`,q))" v-for="item in suggestList" :key="item"><p v-html="item"></p></van-cell>
    </van-cell-group>
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clearHistory()"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="item in historyList" :key="item">
          <a @click="toSearch(item)" class="word_btn">{{item}}</a>
          <van-icon @click="delHistory(item)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggest } from '@/api/article'
// 本地存储 搜索历史记录
// 约定 key = 'hm-toutiao-m-79-history'
// 约定 value = ['曾经搜索的关键字',...]
const KEY = 'hm-toutiao-m-79-history'
export default {
  data () {
    return {
      // 搜索关键字
      q: '',
      // 历史记录
      historyList: [],
      // 定时器唯一标识
      timer: null,
      // 词条数组
      suggestList: []
    }
  },
  // 在输入的内容发生改变的时候  获取后端提供的自动补全的词条
  // 1. 使用组件提供的 input 事件
  // 2. 使用watch来监听 q 数据的变化
  watch: {
    q () {
      // 发请求拿数据  只要数据改变了，发送一次请求。
      // 当数据改变后，200ms内没有再次改变，把请求发出去。

      // 函数防抖：执行一个函数，在规定时间内，当再次执行这个函数，终止上一次函数执行。
      // 运用场景：联想搜索，性能开销较大操作（监听窗口尺寸改变，监听滚动条的滚动）去做一些事件。

      // 函数节流：执行一个函数，在规定时间内，再次执行这个函数，不允许，必须等规定事件结束后，再次执行函数。
      // 运用场景：做动画的时候
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(async () => {
        // 发请求 获取 补全数据 进行渲染
        if (!this.q) {
          // 没有内容 对应 没有建议
          this.suggestList = []
          return false
        }
        const data = await suggest(this.q)
        this.suggestList = data.options.map(item => item.toLowerCase().replace(this.q, `<span>${this.q}</span>`))
      }, 200)
    }
  },
  created () {
    // 历史记录获取
    this.historyList = JSON.parse(window.localStorage.getItem(KEY) || '[]')
  },
  methods: {
    // 清空
    clearHistory () {
      this.historyList = []
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    // 删除
    delHistory (text) {
      const index = this.historyList.findIndex(item => item === text)
      this.historyList.splice(index, 1)
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    // 根据历史去搜索页面
    toSearch (text) {
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    onSearch (text) {
      // 追加历史记录
      // 没有输入任何内容
      if (!text) {
        return false
      }
      // 代表有内容
      // 搜索的内容  可能和之前搜索的内容一致  不能应该再次存储
      // 创建一个set对象 set是一个不能重复的集合  构造函数传参是数组
      const set = new Set(this.historyList)
      set.add(text)
      this.historyList = Array.from(set)
      // 存储在本地
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      // 回车触发的搜索函数  如果是移动端虚拟键盘的enter键，部分手机搜索键。
      this.$router.push({ path: '/search/result', query: { q: text } })
    }
  }
}
</script>

<style scoped lang='less'>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
