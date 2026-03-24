<template>
  <view class="page-container">
    <!-- 顶部搜索区域 -->
    <view class="search-header">
      <view class="search-box" @tap="goToSearch">
        <text class="iconfont icon-search"></text>
        <text class="search-placeholder">搜索成品/定制/科普内容</text>
      </view>
    </view>

    <!-- 轮播图区域 -->
    <view class="banner-section">
      <swiper 
        class="banner-swiper" 
        indicator-dots 
        autoplay 
        interval="3000" 
        circular
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#9E2B25"
      >
        <swiper-item v-for="item in bannerList" :key="item.id">
          <view class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
            <view class="banner-content">
              <text class="banner-title">{{ item.title }}</text>
              <text class="banner-subtitle">{{ item.subtitle }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 功能入口区域 -->
    <view class="menu-section">
      <view 
        class="menu-item" 
        v-for="item in menuList" 
        :key="item.id"
        @tap="navigateTo(item.path)"
      >
        <view class="menu-icon" :style="{ backgroundColor: item.color + '15' }">
          <image class="menu-image" :src="item.icon" mode="aspectFit"></image>
        </view>
        <text class="menu-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 科普轻展示区 -->
    <view class="culture-tips-section">
      <view class="section-header">
        <text class="section-title">非遗小知识</text>
        <text class="section-more" @tap="goToCulture">更多 ></text>
      </view>
      <scroll-view class="tips-scroll" scroll-x enable-flex>
        <view 
          class="tip-card" 
          v-for="item in tipList" 
          :key="item.id"
          @tap="goToCultureDetail(item.id)"
        >
          <view class="tip-icon" :style="{ backgroundColor: item.bgColor }">
            <text class="tip-emoji">{{ item.emoji }}</text>
          </view>
          <view class="tip-content">
            <text class="tip-title">{{ item.title }}</text>
            <text class="tip-desc">{{ item.summary }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 热门推荐区 -->
    <view class="recommend-section">
      <view class="section-header">
        <text class="section-title">热门推荐</text>
        <text class="section-more" @tap="goToShop">更多 ></text>
      </view>
      <view class="recommend-grid">
        <view 
          class="product-card" 
          v-for="item in hotProducts" 
          :key="item.id"
          @tap="goToProduct(item.id)"
        >
          <view class="product-image-wrap">
            <image class="product-image" :src="item.image" mode="aspectFill"></image>
            <view class="product-tag">{{ item.tag }}</view>
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <view class="product-bottom">
              <text class="product-price">¥{{ item.price }}</text>
              <text class="product-sales">已售{{ item.sales }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<script>
import { bannerList, menuList, cultures, products } from '../../data/mockData.js'

export default {
  data() {
    return {
      bannerList: bannerList,
      menuList: menuList,
      tipList: cultures.slice(0, 3).map(c => ({
        ...c,
        emoji: c.category === '纹样文化' ? '🎨' : c.category === '编织技艺' ? '🧵' : '📜',
        bgColor: c.category === '纹样文化' ? '#FFF5F5' : c.category === '编织技艺' ? '#F5F7FF' : '#FFFEF5'
      })),
      hotProducts: products.slice(0, 4).map(p => ({
        ...p,
        image: p.images[0]
      }))
    }
  },
  methods: {
    goToSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    navigateTo(path) {
      uni.switchTab({ url: path })
    },
    goToCulture() {
      uni.switchTab({ url: '/pages/culture/index' })
    },
    goToCultureDetail(id) {
      uni.navigateTo({ url: `/pages/culture/detail?id=${id}` })
    },
    goToShop() {
      uni.switchTab({ url: '/pages/shop/index' })
    },
    goToProduct(id) {
      uni.navigateTo({ url: `/pages/product-detail/index?id=${id}` })
    }
  }
}
</script>

<style scoped>
/* 搜索区域 */
.search-header {
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #9E2B25, #B33630);
}

.search-box {
  display: flex;
  align-items: center;
  height: 72rpx;
  background: #FFFFFF;
  border-radius: 36rpx;
  padding: 0 30rpx;
}

.icon-search {
  font-size: 32rpx;
  color: #999;
  margin-right: 16rpx;
}

.search-placeholder {
  font-size: 26rpx;
  color: #999;
}

/* 轮播图 */
.banner-section {
  padding: 20rpx 24rpx;
}

.banner-swiper {
  width: 100%;
  height: 320rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.banner-item {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #9E2B25 0%, #1D2B53 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: #FFFFFF;
}

.banner-title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.3);
}

.banner-subtitle {
  font-size: 26rpx;
  opacity: 0.9;
}

/* 功能入口 */
.menu-section {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 24rpx;
  background: #FFFFFF;
  margin: 0 24rpx;
  border-radius: 16rpx;
  margin-top: -20rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140rpx;
}

.menu-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  transition: transform 0.2s;
}

.menu-icon:active {
  transform: scale(0.95);
}

.menu-image {
  width: 60rpx;
  height: 60rpx;
}

.menu-name {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

/* 科普小知识 */
.culture-tips-section {
  margin-top: 30rpx;
  padding: 0 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1D2B53;
}

.section-more {
  font-size: 24rpx;
  color: #999;
}

.tips-scroll {
  white-space: nowrap;
  width: 100%;
}

.tip-card {
  display: inline-flex;
  align-items: center;
  width: 560rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.tip-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.tip-emoji {
  font-size: 40rpx;
}

.tip-content {
  flex: 1;
  overflow: hidden;
}

.tip-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tip-desc {
  font-size: 24rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 热门推荐 */
.recommend-section {
  margin-top: 30rpx;
  padding: 0 24rpx 30rpx;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.product-image-wrap {
  position: relative;
  height: 320rpx;
  background: linear-gradient(135deg, #f5f5f5, #ebebeb);
}

.product-image {
  width: 100%;
  height: 100%;
}

.product-tag {
  position: absolute;
  left: 0;
  top: 16rpx;
  background: linear-gradient(135deg, #9E2B25, #B33630);
  color: #FFFFFF;
  font-size: 20rpx;
  padding: 6rpx 16rpx;
  border-radius: 0 20rpx 20rpx 0;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 32rpx;
  color: #9E2B25;
  font-weight: bold;
}

.product-sales {
  font-size: 22rpx;
  color: #999;
}

/* 底部占位 */
.safe-bottom {
  height: 120rpx;
}
</style>
