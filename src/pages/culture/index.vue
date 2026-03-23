<template>
  <view class="page-container">
    <!-- 顶部标题 -->
    <view class="culture-header">
      <text class="header-title">文化科普</text>
      <text class="header-subtitle">探索千年藏域非遗文化</text>
    </view>

    <!-- 分类导航 -->
    <view class="category-nav">
      <scroll-view class="category-scroll" scroll-x>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '全部' }"
          @tap="switchCategory('全部')"
        >全部</view>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '纹样文化' }"
          @tap="switchCategory('纹样文化')"
        >纹样文化</view>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '编织技艺' }"
          @tap="switchCategory('编织技艺')"
        >编织技艺</view>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '非遗故事' }"
          @tap="switchCategory('非遗故事')"
        >非遗故事</view>
        <view 
          class="category-tab" 
          :class="{ active: currentCategory === '达玛女神IP' }"
          @tap="switchCategory('达玛女神IP')"
        >达玛女神IP</view>
      </scroll-view>
    </view>

    <!-- 内容列表 -->
    <scroll-view class="content-list" scroll-y>
      <view 
        class="culture-card" 
        v-for="item in filteredList" 
        :key="item.id"
        @tap="goToDetail(item)"
      >
        <view class="card-image-wrap">
          <image class="card-image" :src="item.image" mode="aspectFill"></image>
          <view class="card-category-tag">{{ item.category }}</view>
        </view>
        <view class="card-content">
          <text class="card-title">{{ item.title }}</text>
          <text class="card-summary">{{ item.summary }}</text>
          <view class="card-footer">
            <view class="card-stats">
              <text class="stat-item">
                <text class="stat-icon">👁</text>
                {{ formatViews(item.views) }}
              </text>
              <text class="stat-item">
                <text class="stat-icon">❤</text>
                {{ item.likes }}
              </text>
            </view>
            <view class="card-actions">
              <text class="action-btn" @tap.stop="toggleLike(item)">
                {{ item.isLiked ? '❤️' : '🤍' }}
              </text>
              <text class="action-btn" @tap.stop="shareArticle(item)">📤</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredList.length === 0">
        <text class="empty-icon">📚</text>
        <text class="empty-text">暂无相关科普内容</text>
      </view>
    </scroll-view>

    <!-- 知识问答入口 -->
    <view class="quiz-entry" @tap="showQuiz">
      <view class="quiz-content">
        <text class="quiz-icon">❓</text>
        <view class="quiz-text">
          <text class="quiz-title">非遗知识小问答</text>
          <text class="quiz-desc">测试您对藏域锦带文化的了解</text>
        </view>
      </view>
      <text class="quiz-arrow">></text>
    </view>

    <!-- 知识问答弹窗 -->
    <view class="quiz-modal" v-if="showQuizModal" @tap="closeQuiz">
      <view class="quiz-modal-content" @tap.stop>
        <view class="quiz-header">
          <text class="quiz-header-title">非遗知识小问答</text>
          <text class="quiz-close" @tap="closeQuiz">×</text>
        </view>
        
        <view class="quiz-progress">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: (currentQuestionIndex + 1) / quizQuestions.length * 100 + '%' }"></view>
          </view>
          <text class="progress-text">{{ currentQuestionIndex + 1 }}/{{ quizQuestions.length }}</text>
        </view>

        <view class="quiz-body" v-if="currentQuestion">
          <text class="question-text">{{ currentQuestion.question }}</text>
          <view class="options-list">
            <view 
              class="option-item" 
              :class="{ 
                selected: selectedAnswer === index,
                correct: showResult && index === currentQuestion.answer,
                wrong: showResult && selectedAnswer === index && index !== currentQuestion.answer
              }"
              v-for="(option, index) in currentQuestion.options" 
              :key="index"
              @tap="selectAnswer(index)"
            >
              <text class="option-label">{{ String.fromCharCode(65 + index) }}</text>
              <text class="option-text">{{ option }}</text>
            </view>
          </view>
          
          <!-- 结果提示 -->
          <view class="result-tip" v-if="showResult">
            <text class="result-text" :class="{ correct: isCorrect, wrong: !isCorrect }">
              {{ isCorrect ? '✓ 回答正确！' : '✗ 回答错误' }}
            </text>
            <text class="explanation-text">{{ currentQuestion.explanation }}</text>
          </view>
        </view>

        <view class="quiz-footer">
          <button 
            class="btn btn-primary btn-block" 
            v-if="!showResult"
            :disabled="selectedAnswer === null"
            @tap="submitAnswer"
          >确定答案</button>
          <button 
            class="btn btn-primary btn-block" 
            v-else
            @tap="nextQuestion"
          >{{ currentQuestionIndex < quizQuestions.length - 1 ? '下一题' : '完成答题' }}</button>
        </view>
      </view>
    </view>

    <!-- 答题完成弹窗 -->
    <view class="complete-modal" v-if="showCompleteModal" @tap="closeComplete">
      <view class="complete-modal-content" @tap.stop>
        <text class="complete-icon">🏆</text>
        <text class="complete-title">答题完成！</text>
        <text class="complete-score">您的得分：{{ correctCount }}/{{ quizQuestions.length }}</text>
        <text class="complete-message">
          {{ correctCount === quizQuestions.length ? '太棒了！您是藏域文化专家！' : 
             correctCount >= quizQuestions.length / 2 ? '不错！继续了解非遗文化吧！' : 
             '加油！再多了解一些藏域文化知识吧！' }}
        </text>
        <button class="btn btn-primary" @tap="closeComplete">我知道了</button>
      </view>
    </view>
  </view>
