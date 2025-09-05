/**
 * 推荐课程模块
 * 使用工具函数库优化代码质量
 */

// 推荐课程数据配置
const CourseConfig = {
  courses: [
    {
      id: 1,
      title: '2024考研政治精讲班',
      type: '录播课程',
      image: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6nfw9120t1u.png?imageView2/2/w/1050/q/100|imageMogr2/ignore-error/1',
      price: 199.00,
      originalPrice: 299.00,
      purchaseCount: 2890,
      category: 'politics',
      level: 'intermediate'
    },
    {
      id: 2,
      title: '考研数学基础强化班',
      type: '直播课程',
      image: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6nfw9120t1u.png?imageView2/2/w/1050/q/100|imageMogr2/ignore-error/1',
      price: 299.00,
      originalPrice: 399.00,
      purchaseCount: 1560,
      category: 'math',
      level: 'beginner'
    },
    {
      id: 3,
      title: '英语四级冲刺班',
      type: '系统课程',
      image: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6nfw9120t1u.png?imageView2/2/w/1050/q/100|imageMogr2/ignore-error/1',
      price: 159.00,
      originalPrice: 259.00,
      purchaseCount: 3420,
      category: 'english',
      level: 'intermediate'
    }
  ],
  
  types: {
    '录播课程': 'recorded',
    '直播课程': 'live',
    '系统课程': 'systematic'
  }
};

