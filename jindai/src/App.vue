<template>
  <view id="app">
    <slot />
  </view>
</template>

<script>
export default {
  onLaunch() {
    console.log('数字锦带小程序启动')
  },
  onShow() {
    console.log('数字锦带小程序显示')
  },
  onHide() {
    console.log('数字锦带小程序隐藏')
  }
}
</script>

<style>
/* 全局样式在 common.css 中定义 */
</style>
