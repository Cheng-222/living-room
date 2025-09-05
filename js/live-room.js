/**
 * 工具函数库
 */
const Utils = {
    // DOM操作工具
    DOM: {
        $(selector, parent = document) {
            return parent.querySelector(selector);
        },
        $$(selector, parent = document) {
            return Array.from(parent.querySelectorAll(selector));
        },
        addClass(element, className) {
            if (element) element.classList.add(className);
        },
        removeClass(element, className) {
            if (element) element.classList.remove(className);
        },
        toggleClass(element, className, force) {
            if (element) element.classList.toggle(className, force);
        },
        hasClass(element, className) {
            return element ? element.classList.contains(className) : false;
        }
    },
    
    // 事件处理工具
    Event: {
        on(element, event, handler, options = {}) {
            if (element) {
                element.addEventListener(event, handler, options);
            }
        },
        off(element, event, handler) {
            if (element) {
                element.removeEventListener(event, handler);
            }
        },
        stopPropagation(event) {
            if (event) event.stopPropagation();
        },
        preventDefault(event) {
            if (event) event.preventDefault();
        }
    },
    
    // 数据处理工具
    Data: {
        getRandomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        },
        getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
    },
    
    // 动画工具
    Animation: {
        fadeIn(element, duration = 300, callback) {
            if (!element) return;
            element.style.opacity = '0';
            element.style.display = 'block';
            
            const start = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else if (callback) {
                    callback();
                }
            };
            requestAnimationFrame(animate);
        },
        
        fadeOut(element, duration = 300, callback) {
            if (!element) return;
            
            const start = performance.now();
            const startOpacity = parseFloat(getComputedStyle(element).opacity);
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = startOpacity * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    if (callback) callback();
                }
            };
            requestAnimationFrame(animate);
        }
    },
    
    // 存储工具
    Storage: {
        setLocal(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('localStorage not available:', e);
            }
        },
        getLocal(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('localStorage not available:', e);
                return null;
            }
        },
        removeLocal(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('localStorage not available:', e);
            }
        }
    },
    
    // 通知工具
    Notification: {
        show(message, type = 'info', duration = 3000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                color: white;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const colors = {
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FF9800',
                error: '#F44336'
            };
            
            notification.style.backgroundColor = colors[type] || colors.info;
            
            document.body.appendChild(notification);
            
            // 显示动画
            requestAnimationFrame(() => {
                notification.style.opacity = '1';
            });
            
            // 自动移除
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
        },
        
        info(message, duration) {
            this.show(message, 'info', duration);
        },
        
        success(message, duration) {
            this.show(message, 'success', duration);
        },
        
        warning(message, duration) {
            this.show(message, 'warning', duration);
        },
        
        error(message, duration) {
            this.show(message, 'error', duration);
        }
    }
};

// 简化选择器
const $ = Utils.DOM.$;
const $$ = Utils.DOM.$$;

