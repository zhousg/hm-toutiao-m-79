<template>
  <van-action-sheet :value="value" @input="$emit('input', $event)" title="频道编辑">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,i) in channels" :key="item.id">
          <span @click="enterChannel(i)" class="f12" :class="{red:activeIndex===i}">{{item.name}}</span>
          <van-icon @click="delChannel(i,item.id)" v-show="editing" v-if="i!==0" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels, delChannel } from '@/api/channel'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 我的频道
    channels: {
      type: Array,
      // 规范：如果是复杂数据类型  使用函数的返回值
      default: () => []
    },
    // 激活频道的索引
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 我的频道是否处于编辑状态
      editing: false,
      // 全部频道
      allChannels: []
    }
  },
  computed: {
    // 可选频道
    optionalChannels () {
      // 可选频道 = 全部频道 - 我的频道
      // Array.filter() 会遍历 返回符合条件的选项 组成一个新数组
      return this.allChannels.filter(item => this.channels.findIndex(myItem => myItem.id === item.id) === -1)
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    // 删除频道
    async delChannel (index, channelId) {
      try {
        // 调用接口
        await delChannel(channelId)
        // 删除成功
        // 提示成功
        this.$toast({ type: 'success', message: '删除成功' })
        // 更新界面（频道编辑组件，父组件）
        // 在 channels 中删除一项
        // 注意：父传子的数据，如果是简单数据类型 是不能赋值修改 ，
        // 但是如果是复杂数据类型，在不改变指向情况下，修改数据。
        // 当删除的频道 在当前频道的前面或者就是当前频道  当前激活频道的索引往前一位
        if (index <= this.activeIndex) {
          this.$emit('update:activeIndex', this.activeIndex - 1)
        }
        this.channels.splice(index, 1)
        // 通知父组件删除成功，如果删除后激活的频道没有数据，需要加载数据。
        // this.$emit('on-delete') 是删除后 激活的频道如果没有数据 通知父组件主动加载一次数据
      } catch (e) {
        this.$toast({ type: 'fail', message: '删除失败' })
      }
    },
    // 进入频道 index 是你需要进入频道索引
    enterChannel (index) {
      // 关闭  编辑频道组件
      this.$emit('input', false)
      // 通知  父组件  修改activeIndex的值 为当前传入index
      this.$emit('update:activeIndex', index)
    },
    // 获取全部频道
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  }
}
</script>

<style scoped lang='less'>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}
</style>
