<template>
  <view class="page-container">
    <!-- 顶部标题 -->
    <view class="custom-header">
      <text class="header-title">锦带定制中心</text>
      <text class="header-subtitle">设计您的专属非遗锦带</text>
    </view>

    <!-- 锦带预览区 -->
    <view class="preview-section">
      <view class="preview-title">
        <text class="title-text">实时预览</text>
        <text class="preview-hint">点击格子选择纹样</text>
      </view>
      <view class="preview-wrap">
        <!-- 平面预览模式 -->
        <view class="ribbon-preview" :class="{ 'preview-mode-3d': previewMode === '3d' }">
          <view class="ribbon-body">
            <view 
              class="ribbon-cell" 
              v-for="(pattern, index) in gridPatterns" 
              :key="index"
              :class="{ 'cell-filled': pattern !== null, 'cell-selected': selectedCell === index }"
              :style="pattern ? { backgroundColor: pattern.bgColor } : {}"
              @tap="onCellTap(index)"
            >
              <text v-if="pattern" class="cell-pattern-icon">{{ getPatternIcon(pattern.category) }}</text>
              <text v-else class="cell-placeholder">+</text>
            </view>
          </view>
          <!-- 刻字区域 -->
          <view v-if=" engravingText" class="engraving-area">
            <text class="engraving-text">{{ engravingText }}</text>
          </view>
        </view>
        <!-- 左右装饰 -->
        <view class="ribbon-end left"></view>
        <view class="ribbon-end right"></view>
      </view>
    </view>

    <!-- 九宫格编辑区 -->
    <view class="grid-editor-section">
      <view class="section-title-bar">
        <text class="section-title">九宫格编辑</text>
        <view class="section-actions">
          <text class="action-btn" @tap="clearGrid">清空</text>
        </view>
      </view>
      <view class="grid-editor">
        <view 
          class="grid-cell" 
          v-for="(pattern, index) in gridPatterns" 
          :key="index"
          :class="{ 'cell-active': selectedCell === index }"
          @tap="selectCell(index)"
        >
          <view 
            class="cell-bg" 
            :style="pattern ? { backgroundColor: pattern.bgColor } : {}"
          >
            <text v-if="pattern" class="cell-icon">{{ getPatternIcon(pattern.category) }}</text>
            <text v-else class="cell-plus">+</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 纹样选择区 -->
    <view class="pattern-section">
      <view class="section-title-bar">
        <text class="section-title">选择纹样</text>
        <view class="section-actions">
          <text class="action-btn draw-btn" @tap="openDrawPanel">手绘纹样</text>
        </view>
      </view>
      
      <!-- 分类标签 -->
      <scroll-view class="category-scroll" scroll-x>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '全部' }"
          @tap="filterByCategory('全部')"
        >全部</view>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '吉祥类' }"
          @tap="filterByCategory('吉祥类')"
        >吉祥类</view>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '自然类' }"
          @tap="filterByCategory('自然类')"
        >自然类</view>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '文化类' }"
          @tap="filterByCategory('文化类')"
        >文化类</view>
      </scroll-view>

      <!-- 纹样网格 -->
      <view class="pattern-grid">
        <view 
          class="pattern-item" 
          v-for="item in filteredPatterns" 
          :key="item.id"
          @tap="selectPattern(item)"
        >
          <view class="pattern-icon" :style="{ backgroundColor: item.bgColor }">
            <text class="pattern-emoji">{{ getPatternIcon(item.category) }}</text>
          </view>
          <text class="pattern-name">{{ item.name }}</text>
        </view>
        <!-- 我的纹样 -->
        <view 
          class="pattern-item" 
          v-for="item in myPatterns" 
          :key="'my-' + item.id"
          @tap="selectPattern(item)"
        >
          <view class="pattern-icon my-pattern">
            <text class="pattern-emoji">✏️</text>
          </view>
          <text class="pattern-name">手绘纹样</text>
        </view>
      </view>
    </view>

    <!-- 规格选择区 -->
    <view class="spec-section">
      <view class="section-title-bar">
        <text class="section-title">规格与附加</text>
      </view>

      <!-- 尺寸选择 -->
      <view class="spec-group">
        <text class="spec-label">尺寸</text>
        <view class="spec-options">
          <view 
            class="spec-option" 
            v-for="item in specs.size" 
            :key="item.id"
            :class="{ active: selectedSize.id === item.id }"
            @tap="selectSize(item)"
          >
            <text>{{ item.name }}</text>
            <text class="spec-price" v-if="item.price !== 0">{{ item.price > 0 ? '+' : '' }}{{ item.price }}元</text>
          </view>
        </view>
      </view>

      <!-- 材质选择 -->
      <view class="spec-group">
        <text class="spec-label">材质</text>
        <view class="spec-options">
          <view 
            class="spec-option" 
            v-for="item in specs.material" 
            :key="item.id"
            :class="{ active: selectedMaterial.id === item.id }"
            @tap="selectMaterial(item)"
          >
            <text>{{ item.name }}</text>
            <text class="spec-price" v-if="item.price !== 0">+{{ item.price }}元</text>
          </view>
        </view>
      </view>

      <!-- 配件选择 -->
      <view class="spec-group">
        <text class="spec-label">配件</text>
        <view class="spec-options">
          <view 
            class="spec-option" 
            v-for="item in specs.accessory" 
            :key="item.id"
            :class="{ active: selectedAccessory.id === item.id }"
            @tap="selectAccessory(item)"
          >
            <text>{{ item.name }}</text>
            <text class="spec-price" v-if="item.price !== 0">+{{ item.price }}元</text>
          </view>
        </view>
      </view>

      <!-- 刻字功能 -->
      <view class="spec-group engraving-group">
        <text class="spec-label">刻字</text>
        <view class="engraving-input-wrap">
          <input 
            class="engraving-input" 
            type="text" 
            v-model="engravingText" 
            placeholder="输入2-4个字（如姓名、祈福语）"
            maxlength="4"
          />
        </view>
      </view>
    </view>

    <!-- 价格与操作区 -->
    <view class="action-section">
      <view class="price-display">
        <view class="price-detail">
          <text class="price-label">定制总价</text>
          <view class="price-breakdown">
            <text class="breakdown-item">基础费 ¥{{ priceInfo.basePrice }}</text>
            <text class="breakdown-item" v-if="priceInfo.patternFee > 0">纹样费 ¥{{ priceInfo.patternFee }}</text>
            <text class="breakdown-item" v-if="priceInfo.handDrawFee > 0">手绘费 ¥{{ priceInfo.handDrawFee }}</text>
            <text class="breakdown-item" v-if="priceInfo.specFee !== 0">规格费 ¥{{ priceInfo.specFee }}</text>
            <text class="breakdown-item" v-if="priceInfo.textFee > 0">刻字费 ¥{{ priceInfo.textFee }}</text>
          </view>
        </view>
        <view class="price-total">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ priceInfo.total }}</text>
        </view>
      </view>

      <view class="action-buttons">
        <button class="btn btn-ghost btn-sm" @tap="saveDesign">保存方案</button>
        <button class="btn btn-outline" @tap="addToCart">加入购物车</button>
        <button class="btn btn-primary" @tap="buyNow">立即购买</button>
      </view>
      
      <view class="reset-btn-wrap">
        <text class="reset-btn" @tap="resetAll">重置定制</text>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="safe-bottom"></view>

    <!-- 手绘弹窗 -->
    <view class="draw-modal" v-if="showDrawPanel" @tap.stop>
      <view class="draw-modal-content">
        <view class="draw-header">
          <text class="draw-title">手绘纹样</text>
          <text class="draw-close" @tap="closeDrawPanel">×</text>
        </view>
        
        <view class="draw-canvas-wrap">
          <canvas 
            class="draw-canvas" 
            canvas-id="drawCanvas"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          ></canvas>
        </view>

        <view class="draw-tools">
          <view class="tool-group">
            <text class="tool-label">颜色</text>
            <view class="color-options">
              <view 
                class="color-dot" 
                v-for="color in drawColors" 
                :key="color"
                :style="{ backgroundColor: color }"
                :class="{ active: currentColor === color }"
                @tap="selectDrawColor(color)"
              ></view>
            </view>
          </view>
          <view class="tool-group">
            <text class="tool-label">粗细</text>
            <slider 
              class="stroke-slider"
              :value="strokeWidth" 
              min="2" 
              max="20"
              step="1"
              block-size="18"
              active-color="#9E2B25"
              @change="onStrokeChange"
            />
          </view>
        </view>

        <view class="draw-actions">
          <button class="btn btn-ghost btn-sm" @tap="clearCanvas">清空</button>
          <button class="btn btn-ghost btn-sm" @tap="useEraser">橡皮擦</button>
          <button class="btn btn-primary" @tap="saveDraw">保存纹样</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { patterns, specs, calculatePrice } from '../../data/mockData.js'

