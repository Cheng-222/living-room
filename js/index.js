/**
 * 首页功能模块
 * 包含搜索、导航、标签切换、侧边栏等功能
 */

// 搜索功能模块
const SearchModule = {
    init() {
        this.searchButton = $('.search-button');
        this.searchInputWrapper = $('.search-input-wrapper');
        this.searchCancel = $('.search-cancel');
        this.searchInput = $('.search-input-wrapper input');
        
        if (!this.searchButton || !this.searchInputWrapper) return;
        
        this.bindEvents();
    },
    
    bindEvents() {
        // 搜索按钮点击事件
        Utils.Event.on(this.searchButton, 'click', () => this.showSearch());
        
        // 取消按钮点击事件
        if (this.searchCancel) {
            Utils.Event.on(this.searchCancel, 'click', () => this.hideSearch());
        }
        
        // 点击外部区域关闭搜索
        Utils.Event.on(document, 'click', (event) => this.handleOutsideClick(event));
        
        // 搜索输入事件
        if (this.searchInput) {
            const debouncedSearch = Utils.Event.debounce((e) => this.handleSearch(e.target.value), 300);
            Utils.Event.on(this.searchInput, 'input', debouncedSearch);
            Utils.Event.on(this.searchInput, 'keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }
    },
    
    showSearch() {
        Utils.DOM.addClass(this.searchInputWrapper, 'active');
        if (this.searchCancel) {
            Utils.DOM.addClass(this.searchCancel, 'active');
        }
        if (this.searchInput) {
            this.searchInput.focus();
        }
        this.searchButton.style.opacity = '0';
    },
    
    hideSearch() {
        Utils.DOM.removeClass(this.searchInputWrapper, 'active');
        if (this.searchCancel) {
            Utils.DOM.removeClass(this.searchCancel, 'active');
        }
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.searchButton.style.opacity = '1';
    },
    
    handleOutsideClick(event) {
        const isClickInside = this.searchButton.contains(event.target) ||
            this.searchInputWrapper.contains(event.target) ||
            (this.searchCancel && this.searchCancel.contains(event.target));
            
        if (!isClickInside && Utils.DOM.hasClass(this.searchInputWrapper, 'active')) {
            this.hideSearch();
        }
    },
    
    handleSearch(query) {
        if (query.length > 2) {
            // 这里可以添加搜索建议功能
            console.log('搜索建议:', query);
        }
    },
    
    performSearch(query) {
        if (query.trim()) {
            Utils.Notification.info(`搜索: ${query}`);
            // 这里可以跳转到搜索结果页面
            console.log('执行搜索:', query);
        }
    }
};

// 导航功能模块
const NavigationModule = {
    init() {
        this.navMenu = $('.nav-menu');
        if (!this.navMenu) return;
        
        this.bindEvents();
    },
    
    bindEvents() {
        Utils.Event.delegate(this.navMenu, 'a', 'click', (event) => {
            const href = event.target.getAttribute('href');
            
            // 如果是外部链接或锚点链接，阻止默认行为
            if (href === '#' || href.startsWith('http')) {
                event.preventDefault();
                this.switchNavItem(event.target);
            } else {
                // 对于内部页面链接，允许正常跳转
                this.switchNavItem(event.target);
            }
        });
    },
    
    switchNavItem(target) {
        const currentActive = $('.active', this.navMenu);
        if (currentActive) {
            Utils.DOM.removeClass(currentActive, 'active');
        }
        Utils.DOM.addClass(target, 'active');
        
        // 保存当前选中的导航项
        Utils.Storage.setSession('activeNav', target.textContent);
    },
    
    restoreActiveNav() {
        const savedNav = Utils.Storage.getSession('activeNav');
        if (savedNav) {
            const navItems = $$('a', this.navMenu);
            navItems.forEach(item => {
                if (item.textContent === savedNav) {
                    Utils.DOM.addClass(item, 'active');
                }
            });
        }
    }
};

// 标签切换模块
const TabModule = {
    init() {
        this.tabContainer = $('.tabs');
        if (!this.tabContainer) return;
        
        this.bindEvents();
        this.restoreActiveTab();
    },
    
    bindEvents() {
        Utils.Event.delegate(this.tabContainer, 'button', 'click', (event) => {
            this.switchTab(event.target);
        });
    },
    
    switchTab(target) {
        const currentActive = $('.active', this.tabContainer);
        if (currentActive) {
            Utils.DOM.removeClass(currentActive, 'active');
        }
        Utils.DOM.addClass(target, 'active');
        
        // 保存当前选中的标签
        Utils.Storage.setSession('activeTab', target.textContent);
        
        // 触发标签切换事件
        this.onTabChange(target.textContent);
    },
    
    onTabChange(tabName) {
        // 这里可以根据标签切换加载不同的内容
        console.log('切换到标签:', tabName);
        Utils.Notification.info(`切换到: ${tabName}`);
    },
    
    restoreActiveTab() {
        const savedTab = Utils.Storage.getSession('activeTab');
        if (savedTab) {
            const tabButtons = $$('button', this.tabContainer);
            tabButtons.forEach(button => {
                if (button.textContent === savedTab) {
                    Utils.DOM.addClass(button, 'active');
                }
            });
        }
    }
};

// 侧边栏模块
const SidebarModule = {
    init() {
        this.sidebar = $('.sidebar ul');
        if (!this.sidebar) return;
        
        this.bindEvents();
    },
    
    bindEvents() {
        const sidebarItems = $$('li', this.sidebar);
        
        sidebarItems.forEach(item => {
            const popover = $('.popover', item);
            if (!popover) return;
            
            // 使用防抖优化鼠标事件
            const showPopover = Utils.Event.debounce(() => {
                Utils.Animation.fadeIn(popover, 200);
            }, 100);
            
            const hidePopover = Utils.Event.debounce(() => {
                Utils.Animation.fadeOut(popover, 200);
            }, 100);
            
            Utils.Event.on(item, 'mouseenter', showPopover);
            Utils.Event.on(item, 'mouseleave', hidePopover);
            
            // 点击侧边栏项目
            Utils.Event.on(item, 'click', () => {
                const itemText = item.textContent.trim();
                Utils.Notification.info(`点击了: ${itemText}`);
            });
        });
    }
};

// 页面加载完成后初始化所有模块
document.addEventListener('DOMContentLoaded', function() {
    try {
        SearchModule.init();
        NavigationModule.init();
        TabModule.init();
        SidebarModule.init();
        
        // 恢复保存的状态
        NavigationModule.restoreActiveNav();
        
        console.log('首页模块初始化完成');
    } catch (error) {
        console.error('首页初始化失败:', error);
        Utils.Notification.error('页面初始化失败，请刷新重试');
    }
});