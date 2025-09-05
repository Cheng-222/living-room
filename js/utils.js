/**
 * 通用工具函数库
 * 提供常用的DOM操作、事件处理、数据处理等功能
 */

// DOM 操作工具
const DOMUtils = {
    /**
     * 安全的元素选择器
     * @param {string} selector - CSS选择器
     * @param {Element} context - 查找上下文，默认为document
     * @returns {Element|null}
     */
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    /**
     * 选择多个元素
     * @param {string} selector - CSS选择器
     * @param {Element} context - 查找上下文，默认为document
     * @returns {NodeList}
     */
    $$(selector, context = document) {
        return context.querySelectorAll(selector);
    },

    /**
     * 根据ID获取元素
     * @param {string} id - 元素ID
     * @returns {Element|null}
     */
    getElementById(id) {
        return document.getElementById(id);
    },

    /**
     * 创建元素
     * @param {string} tag - 标签名
     * @param {Object} attributes - 属性对象
     * @param {string} content - 内容
     * @returns {Element}
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },

    /**
     * 添加类名
     * @param {Element} element - 目标元素
     * @param {string|Array} classes - 类名
     */
    addClass(element, classes) {
        if (!element) return;
        const classList = Array.isArray(classes) ? classes : [classes];
        element.classList.add(...classList);
    },

    /**
     * 移除类名
     * @param {Element} element - 目标元素
     * @param {string|Array} classes - 类名
     */
    removeClass(element, classes) {
        if (!element) return;
        const classList = Array.isArray(classes) ? classes : [classes];
        element.classList.remove(...classList);
    },

    /**
     * 切换类名
     * @param {Element} element - 目标元素
     * @param {string} className - 类名
     */
    toggleClass(element, className) {
        if (!element) return;
        element.classList.toggle(className);
    },

    /**
     * 检查是否包含类名
     * @param {Element} element - 目标元素
     * @param {string} className - 类名
     * @returns {boolean}
     */
    hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    }
};

// 事件处理工具
const EventUtils = {
    /**
     * 添加事件监听器
     * @param {Element} element - 目标元素
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 选项
     */
    on(element, event, handler, options = {}) {
        if (!element || !event || !handler) return;
        element.addEventListener(event, handler, options);
    },

    /**
     * 移除事件监听器
     * @param {Element} element - 目标元素
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    off(element, event, handler) {
        if (!element || !event || !handler) return;
        element.removeEventListener(event, handler);
    },

    /**
     * 事件委托
     * @param {Element} parent - 父元素
     * @param {string} selector - 子元素选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    delegate(parent, selector, event, handler) {
        if (!parent || !selector || !event || !handler) return;
        
        parent.addEventListener(event, function(e) {
            const target = e.target.closest(selector);
            if (target && parent.contains(target)) {
                handler.call(target, e);
            }
        });
    },

    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} delay - 延迟时间
     * @returns {Function}
     */
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} delay - 延迟时间
     * @returns {Function}
     */
    throttle(func, delay) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                func.apply(this, args);
            }
        };
    },

    /**
     * 阻止事件冒泡
     * @param {Event} event - 事件对象
     */
    stopPropagation(event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
    },

    /**
     * 阻止默认行为
     * @param {Event} event - 事件对象
     */
    preventDefault(event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }
};

// 数据处理工具
const DataUtils = {
    /**
     * 格式化价格
     * @param {number} price - 价格
     * @param {string} currency - 货币符号
     * @returns {string}
     */
    formatPrice(price, currency = '¥') {
        return `${currency}${price.toFixed(2)}`;
    },

    /**
     * 格式化数字
     * @param {number} num - 数字
     * @returns {string}
     */
    formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num.toLocaleString();
    },

    /**
     * 格式化时间
     * @param {Date|string|number} date - 日期
     * @param {string} format - 格式
     * @returns {string}
     */
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second);
    },

    /**
     * 深拷贝对象
     * @param {any} obj - 要拷贝的对象
     * @returns {any}
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    /**
     * 生成随机ID
     * @param {number} length - 长度
     * @returns {string}
     */
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// 动画工具
const AnimationUtils = {
    /**
     * 平滑滚动到指定位置
     * @param {number} targetY - 目标Y坐标
     * @param {number} duration - 持续时间
     */
    smoothScrollTo(targetY, duration = 500) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();
        
        function animation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = progress * (2 - progress); // easeOutQuad
            
            window.scrollTo(0, startY + distance * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    },

    /**
     * 淡入动画
     * @param {Element} element - 目标元素
     * @param {number} duration - 持续时间
     */
    fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },

    /**
     * 淡出动画
     * @param {Element} element - 目标元素
     * @param {number} duration - 持续时间
     */
    fadeOut(element, duration = 300) {
        if (!element) return;
        
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
};

