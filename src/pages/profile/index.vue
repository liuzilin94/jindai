<template>
  <view class="page-container">
    <!-- 用户信息区 -->
    <view class="user-section">
      <view class="user-bg"></view>
      <view class="user-info">
        <view class="avatar-wrap">
          <image class="avatar" src="/static/images/avatar.png" mode="aspectFill"></image>
          <view class="vip-badge" v-if="isVip">VIP</view>
        </view>
        <view class="user-text">
          <text class="user-name">{{ isLogin ? '藏域之友' : '点击登录' }}</text>
          <text class="user-desc">{{ isLogin ? '会员ID: JD20240001' : '登录后享受更多权益' }}</text>
        </view>
      </view>
    </view>

    <!-- 订单入口 -->
    <view class="order-section card">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <view class="more-btn" @tap="goToOrderList('all')">
          <text>全部订单</text>
          <text class="arrow">></text>
        </view>
      </view>
      <view class="order-tabs">
        <view class="order-tab" @tap="goToOrderList('pending')">
          <text class="tab-icon">⏰</text>
          <text class="tab-text">待付款</text>
          <view class="badge" v-if="orderCount.pending > 0">{{ orderCount.pending }}</view>
        </view>
        <view class="order-tab" @tap="goToOrderList('shipped')">
          <text class="tab-icon">📦</text>
          <text class="tab-text">待发货</text>
          <view class="badge" v-if="orderCount.shipped > 0">{{ orderCount.shipped }}</view>
        </view>
        <view class="order-tab" @tap="goToOrderList('received')">
          <text class="tab-icon">🚚</text>
          <text class="tab-text">待收货</text>
          <view class="badge" v-if="orderCount.received > 0">{{ orderCount.received }}</view>
        </view>
        <view class="order-tab" @tap="goToOrderList('completed')">
          <text class="tab-icon">✅</text>
          <text class="tab-text">已完成</text>
        </view>
      </view>
    </view>

    <!-- 我的定制 -->
    <view class="custom-section card">
      <view class="menu-item" @tap="goToMyCustom">
        <view class="menu-icon" style="background: rgba(158, 43, 37, 0.1);">
          <text class="menu-emoji">🎨</text>
        </view>
        <view class="menu-content">
          <text class="menu-title">我的定制</text>
          <text class="menu-desc">查看保存的定制方案</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="quick-section card">
      <view class="quick-grid">
        <view class="quick-item" @tap="goToPage('/pages/profile/collect')">
          <text class="quick-icon">❤️</text>
          <text class="quick-text">我的收藏</text>
        </view>
        <view class="quick-item" @tap="goToPage('/pages/profile/address')">
          <text class="quick-icon">📍</text>
          <text class="quick-text">收货地址</text>
        </view>
        <view class="quick-item" @tap="goToPage('/pages/profile/coupon')">
          <text class="quick-icon">🎫</text>
          <text class="quick-text">优惠券</text>
        </view>
        <view class="quick-item" @tap="goToPage('/pages/profile/history')">
          <text class="quick-icon">🕐</text>
          <text class="quick-text">浏览记录</text>
        </view>
      </view>
    </view>

    <!-- 其他功能 -->
    <view class="other-section card">
      <view class="menu-item" @tap="goToAbout">
        <view class="menu-icon" style="background: rgba(29, 43, 83, 0.1);">
          <text class="menu-emoji">🏠</text>
        </view>
        <view class="menu-content">
          <text class="menu-title">关于我们</text>
          <text class="menu-desc">了解数字锦带与非遗工坊</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @tap="goToFeedback">
        <view class="menu-icon" style="background: rgba(201, 169, 98, 0.1);">
          <text class="menu-emoji">💬</text>
        </view>
        <view class="menu-content">
          <text class="menu-title">意见反馈</text>
          <text class="menu-desc">您的建议是我们改进的动力</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @tap="goToHelp">
        <view class="menu-icon" style="background: rgba(102, 102, 102, 0.1);">
          <text class="menu-emoji">❓</text>
        </view>
        <view class="menu-content">
          <text class="menu-title">帮助中心</text>
          <text class="menu-desc">常见问题解答</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @tap="goToSetting">
        <view class="menu-icon" style="background: rgba(102, 102, 102, 0.1);">
          <text class="menu-emoji">⚙️</text>
        </view>
        <view class="menu-content">
          <text class="menu-title">设置</text>
          <text class="menu-desc">账号与偏好设置</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 底部版权 -->
    <view class="footer">
      <text class="footer-text">数字锦带 © 2024 藏域非遗传承</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLogin: true,
      isVip: true,
      orderCount: {
        pending: 1,
        shipped: 0,
        received: 2,
        completed: 5
      }
    }
  },
  methods: {
    goToOrderList(status) {
      uni.navigateTo({ url: `/pages/order/list?status=${status}` })
    },
    goToMyCustom() {
      uni.navigateTo({ url: '/pages/custom/my-designs' })
    },
    goToPage(path) {
      uni.navigateTo({ url: path })
    },
    goToAbout() {
      uni.navigateTo({ url: '/pages/about/index' })
    },
    goToFeedback() {
      uni.navigateTo({ url: '/pages/feedback/index' })
    },
    goToHelp() {
      uni.navigateTo({ url: '/pages/help/index' })
    },
    goToSetting() {
      uni.navigateTo({ url: '/pages/setting/index' })
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F5F0E1;
  padding-bottom: 40rpx;
}

/* 用户信息区 */
.user-section {
  position: relative;
  padding: 60rpx 24rpx 40rpx;
}

.user-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280rpx;
  background: linear-gradient(135deg, #1D2B53, #2A3D6B);
  border-radius: 0 0 60rpx 60rpx;
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  z-index: 1;
}

.avatar-wrap {
  position: relative;
  margin-right: 24rpx;
}

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 4rpx solid #FFFFFF;
  background: linear-gradient(135deg, #F5F0E1, #E5E0D1);
}

.vip-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #C9A962, #A08040);
  color: #FFFFFF;
  font-size: 18rpx;
  font-weight: bold;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.user-text {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.user-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
}

/* 卡片样式 */
.card {
  background: #FFFFFF;
  margin: 0 24rpx 16rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.more-btn {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}

.arrow {
  margin-left: 4rpx;
}

/* 订单区 */
.order-tabs {
  display: flex;
  padding: 24rpx 0;
}

.order-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.tab-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.tab-text {
  font-size: 24rpx;
  color: #666;
}

.badge {
  position: absolute;
  top: -8rpx;
  right: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  background: #F5222D;
  color: #FFFFFF;
  font-size: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

/* 菜单项 */
.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.menu-emoji {
  font-size: 40rpx;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.menu-desc {
  font-size: 22rpx;
  color: #999;
}

.menu-arrow {
  font-size: 28rpx;
  color: #CCC;
}

/* 快捷功能 */
.quick-section {
  padding: 16rpx 0;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 8rpx 0;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.quick-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.quick-text {
  font-size: 22rpx;
  color: #666;
}

/* 底部版权 */
.footer {
  text-align: center;
  padding: 40rpx 0;
}

.footer-text {
  font-size: 22rpx;
  color: #CCC;
}
</style>
