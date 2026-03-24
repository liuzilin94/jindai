// 数字锦带 - Mock 数据

// 轮播图数据
export const bannerList = [
  {
    id: 1,
    image: '/static/images/banner1.jpg',
    title: '千年藏域锦带',
    subtitle: '一键定制专属非遗'
  },
  {
    id: 2,
    image: '/static/images/banner2.jpg',
    title: '非遗工坊',
    subtitle: '传承千年编织技艺'
  },
  {
    id: 3,
    image: '/static/images/banner3.jpg',
    title: '数字锦带',
    subtitle: '让非遗走进生活'
  }
]

// 功能入口数据
export const menuList = [
  {
    id: 1,
    name: '锦带定制',
    icon: '/static/icons/custom-icon.png',
    path: '/pages/custom/index',
    color: '#9E2B25'
  },
  {
    id: 2,
    name: '成品商城',
    icon: '/static/icons/shop-icon.png',
    path: '/pages/shop/index',
    color: '#1D2B53'
  },
  {
    id: 3,
    name: '文化科普',
    icon: '/static/icons/culture-icon.png',
    path: '/pages/culture/index',
    color: '#C9A962'
  },
  {
    id: 4,
    name: '我的',
    icon: '/static/icons/profile-icon.png',
    path: '/pages/profile/index',
    color: '#666666'
  }
]

// 固定纹样数据
export const patterns = [
  {
    id: 1,
    name: '孔雀纹',
    category: '吉祥类',
    description: '象征吉祥富贵，寓意美好幸福',
    color: '#9E2B25',
    bgColor: '#FFF5F5'
  },
  {
    id: 2,
    name: '彩虹纹',
    category: '自然类',
    description: '象征七彩祥云，带来好运与希望',
    color: '#C9A962',
    bgColor: '#FFFEF5'
  },
  {
    id: 3,
    name: '达玛花纹',
    category: '吉祥类',
    description: '藏传佛教吉祥纹样，寓意平安吉祥',
    color: '#1D2B53',
    bgColor: '#F5F7FF'
  },
  {
    id: 4,
    name: '格萨尔王纹',
    category: '文化类',
    description: '藏族史诗英雄象征，寓意英勇无畏',
    color: '#8B5A2B',
    bgColor: '#FFF9F5'
  },
  {
    id: 5,
    name: '祥云纹',
    category: '吉祥类',
    description: '祥云缭绕，寓意吉祥如意',
    color: '#1D2B53',
    bgColor: '#F5F7FF'
  },
  {
    id: 6,
    name: '雪山纹',
    category: '自然类',
    description: '巍峨雪山，寓意坚韧不拔',
    color: '#4A90A4',
    bgColor: '#F5FAFF'
  },
  {
    id: 7,
    name: '法轮纹',
    category: '文化类',
    description: '佛法传承，寓意智慧与觉悟',
    color: '#9E2B25',
    bgColor: '#FFF5F5'
  },
  {
    id: 8,
    name: '莲花纹',
    category: '吉祥类',
    description: '出淤泥不染，寓意纯洁高雅',
    color: '#C9A962',
    bgColor: '#FFFEF5'
  }
]

// 纹样分类
export const patternCategories = ['全部', '吉祥类', '自然类', '文化类']

// 商品分类
export const productCategories = [
  { id: 1, name: '日常实用系列', icon: 'daily' },
  { id: 2, name: '文创伴手系列', icon: 'gift' },
  { id: 3, name: '高端收藏系列', icon: 'premium' },
  { id: 4, name: '定制成品系列', icon: 'custom' }
]

