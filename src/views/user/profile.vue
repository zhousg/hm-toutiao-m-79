<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" @click-right="save()"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center @click="showPhoto=true">
        <van-image slot="default" width="1.5rem" height="1.5rem" fit="cover" round :src="photo" />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showName=true" />
      <van-cell is-link title="性别" :value="user.gender===0?'男':'女'" @click="showGender=true" />
      <van-cell is-link title="生日" :value="user.birthday" @click="showBirthday=true"/>
    </van-cell-group>
    <!-- 控制图片选择 -->
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell value="本地相册选择" @click="$refs.file.click()" is-link/>
      <van-cell value="拍照" is-link/>
    </van-popup>
    <!-- 输入名称 -->
    <van-popup v-model="showName" position="bottom">
      <van-field v-model="user.name" required placeholder="请输入用户名" />
    </van-popup>
    <!-- 选择性别 -->
    <van-popup v-model="showGender" position="bottom">
      <van-cell value="男" @click="changeGender(0)" is-link/>
      <van-cell value="女" @click="changeGender(1)" is-link/>
    </van-popup>
    <!-- 选择日期 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        title="选择生日"
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        @cancel="showBirthday=false"
        @confirm="confirmDate"
      />
    </van-popup>
    <input ref="file" @change="changeFile" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, updateUserInfo } from '@/api/user'
export default {
  data () {
    return {
      showPhoto: false,
      showName: false,
      showGender: false,
      showBirthday: false,
      // 当前时间
      nowDate: new Date(),
      minDate: new Date('1980-01-01'),
      // 用户的资料
      user: {
        name: '',
        gender: 0,
        // 格式 2019-10-10
        birthday: ''
      },
      // 用户头像
      photo: ''
    }
  },
  methods: {
    changeGender (type) {
      this.user.gender = type
      this.showGender = false
    },
    confirmDate (value) {
      // 转换格式 赋值给birthday
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    async getUserProfile () {
      const data = await getUserProfile()
      this.user = data
      this.photo = data.photo
    },
    // 上传图片
    async changeFile () {
      // 1. 获取文件 (以前this.files[0]获取文件)
      const file = this.$refs.file.files[0]
      // 2. 准备formData
      const fd = new FormData()
      fd.append('photo', file)
      // 3. 提交文件
      const data = await updatePhoto(fd)
      // 4. 关闭对话框
      this.showPhoto = false
      // 5. 成功提示
      this.$toast.success('更新头像成功')
      // 6. 显示头像
      this.photo = data.photo
    },
    // 保存
    async save () {
      // 1. 封装API
      // 2. 获取需要提交数据
      // 3. 提交数据
      await updateUserInfo(this.user)
      // 4. 成功提示
      this.$toast.success('保存成功')
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style scoped lang='less'></style>
