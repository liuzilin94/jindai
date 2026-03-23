<template>
  <view class="page-container">
    <!-- 顶部搜索 -->
    <view class="shop-header">
      <view class="search-box" @tap="goToSearch">
        <text class="iconfont icon-search"></text>
        <text class="search-placeholder">搜索锦带商品</text>
      </view>
    </view>

    <!-- 分类导航 -->
    <view class="category-nav">
      <scroll-view class="category-scroll" scroll-x>
        <view 
          class="category-item" 
          :class="{ active: currentCategory === item.id }"
          v-for="item in categories" 
          :key="item.id"
          @tap="switchCategory(item.id)"
        >
          <image class="category-icon" :src="item.icon" mode="aspectFit"></image>
          <text class="category-name">{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 筛选排序 -->
    <view class="filter-bar">
      <view class="filter-tabs">
        <text 
          class="filter-tab" 
          :class="{ active: sortType === 'default' }"
          @tap="sortProducts('default')"
        >综合</text>
        <text 
          class="filter-tab" 
          :class="{ active: sortType === 'sales' }"
          @tap="sortProducts('sales')"
        >销量</text>
        <text 
          class="filter-tab" 
          :class="{ active: sortType === 'price' }"
          @tap="togglePriceSort"
        >
          价格
          <text class="sort-icon" v-if="sortType === 'price'">{{ priceAsc ? '↑' : '↓' }}</text>
        </text>
      </view>
      <view class="filter-pattern">
        <picker mode="selector" :range="patternOptions" range-key="name" @change="onPatternChange">
          <view class="pattern-picker">
            <text>纹样筛选</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view class="product-list" scroll-y @scrolltolower="loadMore">
      <view class="product-grid">
        <view 
          class="product-card" 
          v-for="item in sortedProducts" 
          :key="item.id"
          @tap="goToDetail(item.id)"
        >
          <view class="product-image-wrap">
            <image class="product-image" :src="item.image" mode="aspectFill"></image>
            <view class="product-tag">{{ item.tag }}</view>
            <view class="product-badge" v-if="item.isHot">热</view>
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-desc">{{ item.description }}</text>
            <view class="product-bottom">
              <view class="product-price-wrap">
                <text class="product-price">¥{{ item.price }}</text>
                <text class="product-original" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
              </view>
              <text class="product-sales">已售{{ item.sales }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-more" v-if="loading">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
      <view class="no-more" v-if="!loading && sortedProducts.length >= products.length">
        <text>— 没有更多了 —</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { products, productCategories } from '../../data/mockData.js'

export default {
  data() {
    return {
      categories: productCategories,
      currentCategory: 0,
      sortType: 'default',
      priceAsc: false,
      selectedPattern: null,
      patternOptions: [
        { id: null, name: '全部纹样' },
        { id: '孔雀纹', name: '孔雀纹' },
        { id: '彩虹纹', name: '彩虹纹' },
        { id: '达玛花纹', name: '达玛花纹' },
        { id: '格萨尔王纹', name: '格萨尔王纹' },
        { id: '祥云纹', name: '祥云纹' },
        { id: '雪山纹', name: '雪山纹' }
      ],
      products: products.map(p => ({
        ...p,
        image: p.images[0],
        isHot: p.sales > 400
      })),
      loading: false
    }
  },
  computed: {
    sortedProducts() {
      let result = [...this.products]
      
      // 分类筛选
      if (this.currentCategory > 0) {
        result = result.filter(p => p.category === this.currentCategory)
      }
      
      // 纹样筛选
      if (this.selectedPattern) {
        result = result.filter(p => p.tag === this.selectedPattern)
      }
      
      // 排序
      switch (this.sortType) {
        case 'sales':
          result.sort((a, b) => b.sales - a.sales)
          break
        case 'price':
          result.sort((a, b) => this.priceAsc ? a.price - b.price : b.price - a.price)
          break
        default:
          result.sort((a, b) => b.sales - a.sales)
      }
      
      return result
    }
  },
  methods: {
    goToSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    switchCategory(id) {
      this.currentCategory = id
    },
    sortProducts(type) {
      this.sortType = type
    },
    togglePriceSort() {
      if (this.sortType !== 'price') {
        this.sortType = 'price'
        this.priceAsc = false
      } else {
        this.priceAsc = !this.priceAsc
      }
    },
    onPatternChange(e) {
      const index = e.detail.value
      this.selectedPattern = this.patternOptions[index].id
    },
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/product-detail/index?id=${id}` })
    },
    loadMore() {
      // 模拟加载更多
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F5F0E1;
}

/* 搜索区域 */
.shop-header {
  padding: 20rpx 24rpx;
  background: #FFFFFF;
}

.search-box {
  display: flex;
  align-items: center;
  height: 72rpx;
  background: #F5F0E1;
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

/* 分类导航 */
.category-nav {
  background: #FFFFFF;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #E5E5E5;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 16rpx;
}

.category-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 160rpx;
  padding: 12rpx 16rpx;
  margin: 0 8rpx;
  border-radius: 16rpx;
  transition: all 0.2s;
}

.category-item.active {
  background: linear-gradient(135deg, rgba(158, 43, 37, 0.1), rgba(158, 43, 37, 0.05));
}

.category-icon {
  width: 64rpx;
  height: 64rpx;
  margin-bottom: 8rpx;
  background: linear-gradient(135deg, #F5F0E1, #EBE6D7);
  border-radius: 50%;
}

.category-name {
  font-size: 24rpx;
  color: #333;
  white-space: nowrap;
}

.category-item.active .category-name {
  color: #9E2B25;
  font-weight: 500;
}

/* 筛选排序 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #FFFFFF;
  margin-bottom: 16rpx;
}

.filter-tabs {
  display: flex;
  gap: 40rpx;
}

.filter-tab {
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.filter-tab.active {
  color: #9E2B25;
  font-weight: 500;
}

.sort-icon {
  margin-left: 4rpx;
}

.pattern-picker {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666;
  padding: 8rpx 16rpx;
  background: #F5F0E1;
  border-radius: 20rpx;
}

.picker-arrow {
  font-size: 20rpx;
  margin-left: 8rpx;
  color: #999;
}

/* 商品列表 */
.product-list {
  height: calc(100vh - 400rpx);
  padding: 0 24rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding-bottom: 20rpx;
}

.product-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.product-image-wrap {
  position: relative;
  height: 340rpx;
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
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 0 20rpx 20rpx 0;
}

.product-badge {
  position: absolute;
  right: 16rpx;
  top: 16rpx;
  background: #FF6B00;
  color: #FFFFFF;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price-wrap {
  display: flex;
  align-items: baseline;
}

.product-price {
  font-size: 32rpx;
  color: #9E2B25;
  font-weight: bold;
}

.product-original {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 8rpx;
}

.product-sales {
  font-size: 22rpx;
  color: #999;
}

/* 加载状态 */
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx;
}

.loading-spinner {
  width: 36rpx;
  height: 36rpx;
  border: 3rpx solid #E5E5E5;
  border-top-color: #9E2B25;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 12rpx;
}

.loading-text {
  font-size: 24rpx;
  color: #999;
}

.no-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