document.addEventListener('DOMContentLoaded', function () {
    // 弹幕模式相关变量
    let danmakuMode = 'full';
    const danmakuContainer = $('.danmaku-container');
    const danmakuToggle = $('.danmaku-toggle');
    const danmakuControls = $('.danmaku-controls');
    const fullScreenBtn = $('[data-mode="full"]');
    const halfScreenBtn = $('[data-mode="half"]');
    const closeBtn = $('[data-mode="none"]');

    // 点击弹幕管理按钮显示/隐藏控制面板
    Utils.Event.on(danmakuToggle, 'click', function (event) {
        Utils.Event.stopPropagation(event);
        Utils.DOM.toggleClass(danmakuControls, 'show');
    });

    // 点击控制面板内部不关闭面板
    Utils.Event.on(danmakuControls, 'click', function (event) {
        Utils.Event.stopPropagation(event);
    });

    // 点击页面其他区域关闭控制面板
    Utils.Event.on(document, 'click', function () {
        Utils.DOM.removeClass(danmakuControls, 'show');
    });

    // 弹幕颜色数组
    function getRandomColor() {
        const r = Utils.Data.getRandomNumber(0, 255);
        const g = Utils.Data.getRandomNumber(0, 255);
        const b = Utils.Data.getRandomNumber(0, 255);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // 弹幕发送冷却时间（毫秒）
    const danmakuCooldown = 100;
    let lastDanmakuTime = 0;

    // 更新弹幕模式和按钮状态
    function updateDanmakuMode() {
        danmakuContainer.className = 'danmaku-container ' + danmakuMode;
        // 更新按钮状态
        [fullScreenBtn, halfScreenBtn, closeBtn].forEach(btn => {
            Utils.DOM.removeClass(btn, 'active');
        });
        switch (danmakuMode) {
            case 'full':
                Utils.DOM.addClass(fullScreenBtn, 'active');
                break;
            case 'half':
                Utils.DOM.addClass(halfScreenBtn, 'active');
                break;
            case 'none':
                Utils.DOM.addClass(closeBtn, 'active');
                break;
        }
    }

    // 初始化弹幕控制按钮事件监听
    function initDanmakuControls() {
        const buttons = $$('.danmaku-button');
        buttons.forEach(button => {
            Utils.Event.on(button, 'click', () => {
                danmakuMode = button.dataset.mode;
                updateDanmakuMode();
                Utils.Notification.info(`切换到${danmakuMode}模式`);
            });
        });
    }

    initDanmakuControls();
    updateDanmakuMode();

    // 创建弹幕
    function createDanmaku(text) {
        if (danmakuMode === 'none') return; // 如果弹幕关闭，不创建弹幕

        const danmaku = document.createElement('div');
        danmaku.className = 'danmaku';
        danmaku.textContent = text;

        // 根据弹幕模式调整垂直位置范围
        const maxTop = danmakuMode === 'half' ? 40 : 80;
        const minTop = danmakuMode === 'half' ? 0 : 20;
        danmaku.style.top = (minTop + Math.random() * (maxTop - minTop)) + '%';

        // 随机选择弹幕颜色
        danmaku.style.color = getRandomColor();

        danmakuContainer.appendChild(danmaku);

        // 添加淡入动画
        Utils.Animation.fadeIn(danmaku, 200);

        // 动画结束后移除弹幕
        Utils.Event.on(danmaku, 'animationend', () => {
            Utils.Animation.fadeOut(danmaku, 200, () => {
                danmaku.remove();
            });
        });
    }

    // 发送弹幕（添加节流控制）
    const sendDanmaku = Utils.Data.throttle(function(text) {
        const now = Date.now();
        if (now - lastDanmakuTime >= danmakuCooldown) {
            createDanmaku(text);
            lastDanmakuTime = now;
        }
    }, danmakuCooldown);

    // 测试弹幕
    sendDanmaku(' 这是弹幕功能 这是弹幕功能 这是弹幕功能 这是弹幕功能 这是弹幕功能 这是弹幕功能 这是弹幕功能 ');

    // 标签切换功能
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.panel');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // 移除所有标签和面板的active类
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // 为当前标签和对应面板添加active类
            tab.classList.add('active');
            panels[index].classList.add('active');
        });
    });

    // 关注按钮功能
    const followBtn = document.querySelector('.follow-btn');
    if (followBtn) {
        followBtn.addEventListener('click', function () {
            this.textContent = this.textContent === '关注' ? '已关注' : '关注';
            this.style.background = this.textContent === '已关注' ? '#999' : '#2b85e4';
        });
    }

    // 聊天功能
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    if (chatButton && chatInput && chatMessages) {
        chatButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = `
                <div class="message-content">
                    <span class="user-name">我：</span>
                    <span class="user-messages">
                    ${message}
                    </span>
                </div>
            `;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            chatInput.value = '';

            // 同步发送弹幕
            sendDanmaku(message);
        }
    }

    // 问答功能
    const qaInput = document.querySelector('.qa-input input');
    const qaButton = document.querySelector('.qa-input button');
    const qaList = document.querySelector('.qa-list');

    if (qaButton && qaInput && qaList) {
        qaButton.addEventListener('click', sendQuestion);
        qaInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendQuestion();
            }
        });
    }

    function sendQuestion() {
        const question = qaInput.value.trim();
        if (question) {
            const qaElement = document.createElement('div');
            qaElement.className = 'qa-item';
            qaElement.innerHTML = `
                <div class="question">
                    <span class="user-name">我：</span>
                    <span class="user-question">
                    ${question}
                    </span>
                </div>
            `;
            qaList.appendChild(qaElement);
            qaList.scrollTop = qaList.scrollHeight;
            qaInput.value = '';
        }
    }

    // Language selection dropdown functionality
    const languageSelect = document.querySelector('.language-select');
    const selectedLanguage = document.querySelector('.selected-language');
    const languageDropdownItems = document.querySelectorAll('.language-dropdown li');
    const currentLanguageSpan = document.getElementById('currentLanguage');

    // Define translations
    const translations = {
        'zh-CN': {
            'liveTitle': '录播演示',
            'liveStatus': '·直播已结束',
            'viewerCount': '11111', // Will append count later
            'likeCount': '22222', // Will append count later
            'mobileView': '手机观看',
            'videoTitle': '录播演示',
            'videoViewerCount': '观看人数：',
            'videoLikeCount': '点赞数：',
            'chatTab': '聊天',
            'filesTab': '课件',
            'qaTab': '问答',
            'chatInputPlaceholder': '发送消息...', // Placeholder
            'sendMessageButton': '发送',
            'fileDownloadButton': '下载',
            'qaInputPlaceholder': '输入你的问题...', // Placeholder
            'askQuestionButton': '提问',
            'userName': '我：',
            'questionPrefix': '用户',
            'answerPrefix': '讲师',
            'systemNotice': '系统提醒：直播内容和互动评论严禁传播违法或不良信息，如存在违规行为，小鹅通将采取封禁措施。严禁未成年人直播或提问。请谨慎行事，注意财产安全，防止个人或财产损失。'
        },
        'en': {
            'liveTitle': 'Recorded Demo',
            'liveStatus': '·Live Ended',
            'viewerCount': '11111',
            'likeCount': '22222',
            'mobileView': 'Mobile View',
            'videoTitle': 'Recorded Demo',
            'videoViewerCount': 'Viewers: ',
            'videoLikeCount': 'Likes: ',
            'chatTab': 'Chat',
            'filesTab': 'Files',
            'qaTab': 'Q&A',
            'chatInputPlaceholder': 'Send message...', // Placeholder
            'sendMessageButton': 'Send',
            'fileDownloadButton': 'Download',
            'qaInputPlaceholder': 'Enter your question...', // Placeholder
            'askQuestionButton': 'Ask',
            'userName': 'Me:',
            'questionPrefix': 'User',
            'answerPrefix': 'Teacher',
            'systemNotice': 'System Reminder: Live content and interactive comments are strictly prohibited from disseminating illegal or bad information, and if there is a violation, Little Goose Pass will take banning measures. It is strictly forbidden for minors to live stream or tip. Please exercise caution and pay attention to property safety to prevent personal or property damage.'
        }
    };

    // Function to update text content based on language
    function updateTextContent(lang) {
        const elementsToTranslate = document.querySelectorAll('[data-translate-key]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate-key');
            if (translations[lang] && translations[lang][key]) {
                // Handle special cases like viewer/like counts where text is combined
                if (key === 'viewerCount' || key === 'likeCount') {
                    // 直接使用translations中定义的值，不需要拼接原有数字
                    element.textContent = translations[lang][key];
                } else if (key === 'videoViewerCount' || key === 'videoLikeCount') {
                    // 直接使用translations中定义的值，不需要拼接原有数字
                    element.textContent = translations[lang][key];
                } else if (key === 'userName') {
                    // User name is dynamic, only translate the prefix
                    const currentText = element.textContent;
                    const name = currentText.substring(0, currentText.indexOf('：') + 1);
                    element.textContent = translations[lang][key] + name.substring(name.indexOf('：') + 1);
                } else if (key === 'questionPrefix' || key === 'answerPrefix') {
                    // These are prefixes, need to find the span and update
                    const spanElement = element.querySelector('span');
                    if (spanElement) {
                        const currentText = spanElement.textContent;
                        const name = currentText.substring(0, currentText.indexOf('：') + 1);
                        spanElement.textContent = translations[lang][key] + name.substring(name.indexOf('：') + 1);
                    }
                } else if (key === 'chatInputPlaceholder' || key === 'qaInputPlaceholder') {
                    // Update placeholder text for inputs
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
    }

    if (languageSelect && selectedLanguage && languageDropdownItems.length > 0 && currentLanguageSpan) {
        // Toggle dropdown visibility
        selectedLanguage.addEventListener('click', () => {
            languageSelect.classList.toggle('open');
        });

        // Handle language selection
        languageDropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                const selectedLang = item.getAttribute('data-lang');
                const selectedText = item.textContent;

                // Update displayed language
                currentLanguageSpan.textContent = selectedText;

                // Update all text content on the page
                updateTextContent(selectedLang);

                // Close dropdown
                languageSelect.classList.remove('open');

                console.log(`Language selected: ${selectedLang}`);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!languageSelect.contains(event.target)) {
                languageSelect.classList.remove('open');
            }
        });

        // Set initial language on page load
        const initialLang = document.documentElement.lang || 'zh-CN'; // Get lang from html tag or default
        updateTextContent(initialLang);
    }
});