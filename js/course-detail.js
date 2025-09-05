// 课程详情页面功能

// 课程详情管理器
const CourseDetailManager = {
    // 初始化
    init() {
        this.bindEvents();
        this.loadCourseData();
        this.initVideoPlayer();
        this.initScrollEffects();
    },
    
    // 绑定事件
    bindEvents() {
        // 标签切换
        Utils.Event.delegate(document, '.tab-btn', 'click', (e) => {
            this.switchTab(e.target.dataset.tab);
        });
        
        // 视频播放控制
        Utils.Event.delegate(document, '.play-btn', 'click', () => {
            this.toggleVideo();
        });
        
        // 购买和试听按钮
        Utils.Event.delegate(document, '.purchase-btn', 'click', () => {
            this.showPurchaseModal();
        });
        
        Utils.Event.delegate(document, '.trial-btn', 'click', () => {
            this.showTrialModal();
        });
        
        // 社交分享
        Utils.Event.delegate(document, '.share-btn', 'click', (e) => {
            this.shareContent(e.target.dataset.platform);
        });
        
        // 章节展开/收起
        Utils.Event.delegate(document, '.chapter-header', 'click', (e) => {
            this.toggleChapter(e.target.closest('.chapter-item'));
        });
        
        // 课时点击
        Utils.Event.delegate(document, '.lesson-item', 'click', (e) => {
            this.selectLesson(e.target);
        });
        
        // 滚动事件
        Utils.Event.throttle(window, 'scroll', () => {
            this.handleScroll();
        }, 100);
    },

    // 标签页切换功能
    switchTab(targetTab) {
        if (!targetTab) return;
        
        // 移除所有活跃状态
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // 添加活跃状态
        const activeBtn = document.querySelector(`[data-tab="${targetTab}"]`);
        const targetPanel = document.getElementById(targetTab);
        
        if (activeBtn) activeBtn.classList.add('active');
        if (targetPanel) {
            targetPanel.classList.add('active');
            
            // 添加淡入动画
            targetPanel.style.opacity = '0';
            targetPanel.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                targetPanel.style.opacity = '1';
                targetPanel.style.transform = 'translateY(0)';
            }, 10);
        }
    },

    // 视频播放控制
    toggleVideo() {
        const courseVideo = document.querySelector('.course-video');
        const playBtn = document.querySelector('.play-btn');
        
        if (courseVideo && playBtn) {
            if (courseVideo.paused) {
                courseVideo.play();
                playBtn.style.display = 'none';
            } else {
                courseVideo.pause();
                playBtn.style.display = 'flex';
            }
        }
    },

    // 显示购买模态框
    showPurchaseModal() {
        const modal = this.createModal({
            title: '购买课程',
            content: `
                <div class="purchase-modal">
                    <div class="course-summary">
                        <h4>JavaScript高级编程与实战应用</h4>
                        <div class="price-info">
                            <span class="current-price">¥199</span>
                            <span class="original-price">¥299</span>
                        </div>
                    </div>
                    <div class="payment-methods">
                        <h5>选择支付方式</h5>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="wechat" checked>
                                <span class="payment-icon">💳</span>
                                <span>微信支付</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="alipay">
                                <span class="payment-icon">💰</span>
                                <span>支付宝</span>
                            </label>
                        </div>
                    </div>
                    <div class="purchase-agreement">
                        <label>
                            <input type="checkbox" checked>
                            <span>我已阅读并同意<a href="#">购买协议</a>和<a href="#">退款政策</a></span>
                        </label>
                    </div>
                </div>
            `,
            actions: [
                {
                    text: '立即支付',
                    type: 'primary',
                    action: () => {
                        this.processPurchase();
                        modal.remove();
                    }
                },
                {
                    text: '取消',
                    type: 'secondary',
                    action: () => modal.remove()
                }
            ]
        });
    },

    // 显示试学模态框
    showTrialModal() {
        const modal = this.createModal({
            title: '免费试学',
            content: `
                <div class="trial-modal">
                    <p>您可以免费观看以下课程内容：</p>
                    <ul class="trial-lessons">
                        <li>✓ 第1章第1节：let和const声明 (15分钟)</li>
                        <li>✓ 课程介绍和学习指南 (10分钟)</li>
                    </ul>
                    <p class="trial-note">试学结束后，购买完整课程即可观看全部内容。</p>
                </div>
            `,
            actions: [
                {
                    text: '开始试学',
                    type: 'primary',
                    action: () => {
                        this.startTrial();
                        modal.remove();
                    }
                },
                {
                    text: '取消',
                    type: 'secondary',
                    action: () => modal.remove()
                }
            ]
        });
    },

    // 分享内容
    shareContent(platform) {
        const courseTitle = document.querySelector('.course-title')?.textContent || '课程';
        const courseUrl = window.location.href;
        
        let shareUrl = '';
        
        switch (platform) {
            case 'wechat':
                Utils.Notification.show('请使用微信扫码分享', 'info');
                break;
            case 'weibo':
                shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(courseUrl)}&title=${encodeURIComponent(courseTitle)}`;
                window.open(shareUrl, '_blank');
                break;
            case 'qq':
                shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(courseUrl)}&title=${encodeURIComponent(courseTitle)}`;
                window.open(shareUrl, '_blank');
                break;
            case 'link':
                navigator.clipboard.writeText(courseUrl).then(() => {
                    Utils.Notification.show('链接已复制到剪贴板', 'success');
                }).catch(() => {
                    Utils.Notification.show('复制失败，请手动复制链接', 'error');
                });
                break;
        }
    },

    // 章节展开/收起
    toggleChapter(chapterItem) {
        if (!chapterItem) return;
        
        const lessonList = chapterItem.querySelector('.lesson-list');
        if (!lessonList) return;
        
        if (lessonList.style.display === 'none' || !lessonList.style.display) {
            lessonList.style.display = 'block';
            lessonList.style.animation = 'slideDown 0.3s ease';
        } else {
            lessonList.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                lessonList.style.display = 'none';
            }, 300);
        }
    },

    // 选择课时
    selectLesson(lessonItem) {
        if (!lessonItem) return;
        
        const lessonTitle = lessonItem.querySelector('.lesson-title')?.textContent || '课时';
        const lessonStatus = lessonItem.querySelector('.lesson-status');
        
        if (lessonStatus && lessonStatus.classList.contains('free')) {
            Utils.Notification.show(`正在播放: ${lessonTitle}`, 'info');
            // 这里可以添加实际的视频播放逻辑
        } else {
            Utils.Notification.show('请购买课程后观看', 'warning');
        }
    },

    // 滚动处理
    handleScroll() {
        const sidebar = document.querySelector('.course-sidebar');
        const header = document.querySelector('.header');
        
        if (sidebar && header) {
            const headerHeight = header.offsetHeight;
            const scrollTop = window.pageYOffset;
            
            if (scrollTop > headerHeight) {
                sidebar.style.top = '20px';
            } else {
                sidebar.style.top = (headerHeight - scrollTop + 20) + 'px';
            }
        }
    },

    // 初始化视频播放器
    initVideoPlayer() {
        const courseVideo = document.querySelector('.course-video');
        const playBtn = document.querySelector('.play-btn');
        
        if (playBtn && courseVideo) {
            playBtn.addEventListener('click', () => {
                this.toggleVideo();
            });
            
            courseVideo.addEventListener('pause', () => {
                if (playBtn) playBtn.style.display = 'flex';
            });
            
            courseVideo.addEventListener('play', () => {
                if (playBtn) playBtn.style.display = 'none';
            });
            
            // 视频加载错误处理
            courseVideo.addEventListener('error', () => {
                Utils.Notification.show('视频加载失败，请稍后重试', 'error');
            });
        }
    },

    // 初始化滚动效果
    initScrollEffects() {
        // 滚动效果已在 handleScroll 方法中处理
    },

    // 加载课程数据
    loadCourseData() {
        // 模拟从服务器加载数据
        setTimeout(() => {
            this.updateCourseStats();
            this.loadRelatedCourses();
        }, 500);
    },

    // 更新课程统计
    updateCourseStats() {
        const viewCount = document.querySelector('.meta-item:last-child span');
        if (viewCount) {
            let currentCount = parseInt(viewCount.textContent.replace(/[^\d]/g, ''));
            currentCount += Math.floor(Math.random() * 10);
            viewCount.textContent = `学习人数：${currentCount.toLocaleString()}`;
        }
    },

    // 加载相关课程
    loadRelatedCourses() {
        const relatedCourses = [
            {
                title: 'React实战开发',
                price: '¥159',
                image: 'images/related1.jpg'
            },
            {
                title: 'Vue.js进阶',
                price: '¥179',
                image: 'images/related2.jpg'
            },
            {
                title: 'Node.js后端开发',
                price: '¥199',
                image: 'images/related3.jpg'
            }
        ];
        
        const relatedContainer = document.querySelector('.related-courses');
        if (relatedContainer) {
            // 清除现有内容（保留标题）
            const title = relatedContainer.querySelector('h3');
            relatedContainer.innerHTML = '';
            if (title) relatedContainer.appendChild(title);
            
            // 添加相关课程
            relatedCourses.forEach(course => {
                const courseElement = this.createRelatedCourseElement(course);
                relatedContainer.appendChild(courseElement);
            });
        }
    },

    // 创建相关课程元素
    createRelatedCourseElement(course) {
        const item = document.createElement('div');
        item.className = 'related-course-item';
        
        item.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="related-thumb" onerror="this.src='images/default-course.jpg'">
            <div class="related-info">
                <h4>${course.title}</h4>
                <p class="related-price">${course.price}</p>
            </div>
        `;
        
        item.addEventListener('click', () => {
            Utils.Notification.show(`正在跳转到《${course.title}》`, 'info');
            // 这里可以添加实际的跳转逻辑
        });
        
        return item;
    },

    // 创建通用模态框
    createModal({ title, content, actions }) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    const actionsHtml = actions.map(action => 
        `<button class="btn btn-${action.type}" data-action="${action.text}">${action.text}</button>`
    ).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${actionsHtml}
            </div>
        </div>
    `;
    
    // 添加样式
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: var(--bg-primary);
                border-radius: var(--radius-medium);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-heavy);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-lg);
                border-bottom: 1px solid var(--border-light);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--text-secondary);
            }
            .modal-body {
                padding: var(--spacing-lg);
            }
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: var(--spacing-sm);
                padding: var(--spacing-lg);
                border-top: 1px solid var(--border-light);
            }
            .purchase-modal .course-summary {
                text-align: center;
                margin-bottom: var(--spacing-lg);
                padding: var(--spacing-lg);
                background: var(--bg-secondary);
                border-radius: var(--radius-medium);
            }
            .purchase-modal .price-info {
                margin-top: var(--spacing-sm);
            }
            .purchase-modal .current-price {
                font-size: var(--font-size-xl);
                font-weight: var(--font-weight-bold);
                color: var(--error-color);
                margin-right: var(--spacing-sm);
            }
            .purchase-modal .original-price {
                text-decoration: line-through;
                color: var(--text-tertiary);
            }
            .payment-methods h5 {
                margin-bottom: var(--spacing-md);
                color: var(--text-primary);
            }
            .payment-options {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
                margin-bottom: var(--spacing-lg);
            }
            .payment-option {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-md);
                border: 1px solid var(--border-light);
                border-radius: var(--radius-medium);
                cursor: pointer;
                transition: var(--transition-fast);
            }
            .payment-option:hover {
                border-color: var(--primary-color);
                background: var(--primary-light);
            }
            .payment-option input[type="radio"]:checked + .payment-icon + span {
                color: var(--primary-color);
                font-weight: var(--font-weight-bold);
            }
            .trial-lessons {
                list-style: none;
                padding: 0;
                margin: var(--spacing-md) 0;
            }
            .trial-lessons li {
                padding: var(--spacing-sm) 0;
                color: var(--text-secondary);
            }
            .trial-note {
                color: var(--text-tertiary);
                font-size: var(--font-size-sm);
                font-style: italic;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    
    // 绑定事件
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    // 绑定动作按钮
    actions.forEach(action => {
        const btn = modal.querySelector(`[data-action="${action.text}"]`);
        if (btn) {
            btn.addEventListener('click', action.action);
        }
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
},

    // 处理购买
    processPurchase() {
        Utils.Notification.show('正在处理支付...', 'info');
        
        // 模拟支付处理
        setTimeout(() => {
            Utils.Notification.show('支付成功！课程已添加到您的学习列表', 'success');
            
            // 更新购买按钮状态
            const purchaseBtn = document.querySelector('.purchase-btn');
            if (purchaseBtn) {
                purchaseBtn.textContent = '开始学习';
                purchaseBtn.classList.remove('btn-primary');
                purchaseBtn.classList.add('btn-success');
            }
        }, 2000);
    },

    // 开始试学
    startTrial() {
        Utils.Notification.show('正在准备试学内容...', 'info');
        
        setTimeout(() => {
            Utils.Notification.show('试学开始！', 'success');
            // 这里可以添加实际的试学逻辑
        }, 1000);
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    CourseDetailManager.init();
});

// 显示通知函数（保持向后兼容）
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    notification.style.cssText = style;
    
    switch (type) {
        case 'success':
            notification.style.background = '#52c41a';
            break;
        case 'error':
            notification.style.background = '#ff4d4f';
            break;
        case 'warning':
            notification.style.background = '#faad14';
            break;
        default:
            notification.style.background = '#1890ff';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 添加动画样式
if (!document.querySelector('#course-detail-animations')) {
    const animationStyle = document.createElement('style');
    animationStyle.id = 'course-detail-animations';
    animationStyle.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes slideDown {
            from {
                max-height: 0;
                opacity: 0;
            }
            to {
                max-height: 500px;
                opacity: 1;
            }
        }
        
        @keyframes slideUp {
            from {
                max-height: 500px;
                opacity: 1;
            }
            to {
                max-height: 0;
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(animationStyle);
}