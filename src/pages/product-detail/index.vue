<template>
  <view class="page-container">
    <!-- 商品图片轮播 -->
    <view class="product-swiper">
      <swiper 
        class="swiper" 
        indicator-dots 
        autoplay 
        interval="3000"
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#FFFFFF"
      >
        <swiper-item v-for="(img, index) in product.images" :key="index">
          <image class="swiper-image" :src="img" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="swiper-indicator">
        <text>{{ currentSwiper + 1 }}/{{ product.images.length }}</text>
      </view>
    </view>

    <!-- 商品基本信息 -->
    <view class="product-base">
      <view class="price-row">
        <text class="current-price">¥{{ selectedSpec.price || product.price }}</text>
        <text class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</text>
        <view class="discount-tag">限时优惠</view>
      </view>
      <text class="product-name">{{ product.name }}</text>
      <view class="product-tags">
        <text class="tag">{{ product.tag }}</text>
        <text class="tag">{{ product.material }}</text>
        <text class="tag">{{ product.size }}</text>
      </view>
    </view>

    <!-- 商品描述 -->
    <view class="product-desc card">
      <view class="card-header">
        <text class="card-title">商品详情</text>
      </view>
      <text class="desc-text">{{ product.description }}</text>
      <view class="desc-info">
        <view class="info-item">
          <text class="info-label">材质</text>
          <text class="info-value">{{ product.material }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">尺寸</text>
          <text class="info-value">{{ product.size }}</text>
        </view>
      </view>
    </view>

    <!-- 纹样寓意 -->
    <view class="pattern-meaning card">
      <view class="card-header">
        <text class="card-title">纹样寓意</text>
      </view>
      <view class="meaning-content">
        <text class="meaning-icon">🎨</text>
        <view class="meaning-text">
          <text class="meaning-name">{{ product.tag }}</text>
          <text class="meaning-desc">{{ getPatternMeaning(product.tag) }}</text>
        </view>
      </view>
      <!-- 定制同款入口 -->
      <view class="custom-link" @tap="goToCustom">
        <text>定制同款纹样</text>
        <text class="link-arrow">></text>
      </view>
    </view>

    <!-- 关联推荐 -->
    <view class="recommend-section card">
      <view class="card-header">
        <text class="card-title">关联推荐</text>
      </view>
      <scroll-view class="recommend-scroll" scroll-x>
        <view 
          class="recommend-item" 
          v-for="item in relatedProducts" 
          :key="item.id"
          @tap="goToProduct(item.id)"
        >
          <image class="recommend-image" :src="item.images[0]" mode="aspectFill"></image>
          <text class="recommend-name">{{ item.name }}</text>
          <text class="recommend-price">¥{{ item.price }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-action">
      <view class="action-icons">
        <view class="icon-item" @tap="toggleCollect">
          <text class="iconfont" :class="isCollected ? 'icon-likefill' : 'icon-like'"></text>
          <text class="icon-text">收藏</text>
        </view>
        <view class="icon-item" @tap="goToCart">
          <text class="iconfont icon-cart"></text>
          <text class="icon-text">购物车</text>
        </view>
      </view>
      <view class="action-buttons">
        <button class="btn btn-outline" @tap="addToCart">加入购物车</button>
        <button class="btn btn-primary" @tap="buyNow">立即购买</button>
      </view>
    </view>

    <!-- 规格选择弹窗 -->
    <view class="spec-modal" v-if="showSpecModal" @tap="closeSpecModal">
      <view class="spec-modal-content" @tap.stop>
        <view class="spec-modal-header">
          <image class="spec-product-img" :src="product.images[0]" mode="aspectFill"></image>
          <view class="spec-product-info">
            <text class="spec-product-name">{{ product.name }}</text>
            <text class="spec-product-price">¥{{ selectedSpec.price || product.price }}</text>
          </view>
          <text class="spec-close" @tap="closeSpecModal">×</text>
        </view>
        
        <view class="spec-modal-body">
          <!-- 规格选择 -->
          <view class="spec-section">
            <text class="spec-label">材质</text>
            <view class="spec-options">
              <text 
                class="spec-option" 
                :class="{ active: selectedSpec.material === item }"
                v-for="(item, index) in materialOptions" 
                :key="index"
                @tap="selectSpecItem('material', item)"
              >{{ item }}</text>
            </view>
          </view>
          
          <view class="spec-section">
            <text class="spec-label">尺寸</text>
            <view class="spec-options">
              <text 
                class="spec-option" 
                :class="{ active: selectedSpec.size === item }"
                v-for="(item, index) in sizeOptions" 
                :key="index"
                @tap="selectSpecItem('size', item)"
              >{{ item }}</text>
            </view>
          </view>

          <!-- 数量选择 -->
          <view class="spec-section">
            <text class="spec-label">数量</text>
            <view class="quantity-wrap">
              <text class="quantity-btn" @tap="decreaseQuantity">-</text>
              <text class="quantity-value">{{ quantity }}</text>
              <text class="quantity-btn" @tap="increaseQuantity">+</text>
            </view>
          </view>
        </view>

        <view class="spec-modal-footer">
          <button class="btn btn-outline" @tap="doAddToCart">加入购物车</button>
          <button class="btn btn-primary" @tap="doBuyNow">立即购买</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { products } from '../../data/mockData.js'

export default {
  data() {
    return {
      productId: null,
      product: {},
      currentSwiper: 0,
      isCollected: false,
      showSpecModal: false,
      selectedSpec: {
        material: '',
        size: ''
      },
      quantity: 1,
      materialOptions: ['棉麻', '尼龙', '抗菌纤维'],
      sizeOptions: ['细款（宽1.5cm）', '常规款（宽2cm）', '宽款（宽3cm）']
    }
  },
  computed: {
    relatedProducts() {
      return products
        .filter(p => p.id !== this.productId && p.tag === this.product.tag)
        .slice(0, 4)
    }
  },
  onLoad(options) {
    this.productId = parseInt(options.id)
    this.product = products.find(p => p.id === this.productId) || products[0]
    this.selectedSpec.material = this.product.material
    this.selectedSpec.size = this.product.size
  },
  methods: {
    getPatternMeaning(tag) {
      const meanings = {
        '孔雀纹': '象征吉祥富贵，寓意美好幸福，是藏域锦带中最具代表性的吉祥纹样之一。',
        '彩虹纹': '象征七彩祥云，带来好运与希望，寓意生活五彩斑斓。',
        '达玛花纹': '藏传佛教吉祥纹样，寓意平安吉祥，是智慧与福气的象征。',
        '格萨尔王纹': '藏族史诗英雄象征，寓意英勇无畏，驱邪避灾。',
        '祥云纹': '祥云缭绕，寓意吉祥如意，好运连连。',
        '雪山纹': '巍峨雪山，寓意坚韧不拔，气节高尚。'
      }
      return meanings[tag] || '藏域传统纹样，寓意美好吉祥。'
    },
    toggleCollect() {
      this.isCollected = !this.isCollected
      uni.showToast({
        title: this.isCollected ? '已收藏' : '取消收藏',
        icon: 'success'
      })
    },
    goToCart() {
      uni.switchTab({ url: '/pages/profile/index' })
    },
    goToCustom() {
      uni.switchTab({ url: '/pages/custom/index' })
    },
    goToProduct(id) {
      uni.redirectTo({ url: `/pages/product-detail/index?id=${id}` })
    },
    addToCart() {
      this.showSpecModal = true
    },
    buyNow() {
      this.showSpecModal = true
    },
    closeSpecModal() {
      this.showSpecModal = false
    },
    selectSpecItem(type, value) {
      this.selectedSpec[type] = value
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    increaseQuantity() {
      if (this.quantity < 99) {
        this.quantity++
      }
    },
    doAddToCart() {
      uni.showToast({ title: '已加入购物车', icon: 'success' })
      this.showSpecModal = false
    },
    doBuyNow() {
      this.showSpecModal = false
      uni.navigateTo({
        url: `/pages/order-confirm/index?type=product&id=${this.productId}&quantity=${this.quantity}`
      })
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F5F0E1;
  padding-bottom: 140rpx;
}

/* 商品轮播 */
.product-swiper {
  position: relative;
  background: #FFFFFF;
}

.swiper {
  width: 100%;
  height: 750rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.swiper-indicator {
  position: absolute;
  right: 24rpx;
  bottom: 24rpx;
  background: rgba(0,0,0,0.4);
  color: #FFFFFF;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

/* 商品基本信息 */
.product-base {
  background: #FFFFFF;
  padding: 30rpx 24rpx;
  margin-bottom: 16rpx;
}

.price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 16rpx;
}

.current-price {
  font-size: 48rpx;
  color: #9E2B25;
  font-weight: bold;
}

.original-price {
  font-size: 28rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 16rpx;
}

.discount-tag {
  margin-left: auto;
  background: #FFF0E6;
  color: #FF6B00;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.product-name {
  display: block;
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag {
  background: #F5F0E1;
  color: #666;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

/* 卡片样式 */
.card {
  background: #FFFFFF;
  margin: 0 24rpx 16rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.card-header {
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1D2B53;
}

/* 商品描述 */
.desc-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.desc-info {
  display: flex;
  gap: 40rpx;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-size: 24rpx;
  color: #999;
  margin-right: 8rpx;
}

.info-value {
  font-size: 24rpx;
  color: #333;
}

/* 纹样寓意 */
.meaning-content {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.meaning-icon {
  font-size: 64rpx;
  margin-right: 20rpx;
}

.meaning-text {
  flex: 1;
}

.meaning-name {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.meaning-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.custom-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1rpx solid #E5E5E5;
  color: #9E2B25;
  font-size: 26rpx;
}

.link-arrow {
  font-size: 28rpx;
}

/* 关联推荐 */
.recommend-section {
  margin-bottom: 160rpx;
}

.recommend-scroll {
  white-space: nowrap;
}

.recommend-item {
  display: inline-flex;
  flex-direction: column;
  width: 220rpx;
  margin-right: 16rpx;
}

.recommend-image {
  width: 220rpx;
  height: 220rpx;
  border-radius: 12rpx;
  background: #F5F0E1;
  margin-bottom: 12rpx;
}

.recommend-name {
  font-size: 24rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8rpx;
}

.recommend-price {
  font-size: 26rpx;
  color: #9E2B25;
  font-weight: bold;
}

/* 底部操作栏 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: #FFFFFF;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
}

.action-icons {
  display: flex;
  gap: 40rpx;
  margin-right: 24rpx;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.iconfont {
  font-size: 44rpx;
  color: #666;
}

.icon-text {
  font-size: 20rpx;
  color: #666;
  margin-top: 4rpx;
}

.action-buttons {
  flex: 1;
  display: flex;
  gap: 16rpx;
}

.btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.btn-outline {
  background: transparent;
  border: 2rpx solid #9E2B25;
  color: #9E2B25;
}

.btn-primary {
  background: linear-gradient(135deg, #9E2B25, #B33630);
  color: #FFFFFF;
}

/* 规格选择弹窗 */
.spec-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.spec-modal-content {
  width: 100%;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 80vh;
  overflow-y: auto;
}

.spec-modal-header {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #E5E5E5;
  position: relative;
}

.spec-product-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  background: #F5F0E1;
}

.spec-product-info {
  flex: 1;
  margin-left: 20rpx;
}

.spec-product-name {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.spec-product-price {
  font-size: 36rpx;
  color: #9E2B25;
  font-weight: bold;
}

.spec-close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  font-size: 48rpx;
  color: #999;
  line-height: 1;
}

.spec-modal-body {
  padding: 24rpx;
}

.spec-section {
  margin-bottom: 30rpx;
}

.spec-label {
  display: block;
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.spec-option {
  padding: 16rpx 28rpx;
  background: #F5F0E1;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
}

.spec-option.active {
  background: linear-gradient(135deg, #9E2B25, #B33630);
  color: #FFFFFF;
}

.quantity-wrap {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F0E1;
  border-radius: 8rpx;
  font-size: 32rpx;
  color: #333;
}

.quantity-value {
  width: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
}

.spec-modal-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #E5E5E5;
}
</style>
