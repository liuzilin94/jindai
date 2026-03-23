<template>
  <view class="page-container">
    <!-- 地址选择 -->
    <view class="address-section" @tap="selectAddress">
      <view class="address-content" v-if="address">
        <view class="address-main">
          <text class="address-name">{{ address.name }}</text>
          <text class="address-phone">{{ address.phone }}</text>
        </view>
        <text class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
      </view>
      <view class="address-empty" v-else>
        <text class="empty-icon">📍</text>
        <text class="empty-text">请添加收货地址</text>
      </view>
      <text class="address-arrow">></text>
    </view>

    <!-- 商品信息 -->
    <view class="order-section card">
      <view class="card-header">
        <text class="card-title">商品信息</text>
      </view>
      
      <!-- 定制订单 -->
      <view class="custom-order" v-if="orderType === 'custom'">
        <view class="custom-preview">
          <view class="preview-grid">
            <view 
              class="preview-cell" 
              v-for="(pattern, index) in orderData.patterns" 
              :key="index"
              :style="pattern ? { backgroundColor: pattern.bgColor } : {}"
            >
              <text v-if="pattern" class="cell-icon">{{ getPatternIcon(pattern.category) }}</text>
            </view>
          </view>
        </view>
        <view class="custom-info">
          <view class="info-row">
            <text class="info-label">尺寸</text>
            <text class="info-value">{{ orderData.size.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">材质</text>
            <text class="info-value">{{ orderData.material.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">配件</text>
            <text class="info-value">{{ orderData.accessory.name }}</text>
          </view>
          <view class="info-row" v-if="orderData.text">
            <text class="info-label">刻字</text>
            <text class="info-value">{{ orderData.text }}</text>
          </view>
        </view>
      </view>

      <!-- 商城订单 -->
      <view class="product-order" v-else>
        <view class="product-item" v-for="item in orderItems" :key="item.id">
          <image class="product-image" :src="item.image" mode="aspectFill"></image>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-spec">{{ item.spec }}</text>
            <view class="product-bottom">
              <text class="product-price">¥{{ item.price }}</text>
              <text class="product-quantity">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-section card">
      <view class="price-row">
        <text class="price-label">商品金额</text>
        <text class="price-value">¥{{ subtotal }}</text>
      </view>
      <view class="price-row">
        <text class="price-label">运费</text>
        <text class="price-value">¥{{ freight }}</text>
      </view>
      <view class="price-row" v-if="discount > 0">
        <text class="price-label">优惠</text>
        <text class="price-value discount">-¥{{ discount }}</text>
      </view>
      <view class="price-row total-row">
        <text class="price-label">合计</text>
        <text class="total-value">¥{{ total }}</text>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark-section card">
      <text class="remark-label">订单备注</text>
      <input 
        class="remark-input" 
        v-model="remark" 
        placeholder="选填，可备注特殊要求"
        maxlength="100"
      />
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-action">
      <view class="total-info">
        <text class="total-label">应付金额</text>
        <text class="total-price">¥{{ total }}</text>
      </view>
      <button class="btn btn-primary" @tap="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script>
import { products } from '../../data/mockData.js'

export default {
  data() {
    return {
      orderType: 'custom',
      orderData: {},
      orderItems: [],
      address: {
        name: '扎西德勒',
        phone: '138****8888',
        province: '西藏自治区',
        city: '拉萨市',
        district: '城关区',
        detail: '八廓街文化广场1号'
      },
      remark: '',
      freight: 0,
      discount: 10
    }
  },
  computed: {
    subtotal() {
      if (this.orderType === 'custom') {
        return this.orderData.price || 0
      }
      return this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    total() {
      return this.subtotal + this.freight - this.discount
    }
  },
  onLoad(options) {
    this.orderType = options.type || 'product'
    
    if (this.orderType === 'custom') {
      try {
        this.orderData = JSON.parse(decodeURIComponent(options.data || '{}'))
      } catch (e) {
        this.orderData = {}
      }
    } else {
      const productId = parseInt(options.id || '1')
      const quantity = parseInt(options.quantity || '1')
      const product = products.find(p => p.id === productId) || products[0]
      this.orderItems = [{
        id: product.id,
        name: product.name,
        image: product.images[0],
        spec: `${product.material} / ${product.size}`,
        price: product.price,
        quantity: quantity
      }]
    }
  },
  methods: {
    getPatternIcon(category) {
      const icons = {
        '吉祥类': '🦚',
        '自然类': '🌈',
        '文化类': '👑'
      }
      return icons[category] || '❀'
    },
    selectAddress() {
      uni.showToast({ title: '选择地址功能', icon: 'none' })
    },
    submitOrder() {
      if (!this.address) {
        uni.showToast({ title: '请选择收货地址', icon: 'none' })
        return
      }
      
      uni.showModal({
        title: '确认订单',
        content: `确认提交订单，金额 ¥${this.total}？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '提交中...' })
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({ title: '订单提交成功', icon: 'success' })
              setTimeout(() => {
                uni.redirectTo({ url: '/pages/order/detail?orderId=' + Date.now() })
              }, 1500)
            }, 1000)
          }
        }
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

/* 地址选择 */
.address-section {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  margin: 24rpx;
  border-radius: 16rpx;
  padding: 30rpx 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.address-content {
  flex: 1;
}

.address-main {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.address-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
}

.address-phone {
  font-size: 26rpx;
  color: #666;
}

.address-detail {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.address-empty {
  flex: 1;
  display: flex;
  align-items: center;
}

.empty-icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.address-arrow {
  font-size: 28rpx;
  color: #CCC;
  margin-left: 16rpx;
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

/* 定制订单 */
.custom-order {
  display: flex;
  gap: 24rpx;
}

.custom-preview {
  flex-shrink: 0;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rpx;
  width: 180rpx;
  transform: rotate(-90deg);
}

.preview-cell {
  width: 56rpx;
  height: 56rpx;
  background: #F5F0E1;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell-icon {
  font-size: 28rpx;
  transform: rotate(90deg);
}

.custom-info {
  flex: 1;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 26rpx;
  color: #999;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

/* 商城订单 */
.product-order {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  display: flex;
  gap: 20rpx;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  background: #F5F0E1;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.product-spec {
  font-size: 24rpx;
  color: #999;
  margin-bottom: auto;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 28rpx;
  color: #9E2B25;
  font-weight: bold;
}

.product-quantity {
  font-size: 24rpx;
  color: #999;
}

/* 价格明细 */
.price-section {
  padding: 30rpx 24rpx;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
}

.price-label {
  font-size: 26rpx;
  color: #666;
}

.price-value {
  font-size: 26rpx;
  color: #333;
}

.price-value.discount {
  color: #52C41A;
}

.total-row {
  border-top: 1rpx solid #E5E5E5;
  padding-top: 20rpx;
  margin-top: 8rpx;
}

.total-value {
  font-size: 36rpx;
  color: #9E2B25;
  font-weight: bold;
}

/* 备注 */
.remark-section {
  display: flex;
  align-items: center;
}

.remark-label {
  font-size: 26rpx;
  color: #666;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.remark-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

/* 底部操作栏 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  padding: 20rpx 24rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
}

.total-info {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-size: 24rpx;
  color: #999;
}

.total-price {
  font-size: 40rpx;
  color: #9E2B25;
  font-weight: bold;
}

.btn {
  height: 88rpx;
  padding: 0 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #9E2B25, #B33630);
  color: #FFFFFF;
}
</style>