// 商品数据
export const products = [
  {
    id: 1,
    name: '经典彩虹纹锦带',
    tag: '彩虹纹',
    price: 168,
    originalPrice: 218,
    sales: 520,
    images: ['/static/images/product1.jpg', '/static/images/product1-2.jpg'],
    description: '采用优质棉麻材质，经典彩虹纹设计，适合日常佩戴。彩虹纹象征七彩祥云，带来好运与希望。',
    material: '棉麻',
    size: '常规款（宽2cm）',
    category: 1
  },
  {
    id: 2,
    name: '吉祥孔雀纹锦带',
    tag: '孔雀纹',
    price: 198,
    originalPrice: 268,
    sales: 380,
    images: ['/static/images/product2.jpg', '/static/images/product2-2.jpg'],
    description: '精致孔雀纹锦带，寓意吉祥富贵。精选抗菌纤维材质，柔软舒适，持久耐用。',
    material: '抗菌纤维',
    size: '常规款（宽2cm）',
    category: 1
  },
  {
    id: 3,
    name: '达玛花纹商务锦带',
    tag: '达玛花纹',
    price: 288,
    originalPrice: 358,
    sales: 256,
    images: ['/static/images/product3.jpg', '/static/images/product3-2.jpg'],
    description: '达玛花纹设计，藏传佛教吉祥纹样，寓意平安吉祥。适合商务场合佩戴。',
    material: '尼龙',
    size: '细款（宽1.5cm）',
    category: 2
  },
  {
    id: 4,
    name: '格萨尔王纹收藏款',
    tag: '格萨尔王纹',
    price: 598,
    originalPrice: 798,
    sales: 128,
    images: ['/static/images/product4.jpg', '/static/images/product4-2.jpg'],
    description: '高端收藏级锦带，格萨尔王纹设计，限量制作。纯手工编织，收藏价值极高。',
    material: '纯棉',
    size: '宽款（宽3cm）',
    category: 3
  },
  {
    id: 5,
    name: '祥云纹日常款',
    tag: '祥云纹',
    price: 128,
    originalPrice: 168,
    sales: 892,
    images: ['/static/images/product5.jpg', '/static/images/product5-2.jpg'],
    description: '简约祥云纹设计，寓意吉祥如意。轻薄透气，适合日常各种场合。',
    material: '棉麻',
    size: '常规款（宽2cm）',
    category: 1
  },
  {
    id: 6,
    name: '雪山纹旅行款',
    tag: '雪山纹',
    price: 188,
    originalPrice: 228,
    sales: 345,
    images: ['/static/images/product6.jpg', '/static/images/product6-2.jpg'],
    description: '巍峨雪山图案，寓意坚韧不拔。耐磨材质，适合旅行户外佩戴。',
    material: '尼龙',
    size: '常规款（宽2cm）',
    category: 2
  }
]

// 文化科普数据
export const cultures = [
  {
    id: 1,
    title: '孔雀纹：藏域吉祥之象征',
    category: '纹样文化',
    summary: '孔雀纹是藏域锦带中最具代表性的吉祥纹样之一，象征着吉祥富贵、美好幸福。',
    content: '孔雀纹源自藏族传统文化中对孔雀的崇拜。在藏传佛教中，孔雀象征着智慧与美丽，代表着吉祥如意的美好祝愿。\n\n孔雀纹样通常以对称的几何图案呈现，线条流畅优美，色彩鲜艳夺目。纹样设计融合了自然之美与艺术之韵，体现了藏族人民对美好生活的向往和追求。\n\n在重要节日和仪式中，佩戴孔雀纹锦带是吉祥的象征，人们相信它能带来好运与祝福。',
    image: '/static/images/culture1.jpg',
    views: 12580,
    likes: 892
  },
  {
    id: 2,
    title: '千年编织技艺传承',
    category: '编织技艺',
    summary: '藏域锦带的编织技艺已有千年历史，是藏族非物质文化遗产的重要组成部分。',
    content: '藏域锦带的编织技艺始于唐代，历经千年传承至今。这项技艺在2019年被列入省级非物质文化遗产名录。\n\n编织锦带需要经过选线、配色、绘图、编织等多道工序。传统工艺采用脚踏编织机，匠人需要经过数年学习才能熟练掌握。\n\n每一条锦带都凝聚着匠人的心血与智慧，是藏族人民智慧的结晶。',
    image: '/static/images/culture2.jpg',
    views: 9876,
    likes: 654
  },
  {
    id: 3,
    title: '数字锦带创始人：达玛女神的故事',
    category: '非遗故事',
    summary: '达玛女神是藏传佛教中的编织保护神，相传她传授了人类编织锦带的技术。',
    content: '在藏族传说中，达玛女神是编织技艺的保护神。相传在很久以前，藏区的牧民们只会用简单的绳结绑缚物品。\n\n有一天，达玛女神化作一位老奶奶来到人间，她教会了牧民们如何种植亚麻、如何纺线、如何编织锦带。从此，锦带成为了藏区人民生活中不可或缺的装饰品。\n\n为了纪念达玛女神的恩德，人们在锦带上编织出美丽的达玛花纹，这便是达玛花纹的由来。',
    image: '/static/images/culture3.jpg',
    views: 15432,
    likes: 1203
  },
  {
    id: 4,
    title: '达玛女神IP文化解读',
    category: '达玛女神IP',
    summary: '达玛女神是数字锦带品牌的灵感来源，代表着传承与创新。',
    content: '达玛女神是数字锦带品牌的核心文化符号。我们以达玛女神的形象为蓝本，设计了一系列具有藏族特色的IP形象。\n\n达玛女神代表着智慧、美丽和善良，她是藏族编织技艺的保护神，也是数字锦带品牌精神的象征。\n\n我们将传统藏域文化与现代设计理念相结合，让古老的非遗技艺焕发新的生机与活力。',
    image: '/static/images/culture4.jpg',
    views: 8765,
    likes: 543
  },
  {
    id: 5,
    title: '锦带纹样的文化寓意',
    category: '纹样文化',
    summary: '每一种锦带纹样都蕴含着深厚的文化内涵和美好的寓意。',
    content: '藏域锦带的纹样设计丰富多彩，每一种纹样都有其独特的文化内涵：\n\n1. 孔雀纹：象征吉祥富贵\n2. 彩虹纹：象征七彩祥云\n3. 达玛花纹：象征平安吉祥\n4. 格萨尔王纹：象征英勇无畏\n5. 祥云纹：象征吉祥如意\n6. 雪山纹：象征坚韧不拔\n\n这些纹样不仅美观大方，更寄托了人们对美好生活的向往和追求。',
    image: '/static/images/culture5.jpg',
    views: 11234,
    likes: 789
  },
  {
    id: 6,
    title: '锦带制作工序详解',
    category: '编织技艺',
    summary: '从选材到成品，一条锦带需要经过数十道工序。',
    content: '传统锦带的制作过程非常繁琐，需要经过以下主要工序：\n\n1. 选材：选用优质棉麻或动物毛纤维\n2. 纺线：将原材料纺成细线\n3. 染色：使用天然染料进行配色\n4. 设计：根据纹样图纸设计编织方案\n5. 编织：使用传统编织机进行编织\n6. 整理：对成品进行修剪和整理\n7. 质检：检查锦带的质量和图案\n\n每一道工序都需要匠人的精心操作，才能制作出一条高品质的锦带。',
    image: '/static/images/culture6.jpg',
    views: 7654,
    likes: 432
  }
]

