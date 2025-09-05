# 在线教育录播平台

一个现代化的在线教育录播平台，提供课程学习、直播互动、用户管理等功能。

## 🚀 项目特色

- **响应式设计** - 完美适配桌面端、平板和移动设备
- **现代化UI** - 采用统一的设计系统，界面美观易用
- **模块化架构** - JavaScript代码采用模块化设计，易于维护和扩展
- **丰富功能** - 包含课程学习、直播互动、用户中心等完整功能
- **性能优化** - 代码经过优化，加载速度快，用户体验佳

## 📋 功能模块

### 🏠 首页
- 课程推荐展示
- 分类筛选
- 搜索功能
- 热门课程轮播

### 📺 直播间
- 实时视频播放
- 弹幕互动系统
- 弹幕设置和控制
- 互动功能面板

### 👤 用户中心
- 学习进度跟踪
- 课程管理
- 订阅管理
- 证书查看
- 个人设置
- 学习统计图表

### 📚 课程详情
- 课程信息展示
- 视频预览
- 章节目录
- 评价系统
- 购买和试学
- 社交分享

## 🛠️ 技术栈

- **前端框架**: 原生 HTML5 + CSS3 + JavaScript ES6+
- **样式预处理**: CSS Variables (自定义属性)
- **图标字体**: 自定义 iconfont
- **响应式**: CSS Media Queries
- **模块化**: ES6 模块化设计
- **工具函数**: 自研 Utils 工具库

## 📁 项目结构

```
录播间搭建/
├── index.html              # 首页
├── live-room.html          # 直播间页面
├── user-center.html        # 用户中心页面
├── course-detail.html      # 课程详情页面
├── css/
│   ├── design-system.css   # 设计系统变量
│   ├── common.css          # 通用样式
│   ├── index.css           # 首页样式
│   ├── live-room.css       # 直播间样式
│   ├── user-center.css     # 用户中心样式
│   ├── course-detail.css   # 课程详情样式
│   └── responsive.css      # 响应式样式
├── js/
│   ├── utils.js            # 工具函数库
│   ├── index.js            # 首页逻辑
│   ├── live-room.js        # 直播间逻辑
│   ├── user-center.js      # 用户中心逻辑
│   ├── course-detail.js    # 课程详情逻辑
│   ├── recommendations.js  # 推荐系统
│   └── search.js           # 搜索功能
├── images/                 # 图片资源
├── iconfont/              # 图标字体
└── README.md              # 项目说明
```

## 🎨 设计系统

项目采用统一的设计系统，包含：

### 颜色规范
- **主色调**: #1890ff (蓝色)
- **成功色**: #52c41a (绿色)
- **警告色**: #faad14 (橙色)
- **错误色**: #ff4d4f (红色)
- **文字色**: #262626, #595959, #8c8c8c
- **背景色**: #ffffff, #fafafa, #f5f5f5

### 字体规范
- **主字体**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **字号**: 12px, 14px, 16px, 18px, 20px, 24px, 32px
- **行高**: 1.5 (标准), 1.2 (标题)

### 间距规范
- **基础间距**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px
- **组件间距**: 16px (小), 24px (中), 32px (大)

## 🚀 快速开始

### 环境要求
- 现代浏览器 (Chrome 60+, Firefox 60+, Safari 12+, Edge 79+)
- 本地服务器 (推荐使用 Live Server 或类似工具)

### 安装运行

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd 录播间搭建
   ```

2. **启动本地服务器**
   
   使用 VS Code Live Server:
   - 安装 Live Server 扩展
   - 右键 `index.html` 选择 "Open with Live Server"
   
   或使用 Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   或使用 Node.js:
   ```bash
   npx http-server
   ```

3. **访问应用**
   
   打开浏览器访问 `http://localhost:8000`

## 📱 响应式支持

项目完全支持响应式设计，适配以下设备：

- **桌面端**: 1200px+
- **平板端**: 768px - 1199px
- **手机端**: 320px - 767px

### 断点设置
```css
/* 手机端 */
@media (max-width: 767px) { ... }

/* 平板端 */
@media (min-width: 768px) and (max-width: 1199px) { ... }

/* 桌面端 */
@media (min-width: 1200px) { ... }
```

## 🔧 核心功能说明

### 工具函数库 (utils.js)
提供以下模块：
- **DOM操作**: 元素选择、创建、样式操作
- **事件处理**: 事件绑定、委托、节流防抖
- **数据处理**: 格式化、验证、转换
- **动画效果**: 淡入淡出、滑动效果
- **存储管理**: localStorage、sessionStorage 封装
- **UI组件**: 通知、模态框等

### 模块化设计
每个页面的 JavaScript 都采用模块化设计：
- **命名空间**: 避免全局变量污染
- **事件委托**: 提高性能，支持动态元素
- **配置分离**: 数据与逻辑分离
- **错误处理**: 完善的错误处理机制

## 🎯 浏览器兼容性

| 浏览器 | 版本要求 |
|--------|----------|
| Chrome | 60+ |
| Firefox | 60+ |
| Safari | 12+ |
| Edge | 79+ |
| IE | 不支持 |

## 📈 性能优化

- **图片懒加载**: 提升页面加载速度
- **事件委托**: 减少事件监听器数量
- **CSS优化**: 使用 CSS Variables，减少重复代码
- **JavaScript优化**: 模块化设计，按需加载
- **缓存策略**: 合理使用浏览器缓存

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱: [your-email@example.com]
- 项目地址: [GitHub 仓库地址]

---

**感谢使用本项目！** 🎉