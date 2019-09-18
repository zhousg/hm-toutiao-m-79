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
          <van-icon @click="addChannel(item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
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
    // 添加频道
    async addChannel ({ id, name }) {
      // item 传过来的意义是：本地存储和接口调用 都需要
      // 接口调用：[{id:'频道ID',seq:'序号'}]
      // 本地存储：{id:'频道ID',name:'频道名称'}
      // 将来实现的API  实现两个功能  传参兼容两种方式
      // 传入给API的参数，必须包含两种数据。
      // 决定数据格式：[{id:'频道ID',seq:'序号',name:'频道名称'},...{id:'频道ID',seq:'序号',name:'频道名称'}]
      // 开始组织数据：依赖当前的我的频道
      const newChannels = this.channels.map((item, i) => ({
        id: item.id,
        name: item.name,
        seq: i
      }))
      // 推荐频道是不需要排序的。默认是第一位置。不需要给后台。
      newChannels.splice(0, 1)
      // 添加频道进入 新的频道数组
      newChannels.push({ id, name, seq: newChannels.length + 1 })

      try {
        // 调用API 进行添加
        await addChannel(newChannels)
        // 处理成功
        this.$toast({ type: 'success', message: '添加成功' })
        // 其他逻辑  追加到组件上的我的频道数据中
        this.channels.push({
          id,
          name,
          // 上拉加载中...
          upLoading: false,
          // 所有数据加载完毕
          finished: false,
          // 刷新中...
          downLoading: false,
          // 文章列表
          articles: [],
          // 时间戳 加载数据（页码）
          timestamp: Date.now(),
          // 阅读位置
          scrollTop: 0
        })
      } catch (e) {
        // 处理失败
        this.$toast({ type: 'success', message: '添加失败' })
      }
    },
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