// 存储工具
const StorageUtils = {
    /**
     * 设置localStorage
     * @param {string} key - 键
     * @param {any} value - 值
     */
    setLocal(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage设置失败:', e);
        }
    },

    /**
     * 获取localStorage
     * @param {string} key - 键
     * @param {any} defaultValue - 默认值
     * @returns {any}
     */
    getLocal(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.warn('localStorage获取失败:', e);
            return defaultValue;
        }
    },

    /**
     * 删除localStorage
     * @param {string} key - 键
     */
    removeLocal(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('localStorage删除失败:', e);
        }
    },

    /**
     * 设置sessionStorage
     * @param {string} key - 键
     * @param {any} value - 值
     */
    setSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('sessionStorage设置失败:', e);
        }
    },

    /**
     * 获取sessionStorage
     * @param {string} key - 键
     * @param {any} defaultValue - 默认值
     * @returns {any}
     */
    getSession(key, defaultValue = null) {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.warn('sessionStorage获取失败:', e);
            return defaultValue;
        }
    },

    /**
     * 删除sessionStorage
     * @param {string} key - 键
     */
    removeSession(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (e) {
            console.warn('sessionStorage删除失败:', e);
        }
    }
};

// 通知工具
const NotificationUtils = {
    /**
     * 显示通知
     * @param {string} message - 消息内容
     * @param {string} type - 类型 (success, error, warning, info)
     * @param {number} duration - 持续时间
     */
    show(message, type = 'info', duration = 3000) {
        const notification = DOMUtils.createElement('div', {
            className: `notification notification-${type}`,
            style: `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                background: var(--color-${type === 'error' ? 'danger' : type});
                color: white;
                border-radius: var(--border-radius-md);
                box-shadow: var(--shadow-medium);
                z-index: var(--z-notification);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `
        }, message);
        
        document.body.appendChild(notification);
        
        // 触发动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        return notification;
    },

    success(message, duration) {
        return this.show(message, 'success', duration);
    },

    error(message, duration) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// 模态框工具
const ModalUtils = {
    /**
     * 创建模态框
     * @param {Object} options - 配置选项
     * @returns {Object} 模态框实例
     */
    create(options = {}) {
        const {
            title = '提示',
            content = '',
            showClose = true,
            showCancel = true,
            showConfirm = true,
            cancelText = '取消',
            confirmText = '确定',
            onCancel = () => {},
            onConfirm = () => {},
            onClose = () => {}
        } = options;
        
        const overlay = DOMUtils.createElement('div', {
            className: 'modal-overlay',
            style: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: var(--z-modal);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            `
        });
        
        const modal = DOMUtils.createElement('div', {
            className: 'modal',
            style: `
                background: white;
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-heavy);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            `
        });
        
        const header = DOMUtils.createElement('div', {
            className: 'modal-header',
            style: `
                padding: var(--spacing-lg);
                border-bottom: 1px solid var(--color-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            `
        }, `
            <h3 style="margin: 0; font-size: var(--font-size-lg);">${title}</h3>
            ${showClose ? '<button class="modal-close" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>' : ''}
        `);
        
        const body = DOMUtils.createElement('div', {
            className: 'modal-body',
            style: `
                padding: var(--spacing-lg);
                max-height: 60vh;
                overflow-y: auto;
            `
        }, content);
        
        const footer = DOMUtils.createElement('div', {
            className: 'modal-footer',
            style: `
                padding: var(--spacing-lg);
                border-top: 1px solid var(--color-border);
                display: flex;
                justify-content: flex-end;
                gap: var(--spacing-sm);
            `
        }, `
            ${showCancel ? `<button class="btn btn-secondary modal-cancel">${cancelText}</button>` : ''}
            ${showConfirm ? `<button class="btn btn-primary modal-confirm">${confirmText}</button>` : ''}
        `);
        
        modal.appendChild(header);
        modal.appendChild(body);
        if (showCancel || showConfirm) {
            modal.appendChild(footer);
        }
        overlay.appendChild(modal);
        
        // 事件处理
        const closeModal = () => {
            overlay.style.opacity = '0';
            modal.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
            onClose();
        };
        
        if (showClose) {
            EventUtils.on(DOMUtils.$('.modal-close', modal), 'click', closeModal);
        }
        
        if (showCancel) {
            EventUtils.on(DOMUtils.$('.modal-cancel', modal), 'click', () => {
                onCancel();
                closeModal();
            });
        }
        
        if (showConfirm) {
            EventUtils.on(DOMUtils.$('.modal-confirm', modal), 'click', () => {
                onConfirm();
                closeModal();
            });
        }
        
        EventUtils.on(overlay, 'click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
        
        // 显示模态框
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
        
        return {
            element: overlay,
            close: closeModal,
            updateContent: (newContent) => {
                body.innerHTML = newContent;
            }
        };
    },

    /**
     * 确认对话框
     * @param {string} message - 消息
     * @param {Function} onConfirm - 确认回调
     * @param {Function} onCancel - 取消回调
     */
    confirm(message, onConfirm = () => {}, onCancel = () => {}) {
        return this.create({
            title: '确认',
            content: message,
            onConfirm,
            onCancel
        });
    },

    /**
     * 警告对话框
     * @param {string} message - 消息
     * @param {Function} onClose - 关闭回调
     */
    alert(message, onClose = () => {}) {
        return this.create({
            title: '提示',
            content: message,
            showCancel: false,
            onConfirm: onClose
        });
    }
};

// 导出所有工具
window.Utils = {
    DOM: DOMUtils,
    Event: EventUtils,
    Data: DataUtils,
    Animation: AnimationUtils,
    Storage: StorageUtils,
    Notification: NotificationUtils,
    Modal: ModalUtils
};

// 简化访问
window.$ = DOMUtils.$;
window.$$ = DOMUtils.$$;