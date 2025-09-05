// 用户个人中心页面功能

// 用户中心管理器
const UserCenterManager = {
    // 初始化
    init() {
        this.bindEvents();
        this.loadUserData();
        this.initProgressChart();
    },
    
    // 绑定事件
    bindEvents() {
        // 标签切换
        Utils.Event.delegate(document, '.nav-link', 'click', (e) => {
            e.preventDefault();
            const navLink = e.target.closest('.nav-link');
            console.log('点击导航链接:', navLink, navLink ? navLink.dataset.tab : 'null');
            if (navLink && navLink.dataset.tab) {
                this.switchTab(navLink.dataset.tab);
            }
        });
        
        // 课程筛选
        Utils.Event.delegate(document, '.filter-btn', 'click', (e) => {
            this.filterCourses(e.target.dataset.filter);
        });
        
        // 继续学习按钮
        Utils.Event.delegate(document, '.btn', 'click', (e) => {
            if (e.target.textContent.includes('继续学习')) {
                this.continueLearning(e.target.dataset.courseId);
            }
        });
        
        // 证书查看
        Utils.Event.delegate(document, '.certificate-card .btn', 'click', (e) => {
            this.viewCertificate();
        });
        
        // 订阅管理
        Utils.Event.delegate(document, '.subscription-actions .btn', 'click', (e) => {
            this.manageSubscription(e.target);
        });
        
        // 设置保存
        Utils.Event.delegate(document, '.settings-form .btn-primary', 'click', (e) => {
            this.saveSettings();
        });
    },

    // 标签页切换功能
    switchTab(targetTab) {
        console.log('切换到标签页:', targetTab);
        if (!targetTab) return;
        
        // 移除所有活跃状态
        Utils.DOM.removeClassFromAll('.nav-link', 'active');
        Utils.DOM.removeClassFromAll('.tab-panel', 'active');
        
        // 添加活跃状态
        const activeLink = document.querySelector(`[data-tab="${targetTab}"]`);
        const targetPanel = document.getElementById(targetTab);
        
        if (activeLink) activeLink.classList.add('active');
        if (targetPanel) {
            targetPanel.classList.add('active');
            
            // 如果是进度页面，重新绘制图表
            if (targetTab === 'progress') {
                setTimeout(() => {
                    this.drawProgressChart();
                }, 100);
            }
        }
    },

    // 课程过滤功能
    filterCourses(filter) {
        if (!filter) return;
        
        // 更新按钮状态
        Utils.DOM.removeClassFromAll('.filter-btn', 'active');
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        // 过滤课程卡片
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            const status = card.getAttribute('data-status');
            
            if (filter === 'all' || status === filter) {
                Utils.DOM.show(card);
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                Utils.DOM.hide(card);
            }
        });
    },

    // 初始化进度图表
    initProgressChart() {
        const canvas = document.getElementById('progressChart');
        if (canvas) {
            this.drawProgressChart();
        }
    },

    // 绘制进度图表
    drawProgressChart() {
        const canvas = document.getElementById('progressChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 模拟数据
        const data = [
            { day: '周一', hours: 2.5 },
            { day: '周二', hours: 1.8 },
            { day: '周三', hours: 3.2 },
            { day: '周四', hours: 2.1 },
            { day: '周五', hours: 2.8 },
            { day: '周六', hours: 4.0 },
            { day: '周日', hours: 3.5 }
        ];
        
        const maxHours = Math.max(...data.map(d => d.hours));
        const barWidth = width / data.length * 0.6;
        const barSpacing = width / data.length * 0.4;
        
        // 绘制柱状图
        data.forEach((item, index) => {
            const barHeight = (item.hours / maxHours) * (height - 60);
            const x = index * (barWidth + barSpacing) + barSpacing / 2;
            const y = height - barHeight - 30;
            
            // 绘制柱子
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#1890ff');
            gradient.addColorStop(1, '#40a9ff');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // 绘制数值
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.hours + 'h', x + barWidth / 2, y - 5);
            
            // 绘制日期
            ctx.fillText(item.day, x + barWidth / 2, height - 10);
        });
    },

    // 继续学习
    continueLearning(courseId) {
        Utils.Notification.show('正在跳转到课程...', 'info');
        // 这里可以添加跳转到具体课程的逻辑
    },
    
    // 查看证书
    viewCertificate() {
        this.showCertificateModal();
    },
    
    // 管理订阅
    manageSubscription(button) {
        if (button.classList.contains('btn-secondary')) {
            Utils.Notification.show('订阅管理功能开发中...', 'info');
        } else if (button.classList.contains('btn-ghost')) {
            if (confirm('确定要取消订阅吗？')) {
                const subscriptionItem = button.closest('.subscription-item');
                subscriptionItem.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    subscriptionItem.remove();
                }, 300);
                Utils.Notification.show('已取消订阅', 'success');
            }
        }
    },

    // 加载用户数据
    loadUserData() {
        // 模拟从服务器加载数据
        setTimeout(() => {
            this.updateLearningStats();
            this.updateRecentActivity();
        }, 500);
    },

    // 更新学习统计
    updateLearningStats() {
        const stats = {
            todayHours: 2.5,
            weekProgress: 75,
            achievements: 12,
            totalCourses: 128,
            studyHours: 45,
            studyDays: 89
        };
        
        // 更新概览卡片
        Utils.DOM.updateText('.overview-card:nth-child(1) .card-number', stats.todayHours + '小时');
        Utils.DOM.updateText('.overview-card:nth-child(2) .card-number', stats.weekProgress + '%');
        Utils.DOM.updateText('.overview-card:nth-child(3) .card-number', stats.achievements);
        
        // 更新用户资料统计
        const profileStats = document.querySelectorAll('.profile-stats .stat-number');
        if (profileStats.length >= 3) {
            profileStats[0].textContent = stats.totalCourses;
            profileStats[1].textContent = stats.studyHours;
            profileStats[2].textContent = stats.studyDays;
        }
    },

    // 更新最近活动
    updateRecentActivity() {
        const activities = [
            {
                title: 'JavaScript高级编程',
                progress: 85,
                time: '2小时前',
                image: 'images/course1.jpg'
            },
            {
                title: 'React实战开发',
                progress: 45,
                time: '1天前',
                image: 'images/course2.jpg'
            }
        ];
        
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = '';
            
            activities.forEach(activity => {
                const activityItem = this.createActivityItem(activity);
                activityList.appendChild(activityItem);
            });
        }
    },

    // 创建活动项目
    createActivityItem(activity) {
        const item = Utils.DOM.createElement('div', 'activity-item');
        
        item.innerHTML = `
            <img src="${activity.image}" alt="课程封面" class="activity-thumb" onerror="this.src='images/default-course.jpg'">
            <div class="activity-info">
                <h4>${Utils.String.escapeHtml(activity.title)}</h4>
                <p>学习进度: ${activity.progress}%</p>
                <span class="activity-time">${Utils.String.escapeHtml(activity.time)}</span>
            </div>
            <button class="btn btn-primary btn-sm">继续学习</button>
        `;
        
        return item;
    },

    // 显示证书模态框
    showCertificateModal() {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>学习证书</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="certificate-preview">
                    <div class="certificate-border">
                        <h2>学习证书</h2>
                        <p>兹证明</p>
                        <h3>用户名</h3>
                        <p>已成功完成</p>
                        <h4>JavaScript高级开发认证</h4>
                        <p>课程学习，特发此证</p>
                        <div class="certificate-date">2024年1月20日</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary">下载证书</button>
                <button class="btn btn-secondary modal-close">关闭</button>
            </div>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
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
        .certificate-preview {
            text-align: center;
            padding: var(--spacing-xl);
        }
        .certificate-border {
            border: 3px solid var(--primary-color);
            padding: var(--spacing-xl);
            border-radius: var(--radius-medium);
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            color: var(--text-dark);
        }
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: var(--spacing-sm);
            padding: var(--spacing-lg);
            border-top: 1px solid var(--border-light);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 关闭模态框
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
            style.remove();
        });
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
},

    // 保存用户设置
    saveSettings() {
        const formData = new FormData();
        const inputs = document.querySelectorAll('.settings-form input, .settings-form select');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData.append(input.name || 'setting', input.checked);
            } else {
                formData.append(input.name || 'setting', input.value);
            }
        });
        
        // 模拟保存
        Utils.Notification.show('正在保存设置...', 'info');
        
        setTimeout(() => {
            Utils.Notification.show('设置保存成功！', 'success');
        }, 1000);
    }
};

// 初始化用户中心
document.addEventListener('DOMContentLoaded', function() {
    UserCenterManager.init();
});

// 添加动画样式
const animationStyle = document.createElement('style');
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
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;

document.head.appendChild(animationStyle);