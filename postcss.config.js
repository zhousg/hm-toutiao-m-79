module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      // 转换成rem的默认基准值  100px的容器   100/37.5rem的容器
      // 37.5 因为vant是基于iphone6来做适配的  宽度375px
      // 使用了一款 flexible 插件  设置基准值 html font-size 规则：基准值=当前设备宽带的十分之一
      // 适配机型 iPhone5|5 320px宽度  32
      // 适配机型 iPhone6|7|8 375px宽度  37.5
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