export default {
  data() {
    return {
      gridPatterns: [null, null, null, null, null, null, null, null, null],
      selectedCell: -1,
      currentCategory: '全部',
      filteredPatterns: patterns,
      myPatterns: [],
      selectedSize: specs.size[0],
      selectedMaterial: specs.material[0],
      selectedAccessory: specs.accessory[0],
      engravingText: '',
      showDrawPanel: false,
      drawColors: ['#9E2B25', '#1D2B53', '#333333', '#C9A962'],
      currentColor: '#9E2B25',
      strokeWidth: 8,
      isDrawing: false,
      drawPoints: [],
      ctx: null,
      previewMode: 'flat'
    }
  },
  computed: {
    priceInfo() {
      const filledCount = this.gridPatterns.filter(p => p !== null).length
      const myPatternCount = this.myPatterns.length
      return calculatePrice({
        patterns: this.gridPatterns,
        handDrawCount: myPatternCount,
        size: this.selectedSize,
        material: this.selectedMaterial,
        accessory: this.selectedAccessory,
        text: this.engravingText
      })
    }
  },
  onReady() {
    this.initCanvas()
  },
  methods: {
    initCanvas() {
      // Canvas 初始化在组件挂载后进行
    },
    getPatternIcon(category) {
      const icons = {
        '吉祥类': '🦚',
        '自然类': '🌈',
        '文化类': '👑'
      }
      return icons[category] || '❀'
    },
    selectCell(index) {
      this.selectedCell = this.selectedCell === index ? -1 : index
    },
    onCellTap(index) {
      this.selectedCell = index
    },
    filterByCategory(category) {
      this.currentCategory = category
      if (category === '全部') {
        this.filteredPatterns = patterns
      } else {
        this.filteredPatterns = patterns.filter(p => p.category === category)
      }
    },
    selectPattern(pattern) {
      if (this.selectedCell === -1) {
        uni.showToast({ title: '请先选择要填充的格子', icon: 'none' })
        return
      }
      this.gridPatterns[this.selectedCell] = pattern
      this.selectedCell = -1
    },
    clearGrid() {
      uni.showModal({
        title: '提示',
        content: '确定要清空所有格子吗？',
        success: (res) => {
          if (res.confirm) {
            this.gridPatterns = [null, null, null, null, null, null, null, null, null]
            this.selectedCell = -1
          }
        }
      })
    },
    selectSize(item) {
      this.selectedSize = item
    },
    selectMaterial(item) {
      this.selectedMaterial = item
    },
    selectAccessory(item) {
      this.selectedAccessory = item
    },
    openDrawPanel() {
      this.showDrawPanel = true
      this.$nextTick(() => {
        this.initDrawCanvas()
      })
    },
    closeDrawPanel() {
      this.showDrawPanel = false
    },
    initDrawCanvas() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.draw-canvas').boundingClientRect(rect => {
        if (rect) {
          this.canvasWidth = rect.width
          this.canvasHeight = rect.height
        }
      }).exec()
    },
    selectDrawColor(color) {
      this.currentColor = color
      this.isEraser = false
    },
    onStrokeChange(e) {
      this.strokeWidth = e.detail.value
    },
    useEraser() {
      this.isEraser = true
    },
    clearCanvas() {
      const ctx = uni.createCanvasContext('drawCanvas', this)
      ctx.clearRect(0, 0, 300, 300)
      ctx.draw()
      this.drawPoints = []
    },
    onTouchStart(e) {
      this.isDrawing = true
      const touch = e.touches[0]
      this.lastPoint = { x: touch.x, y: touch.y }
      this.drawPoints.push({ x: touch.x, y: touch.y, color: this.currentColor, width: this.strokeWidth })
    },
    onTouchMove(e) {
      if (!this.isDrawing) return
      const touch = e.touches[0]
      this.drawPoints.push({ x: touch.x, y: touch.y, color: this.currentColor, width: this.strokeWidth })
      this.redrawCanvas()
    },
    onTouchEnd() {
      this.isDrawing = false
    },
    redrawCanvas() {
      const ctx = uni.createCanvasContext('drawCanvas', this)
      ctx.setLineCap('round')
      ctx.setLineJoin('round')
      
      let lastPoint = null
      this.drawPoints.forEach(point => {
        if (lastPoint) {
          ctx.beginPath()
          ctx.strokeStyle = this.currentColor
          ctx.lineWidth = this.strokeWidth
          ctx.moveTo(lastPoint.x, lastPoint.y)
          ctx.lineTo(point.x, point.y)
          ctx.stroke()
        }
        lastPoint = point
      })
      
      ctx.draw()
    },
    saveDraw() {
      uni.showLoading({ title: '保存中...' })
      
      // 生成手绘纹样
      const newPattern = {
        id: Date.now(),
        name: '手绘纹样',
        category: 'custom',
        isCustom: true,
        color: this.currentColor,
        points: [...this.drawPoints]
      }
      
      this.myPatterns.push(newPattern)
      
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '纹样已保存', icon: 'success' })
        this.showDrawPanel = false
      }, 500)
    },
    saveDesign() {
      uni.showToast({ title: '方案已保存', icon: 'success' })
    },
    addToCart() {
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    },
    buyNow() {
      uni.navigateTo({
        url: '/pages/order-confirm/index?type=custom&data=' + encodeURIComponent(JSON.stringify({
          patterns: this.gridPatterns,
          size: this.selectedSize,
          material: this.selectedMaterial,
          accessory: this.selectedAccessory,
          text: this.engravingText,
          price: this.priceInfo.total
        }))
      })
    },
    resetAll() {
      uni.showModal({
        title: '提示',
        content: '确定要重置所有定制内容吗？',
        success: (res) => {
          if (res.confirm) {
            this.gridPatterns = [null, null, null, null, null, null, null, null, null]
            this.selectedCell = -1
            this.selectedSize = specs.size[0]
            this.selectedMaterial = specs.material[0]
            this.selectedAccessory = specs.accessory[0]
            this.engravingText = ''
            this.myPatterns = []
            uni.showToast({ title: '已重置', icon: 'success' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F0E1 0%, #FFFFFF 100%);
  padding-bottom: 200rpx;
}

/* 顶部标题 */
.custom-header {
  padding: 40rpx 24rpx 20rpx;
  text-align: center;
  background: linear-gradient(135deg, #1D2B53, #2A3D6B);
}

.header-title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.header-subtitle {
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
}

/* 预览区 */
.preview-section {
  padding: 24rpx;
}

.preview-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #1D2B53;
}

.preview-hint {
  font-size: 22rpx;
  color: #999;
}

.preview-wrap {
  position: relative;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 40rpx 60rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ribbon-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ribbon-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rpx;
  width: 360rpx;
  transform: rotate(-90deg);
}

.ribbon-cell {
  width: 110rpx;
  height: 110rpx;
  background: #F5F0E1;
  border: 2rpx dashed #E5E5E5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.cell-filled {
  border: none;
}

.cell-selected {
  border: 3rpx solid #9E2B25;
  box-shadow: 0 0 10rpx rgba(158, 43, 37, 0.3);
}

.cell-placeholder {
  font-size: 48rpx;
  color: #CCC;
  transform: rotate(90deg);
}

.cell-pattern-icon {
  font-size: 48rpx;
  transform: rotate(90deg);
}

.ribbon-end {
  position: absolute;
  width: 30rpx;
  height: 200rpx;
  background: linear-gradient(180deg, #C9A962, #A08040);
  border-radius: 8rpx;
}

.ribbon-end.left {
  left: 20rpx;
}

.ribbon-end.right {
  right: 20rpx;
}

.engraving-area {
  margin-top: 20rpx;
  padding: 8rpx 24rpx;
  background: linear-gradient(135deg, #C9A962, #A08040);
  border-radius: 20rpx;
  transform: rotate(90deg);
}

.engraving-text {
  font-size: 24rpx;
  color: #FFFFFF;
  font-weight: bold;
  letter-spacing: 4rpx;
}

/* 九宫格编辑区 */
.grid-editor-section {
  padding: 0 24rpx 24rpx;
}

.section-title-bar {
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

.section-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  font-size: 24rpx;
  color: #9E2B25;
  padding: 8rpx 16rpx;
  background: rgba(158, 43, 37, 0.1);
  border-radius: 20rpx;
}

.draw-btn {
  background: linear-gradient(135deg, #9E2B25, #B33630);
  color: #FFFFFF;
}

.grid-editor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  background: #FFFFFF;
  padding: 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.grid-cell {
  aspect-ratio: 1;
}

.cell-bg {
  width: 100%;
  height: 100%;
  background: #F5F0E1;
  border: 2rpx dashed #E5E5E5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.cell-active .cell-bg {
  border: 3rpx solid #9E2B25;
  box-shadow: 0 0 12rpx rgba(158, 43, 37, 0.3);
}

.cell-plus {
  font-size: 48rpx;
  color: #CCC;
}

.cell-icon {
  font-size: 56rpx;
}

/* 纹样选择区 */
.pattern-section {
  padding: 0 24rpx 24rpx;
}

.category-scroll {
  white-space: nowrap;
  margin-bottom: 20rpx;
}

.category-tab {
  display: inline-block;
  padding: 12rpx 28rpx;
  font-size: 26rpx;
  color: #666;
  background: #FFFFFF;
  border-radius: 30rpx;
  margin-right: 16rpx;
  transition: all 0.2s;
}

.category-tab.active {
  background: linear-gradient(135deg, #9E2B25, #B33630);
  color: #FFFFFF;
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.pattern-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 8rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  transition: all 0.2s;
}

.pattern-item:active {
  transform: scale(0.95);
}

.pattern-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}

.my-pattern {
  background: linear-gradient(135deg, #F5F0E1, #E5E0D1);
}

.pattern-emoji {
  font-size: 48rpx;
}

.pattern-name {
  font-size: 22rpx;
  color: #666;
  text-align: center;
}

/* 规格选择区 */
.spec-section {
  padding: 0 24rpx 24rpx;
}

.spec-group {
  margin-bottom: 24rpx;
}

.spec-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 12rpx;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.spec-option {
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  border: 2rpx solid #E5E5E5;
  border-radius: 12rpx;
  font-size: 24rpx;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s;
}

.spec-option.active {
  border-color: #9E2B25;
  background: rgba(158, 43, 37, 0.05);
  color: #9E2B25;
}

.spec-price {
  font-size: 20rpx;
  color: #C9A962;
  margin-top: 4rpx;
}

.engraving-group {
  display: flex;
  flex-direction: column;
}

.engraving-input-wrap {
  width: 100%;
}

.engraving-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  background: #FFFFFF;
  border: 2rpx solid #E5E5E5;
  border-radius: 12rpx;
  font-size: 28rpx;
}

/* 价格与操作区 */
.action-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 20rpx 24rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
}

.price-display {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20rpx;
}

.price-detail {
  flex: 1;
}

.price-label {
  font-size: 24rpx;
  color: #999;
}

.price-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 4rpx;
}

.breakdown-item {
  font-size: 20rpx;
  color: #C9A962;
}

.price-total {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 28rpx;
  color: #9E2B25;
  font-weight: bold;
}

.price-value {
  font-size: 48rpx;
  color: #9E2B25;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 16rpx;
}

.reset-btn-wrap {
  text-align: center;
  margin-top: 16rpx;
}

.reset-btn {
  font-size: 24rpx;
  color: #999;
  padding: 8rpx 16rpx;
}

/* 手绘弹窗 */
.draw-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.draw-modal-content {
  width: 90%;
  max-width: 700rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
}

.draw-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  background: linear-gradient(135deg, #1D2B53, #2A3D6B);
}

.draw-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.draw-close {
  font-size: 48rpx;
  color: #FFFFFF;
  line-height: 1;
}

.draw-canvas-wrap {
  padding: 30rpx;
  background: #F5F5F5;
}

.draw-canvas {
  width: 100%;
  height: 400rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);
}

.draw-tools {
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #E5E5E5;
}

.tool-group {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.tool-group:last-child {
  margin-bottom: 0;
}

.tool-label {
  font-size: 26rpx;
  color: #333;
  width: 80rpx;
}

.color-options {
  display: flex;
  gap: 20rpx;
}

.color-dot {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 3rpx solid transparent;
  transition: all 0.2s;
}

.color-dot.active {
  border-color: #333;
  transform: scale(1.1);
}

.stroke-slider {
  flex: 1;
  margin-left: 20rpx;
}

.draw-actions {
  display: flex;
  justify-content: space-around;
  padding: 24rpx 30rpx;
  background: #FFFFFF;
}

/* 底部占位 */
.safe-bottom {
  height: 220rpx;
}
</style>