// 推荐课程管理器
const RecommendationManager = {
  init() {
    this.container = document.getElementById('recommendationList');
    if (!this.container) {
      console.warn('推荐课程容器未找到');
      return;
    }
    
    this.render();
    this.bindEvents();
  },
  
  // 渲染课程列表
  render() {
    try {
      Utils.DOM.empty(this.container);
      
      CourseConfig.courses.forEach((course, index) => {
        const courseElement = this.createCourseElement(course);
        this.container.appendChild(courseElement);
        
        // 添加渐入动画
        setTimeout(() => {
          Utils.Animation.fadeIn(courseElement, 300);
        }, index * 100);
      });
      
      Utils.Notification.success(`成功加载 ${CourseConfig.courses.length} 门推荐课程`);
    } catch (error) {
      console.error('渲染课程列表失败:', error);
      Utils.Notification.error('课程列表加载失败');
    }
  },
  
  // 创建课程元素
   createCourseElement(course) {
     const courseElement = document.createElement('div');
     courseElement.className = 'course-item';
     courseElement.dataset.courseId = course.id;
     courseElement.dataset.category = course.category;
     
     const discountPercent = Math.round((1 - course.price / course.originalPrice) * 100);
     
     courseElement.innerHTML = `
       <div class="course-image">
         <img src="${course.image}" 
              alt="${course.title}" 
              loading="lazy"
              onerror="this.src='https://via.placeholder.com/300x200?text=Course+Image'">
         <span class="course-type">${course.type}</span>
         <div class="course-discount">${discountPercent}% OFF</div>
       </div>
       <div class="course-info">
         <h3 class="course-title">${course.title}</h3>
         <div class="course-price-info">
           <div class="price-container">
             <span class="current-price">¥${this.formatPrice(course.price)}</span>
             <span class="original-price">¥${this.formatPrice(course.originalPrice)}</span>
           </div>
           <span class="purchase-count">${this.formatPurchaseCount(course.purchaseCount)}</span>
         </div>
         <div class="course-actions">
           <button class="btn-primary add-to-cart" data-course-id="${course.id}">
             <i class="icon-cart"></i> 立即购买
           </button>
           <button class="btn-secondary favorite" data-course-id="${course.id}">
             <i class="icon-heart"></i>
           </button>
         </div>
       </div>
     `;
     
     return courseElement;
   },
  
  // 格式化价格显示
  formatPrice(price) {
    return price.toFixed(2);
  },
  
  // 格式化购买人数
  formatPurchaseCount(count) {
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '万人购买';
    }
    return count.toLocaleString() + '人购买';
  },
  
  // 绑定事件
  bindEvents() {
    // 使用事件委托处理课程卡片点击
    Utils.Event.on(this.container, 'click', (e) => {
      const target = e.target;
      const courseItem = target.closest('.course-item');
      
      if (!courseItem) return;
      
      const courseId = parseInt(courseItem.dataset.courseId);
      const course = CourseConfig.courses.find(c => c.id === courseId);
      
      if (!course) return;
      
      // 购买按钮
      if (target.closest('.add-to-cart')) {
        Utils.Event.stopPropagation(e);
        this.handlePurchase(course);
        return;
      }
      
      // 收藏按钮
      if (target.closest('.favorite')) {
        Utils.Event.stopPropagation(e);
        this.handleFavorite(course, target.closest('.favorite'));
        return;
      }
      
      // 课程卡片点击
      this.handleCourseClick(course);
    });
    
    // 鼠标悬停效果
    Utils.Event.on(this.container, 'mouseenter', (e) => {
      const courseItem = e.target.closest('.course-item');
      if (courseItem) {
        Utils.DOM.addClass(courseItem, 'hovered');
      }
    }, true);
    
    Utils.Event.on(this.container, 'mouseleave', (e) => {
      const courseItem = e.target.closest('.course-item');
      if (courseItem) {
        Utils.DOM.removeClass(courseItem, 'hovered');
      }
    }, true);
  },
  
  // 处理购买
  handlePurchase(course) {
    Utils.Notification.info(`正在跳转到《${course.title}》购买页面...`);
    
    // 模拟购买流程
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% 成功率
      if (success) {
        Utils.Notification.success(`《${course.title}》购买成功！`);
        this.updatePurchaseCount(course.id);
      } else {
        Utils.Notification.error('购买失败，请重试');
      }
    }, 1000);
  },
  
  // 处理收藏
  handleFavorite(course, button) {
    const isFavorited = Utils.DOM.hasClass(button, 'favorited');
    
    if (isFavorited) {
      Utils.DOM.removeClass(button, 'favorited');
      Utils.Notification.info(`已取消收藏《${course.title}》`);
    } else {
      Utils.DOM.addClass(button, 'favorited');
      Utils.Notification.success(`已收藏《${course.title}》`);
    }
    
    // 保存收藏状态
    this.saveFavoriteState(course.id, !isFavorited);
  },
  
  // 处理课程点击
  handleCourseClick(course) {
    Utils.Notification.info(`正在跳转到《${course.title}》详情页...`);
    console.log('查看课程详情:', course);
  },
  
  // 更新购买人数
  updatePurchaseCount(courseId) {
    const course = CourseConfig.courses.find(c => c.id === courseId);
    if (course) {
      course.purchaseCount += 1;
      
      // 更新显示
      const courseElement = Utils.DOM.querySelector(`[data-course-id="${courseId}"]`, this.container);
      if (courseElement) {
        const countElement = Utils.DOM.querySelector('.purchase-count', courseElement);
        if (countElement) {
          countElement.textContent = this.formatPurchaseCount(course.purchaseCount);
        }
      }
    }
  },
  
  // 保存收藏状态
  saveFavoriteState(courseId, isFavorited) {
    const favorites = Utils.Storage.getLocal('courseFavorites') || [];
    
    if (isFavorited && !favorites.includes(courseId)) {
      favorites.push(courseId);
    } else if (!isFavorited) {
      const index = favorites.indexOf(courseId);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }
    
    Utils.Storage.setLocal('courseFavorites', favorites);
  },
  
  // 加载收藏状态
  loadFavoriteStates() {
    const favorites = Utils.Storage.getLocal('courseFavorites') || [];
    
    favorites.forEach(courseId => {
      const courseElement = Utils.DOM.querySelector(`[data-course-id="${courseId}"]`, this.container);
      if (courseElement) {
        const favoriteBtn = Utils.DOM.querySelector('.favorite', courseElement);
        if (favoriteBtn) {
          Utils.DOM.addClass(favoriteBtn, 'favorited');
        }
      }
    });
  },
  
  // 筛选课程
  filterCourses(category = null) {
    const courseElements = Utils.DOM.querySelectorAll('.course-item', this.container);
    
    courseElements.forEach(element => {
      if (!category || element.dataset.category === category) {
        Utils.Animation.fadeIn(element, 200);
        Utils.DOM.removeClass(element, 'hidden');
      } else {
        Utils.Animation.fadeOut(element, 200);
        Utils.DOM.addClass(element, 'hidden');
      }
    });
  },
  
  // 搜索课程
  searchCourses(query) {
    if (!query.trim()) {
      this.render();
      return;
    }
    
    const filteredCourses = CourseConfig.courses.filter(course => {
      return course.title.toLowerCase().includes(query.toLowerCase()) ||
             course.type.toLowerCase().includes(query.toLowerCase());
    });
    
    this.renderFilteredCourses(filteredCourses);
    
    if (filteredCourses.length === 0) {
      Utils.Notification.info(`未找到包含"${query}"的课程`);
    }
  },
  
  // 渲染筛选后的课程
  renderFilteredCourses(courses) {
    Utils.DOM.empty(this.container);
    
    if (courses.length === 0) {
      const noResultElement = Utils.DOM.createElement('div', {
        className: 'no-results',
        textContent: '暂无符合条件的课程'
      });
      this.container.appendChild(noResultElement);
      return;
    }
    
    courses.forEach((course, index) => {
      const courseElement = this.createCourseElement(course);
      this.container.appendChild(courseElement);
      
      setTimeout(() => {
        Utils.Animation.fadeIn(courseElement, 300);
      }, index * 100);
    });
  }
};

// 页面加载完成后初始化推荐列表
document.addEventListener('DOMContentLoaded', function() {
  try {
    RecommendationManager.init();
    
    // 延迟加载收藏状态
    setTimeout(() => {
      RecommendationManager.loadFavoriteStates();
    }, 500);
    
    console.log('推荐课程模块初始化完成');
  } catch (error) {
    console.error('推荐课程模块初始化失败:', error);
    Utils.Notification.error('推荐课程加载失败，请刷新重试');
  }
});