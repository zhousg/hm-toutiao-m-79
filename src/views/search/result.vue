<template>
  <div class="container">
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell-group>
        <!-- {name:'article',params:{id:item.art_id}} -->
        <van-cell @click="$router.push(`/article/${item.art_id}`)" v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]"/>
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate|relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticles } from '@/api/article'
export default {
  data () {
    return {
      upLoading: false,
      finished: false,
      reqParams: {
        page: 1,
        q: this.$route.query.q
      },
      articles: []
    }
  },
  created () {
    // 按理这个位置获取数据 但是van-list组件默认会加载数据触发onload
  },
  methods: {
    async onLoad () {
      await this.$sleep()
      // 获取数据 完成渲染
      const data = await searchArticles(this.reqParams)
      this.articles.push(...data.results)
      // 清除上拉效果
      this.upLoading = false
      // 判断所有数据是否加载完成
      if (data.results.length) {
        // 把下一页的页码 设置好
        this.reqParams.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
