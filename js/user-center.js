// 个人中心页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有导航链接和标签页面板
    const navLinks = document.querySelectorAll('.nav-link');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标标签页
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            navLinks.forEach(nav => nav.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // 初始化图表（如果需要）
    initCharts();
    
    // 初始化其他功能
    initSubscriptionManagement();
    initProgressTracking();
    initCertificateDisplay();
    initAccountSettings();
});

// 初始化图表
function initCharts() {
    // 学习进度图表
    const progressChart = document.getElementById('progressChart');
    if (progressChart) {
        // 这里可以集成图表库如Chart.js
        console.log('初始化学习进度图表');
    }
}

// 订阅管理功能
function initSubscriptionManagement() {
    const subscriptionCards = document.querySelectorAll('.subscription-card');
    subscriptionCards.forEach(card => {
        const unsubscribeBtn = card.querySelector('.unsubscribe-btn');
        if (unsubscribeBtn) {
            unsubscribeBtn.addEventListener('click', function() {
                if (confirm('确定要取消订阅吗？')) {
                    card.style.opacity = '0.5';
                    this.textContent = '已取消';
                    this.disabled = true;
                }
            });
        }
    });
}

// 学习进度跟踪
function initProgressTracking() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress') || 0;
        const fill = bar.querySelector('.progress-fill');
        if (fill) {
            setTimeout(() => {
                fill.style.width = progress + '%';
            }, 500);
        }
    });
}

// 证书展示
function initCertificateDisplay() {
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach(card => {
        card.addEventListener('click', function() {
            const certificateId = this.getAttribute('data-certificate-id');
            showCertificateModal(certificateId);
        });
    });
}

// 显示证书模态框
function showCertificateModal(certificateId) {
    // 创建模态框显示证书详情
    console.log('显示证书详情:', certificateId);
}

// 账户设置功能
function initAccountSettings() {
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const settings = {};
            for (let [key, value] of formData.entries()) {
                settings[key] = value;
            }
            
            // 保存设置
            saveUserSettings(settings);
        });
    }
    
    // 头像上传
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatar = document.querySelector('.profile-avatar img');
                    if (avatar) {
                        avatar.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// 保存用户设置
function saveUserSettings(settings) {
    // 这里可以发送到服务器
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // 显示保存成功提示
    showNotification('设置保存成功！', 'success');
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 触发显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 3秒后开始隐藏动画
    setTimeout(() => {
        notification.classList.remove('show');
        // 动画结束后移除元素
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 导出功能供其他模块使用
window.UserCenter = {
    showNotification,
    saveUserSettings
};