</template>

<script>
import { cultures, quizQuestions } from '../../data/mockData.js'

export default {
  data() {
    return {
      cultures: cultures.map(c => ({ ...c, isLiked: false })),
      currentCategory: '全部',
      showQuizModal: false,
      showCompleteModal: false,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showResult: false,
      correctCount: 0,
      quizQuestions: quizQuestions
    }
  },
  computed: {
    filteredList() {
      if (this.currentCategory === '全部') {
        return this.cultures
      }
      return this.cultures.filter(item => item.category === this.currentCategory)
    },
    currentQuestion() {
      return this.quizQuestions[this.currentQuestionIndex]
    },
    isCorrect() {
      return this.selectedAnswer === this.currentQuestion.answer
    }
  },
  methods: {
    switchCategory(category) {
      this.currentCategory = category
    },
    goToDetail(item) {
      uni.navigateTo({ url: `/pages/culture/detail?id=${item.id}` })
    },
    formatViews(views) {
      if (views >= 10000) {
        return (views / 10000).toFixed(1) + '万'
      }
      return views.toString()
    },
    toggleLike(item) {
      item.isLiked = !item.isLiked
      item.likes += item.isLiked ? 1 : -1
      uni.showToast({
        title: item.isLiked ? '已收藏' : '取消收藏',
        icon: 'success'
      })
    },
    shareArticle(item) {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    },
    showQuiz() {
      this.showQuizModal = true
      this.resetQuiz()
    },
    closeQuiz() {
      this.showQuizModal = false
    },
    closeComplete() {
      this.showCompleteModal = false
      this.showQuizModal = false
    },
    resetQuiz() {
      this.currentQuestionIndex = 0
      this.selectedAnswer = null
      this.showResult = false
      this.correctCount = 0
    },
    selectAnswer(index) {
      if (this.showResult) return
      this.selectedAnswer = index
    },
    submitAnswer() {
      if (this.selectedAnswer === null) return
      this.showResult = true
      if (this.isCorrect) {
        this.correctCount++
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
        this.currentQuestionIndex++
        this.selectedAnswer = null
        this.showResult = false
      } else {
        this.showCompleteModal = true
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F5F0E1;
}

/* 顶部标题 */
.culture-header {
  padding: 40rpx 24rpx 20rpx;
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

.category-tab {
  display: inline-block;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
  transition: all 0.2s;
}

.category-tab.active {
  color: #9E2B25;
  font-weight: 500;
}

.category-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #9E2B25;
  border-radius: 2rpx;
}

/* 内容列表 */
.content-list {
  height: calc(100vh - 350rpx);
  padding: 24rpx;
}

.culture-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.card-image-wrap {
  position: relative;
  height: 360rpx;
}

.card-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1D2B53, #2A3D6B);
}

.card-category-tag {
  position: absolute;
  left: 20rpx;
  top: 20rpx;
  background: rgba(158, 43, 37, 0.9);
  color: #FFFFFF;
  font-size: 22rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.card-content {
  padding: 24rpx;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.card-summary {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-stats {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #999;
}

.stat-icon {
  margin-right: 4rpx;
}

.card-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  font-size: 32rpx;
  padding: 8rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 知识问答入口 */
.quiz-entry {
  position: fixed;
  bottom: 120rpx;
  right: 24rpx;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #9E2B25, #B33630);
  color: #FFFFFF;
  padding: 20rpx 28rpx;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(158, 43, 37, 0.4);
  z-index: 100;
}

.quiz-content {
  display: flex;
  align-items: center;
}

.quiz-icon {
  font-size: 40rpx;
  margin-right: 12rpx;
}

.quiz-text {
  display: flex;
  flex-direction: column;
}

.quiz-title {
  font-size: 26rpx;
  font-weight: bold;
}

.quiz-desc {
  font-size: 20rpx;
  opacity: 0.8;
}

.quiz-arrow {
  font-size: 28rpx;
  margin-left: 16rpx;
}

/* 知识问答弹窗 */
.quiz-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quiz-modal-content {
  width: 90%;
  max-width: 700rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 24rpx;
  background: linear-gradient(135deg, #1D2B53, #2A3D6B);
}

.quiz-header-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.quiz-close {
  font-size: 48rpx;
  color: #FFFFFF;
  line-height: 1;
}

.quiz-progress {
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background: #E5E5E5;
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9E2B25, #C9A962);
  border-radius: 4rpx;
  transition: width 0.3s;
}

.progress-text {
  font-size: 24rpx;
  color: #666;
}

.quiz-body {
  padding: 0 24rpx 24rpx;
}

.question-text {
  display: block;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 24rpx;
  line-height: 1.5;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #F5F0E1;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;
}

.option-item.selected {
  border-color: #9E2B25;
  background: rgba(158, 43, 37, 0.1);
}

.option-item.correct {
  border-color: #52C41A;
  background: rgba(82, 196, 26, 0.1);
}

.option-item.wrong {
  border-color: #F5222D;
  background: rgba(245, 34, 45, 0.1);
}

.option-label {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-radius: 50%;
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
}

.option-item.selected .option-label {
  background: #9E2B25;
  color: #FFFFFF;
}

.option-text {
  font-size: 28rpx;
  color: #333;
}

.result-tip {
  margin-top: 24rpx;
  padding: 20rpx;
  background: #F9F9F9;
  border-radius: 12rpx;
}

.result-text {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.result-text.correct {
  color: #52C41A;
}

.result-text.wrong {
  color: #F5222D;
}

.explanation-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.quiz-footer {
  padding: 24rpx;
  border-top: 1rpx solid #E5E5E5;
}

.btn {
  height: 88rpx;
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

.btn-block {
  width: 100%;
}

/* 答题完成弹窗 */
.complete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.complete-modal-content {
  width: 80%;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
}

.complete-icon {
  font-size: 100rpx;
  display: block;
  margin-bottom: 24rpx;
}

.complete-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.complete-score {
  font-size: 48rpx;
  color: #9E2B25;
  font-weight: bold;
  display: block;
  margin-bottom: 16rpx;
}

.complete-message {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 40rpx;
  line-height: 1.5;
}
</style>
