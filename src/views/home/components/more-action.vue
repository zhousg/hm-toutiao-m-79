<template>
  <van-popup :value="value" @input="$emit('input',$event)" @closed="isRport=false">
    <van-cell-group v-if="!isRport">
      <van-cell @click="disLikes">不感兴趣</van-cell>
      <van-cell is-link @click="isRport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isRport=false">返回</van-cell>
      <van-cell @click="report(item.value)" v-for="item in reportType" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disLikes, report } from '@/api/article'
import { reportType } from '@/api/constants'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      // 是不是正在举报
      isRport: false,
      // 举报类型
      reportType
    }
  },
  methods: {
    // 不喜欢
    async disLikes () {
      try {
        // 获取  点击更多操作 的文章的ID
        await disLikes(this.articleId)
        // 成功  删除不感兴趣的文章 即可
        // 关闭  对话框
        this.$emit('input', false)
        // 提示  操作成功
        this.$toast({ type: 'success', message: '操作成功' })
        // 通知父组件 删除当前点击的文章
        this.$emit('on-dislikes')
      } catch (e) {
        // 提示  操作失败
        this.$toast({ type: 'fail', message: '操作失败' })
      }
    },
    // 举报文章
    async report (type) {
      try {
        await report(this.articleId, type)
        // 1. 提示成功
        this.$toast({ type: 'success', message: '操作成功' })
        // 2. 关闭对话框
        this.$emit('input', false)
        // 3. 删除 父组件  对应文章
        this.$emit('on-report')
      } catch (e) {
        if (e.response.status === 409) {
          this.$toast('文章已经举报')
        } else {
          this.$toast({ type: 'fail', message: '操作失败' })
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