// 文化分类
export const cultureCategories = ['全部', '纹样文化', '编织技艺', '非遗故事', '达玛女神IP']

// 非遗知识问答
export const quizQuestions = [
  {
    id: 1,
    question: '达玛花纹的寓意是什么？',
    options: ['英勇无畏', '平安吉祥', '吉祥富贵', '纯洁高雅'],
    answer: 1,
    explanation: '达玛花纹源自藏传佛教，是吉祥纹样，寓意平安吉祥。'
  },
  {
    id: 2,
    question: '孔雀纹象征着什么？',
    options: ['智慧', '吉祥富贵', '坚韧不拔', '爱情'],
    answer: 1,
    explanation: '孔雀纹象征吉祥富贵，是藏域锦带中最具代表性的吉祥纹样之一。'
  },
  {
    id: 3,
    question: '藏域锦带编织技艺被列为什么级别非遗？',
    options: ['国家级', '省级', '市级', '县级'],
    answer: 1,
    explanation: '藏域锦带的编织技艺在2019年被列入省级非物质文化遗产名录。'
  }
]

// 锦带规格选项
export const specs = {
  size: [
    { id: 'normal', name: '常规款（宽2cm）', price: 0 },
    { id: 'thin', name: '细款（宽1.5cm）', price: -10 },
    { id: 'wide', name: '宽款（宽3cm）', price: 20 }
  ],
  material: [
    { id: 'cotton', name: '棉麻', price: 0 },
    { id: 'nylon', name: '尼龙', price: 15 },
    { id: 'antibacterial', name: '抗菌纤维', price: 30 }
  ],
  accessory: [
    { id: 'none', name: '无配件', price: 0 },
    { id: 'lobster', name: '龙虾扣', price: 10 },
    { id: 'magnetic', name: '磁吸扣', price: 15 }
  ]
}

// 价格计算
export const calculatePrice = (customData) => {
  let basePrice = 99  // 基础定制费
  let patternFee = 0  // 纹样费
  let handDrawFee = 0 // 手绘费
  let specFee = 0    // 规格升级费
  
  // 纹样费（每个格子10元）
  const filledCells = customData.patterns.filter(p => p !== null).length
  patternFee = filledCells * 10
  
  // 手绘费
  if (customData.handDrawCount > 0) {
    handDrawFee = customData.handDrawCount * 30
  }
  
  // 规格费用
  specFee = customData.size.price + customData.material.price + customData.accessory.price
  
  // 刻字费
  const textFee = customData.text ? 20 : 0
  
  return {
    basePrice,
    patternFee,
    handDrawFee,
    specFee,
    textFee,
    total: basePrice + patternFee + handDrawFee + specFee + textFee
  }
}
