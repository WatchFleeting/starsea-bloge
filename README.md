# 鸿渚の灵质空间

> 一个基于纯静态文件（HTML/CSS/JS）构建的个人资源分享与技术博客，部署于 GitHub Pages。

## ✨ 主要功能

- **多语言支持**：中文、English、日本語、한국어，界面文字通过 JSON 驱动，一键切换。
- **明暗 / 多色主题**：亮色与暗色模式任意切换，同时提供青蓝、紫罗兰、薄荷绿、落日橙、樱花粉五种配色。
- **浮动播放器**：拖拽式悬浮窗口，播放本地或 WebOS 直链歌曲，支持封面旋转、背景可视化、搜索、倍速与下载。
- **图片库**：按系列自动分组，支持单图、动态视频、图集（左右翻页），图片下载源可切换 WebOS 直链或本地方案。
- **表情包**：按分类展示，每个分类可独立下载全部，单张支持直链下载，分类标题自动美化（如“鸿渚の表情包第01弹”）。
- **通知与项目链接**：侧边栏“小纸条”和“小巢分站”卡片，数据由独立 JSON 维护。
- **实用工具**：番茄钟、喝水提醒、便签板、骰子等，均以浮动窗口形式打开。
- **文章 / 卡片 / 文件系统**：通过 Markdown 文件管理内容，首页分区域展示，点击弹窗阅读全文。
- **B站 个人信息**：通过 B站 开放 API 展示粉丝数、关注、获赞及最新视频。
- **代理监控**：内置 CORS 代理状态检测页，可测试多个公共代理的可用性。

## 🚀 快速开始

1. **Fork 本仓库** 或直接下载源码。
2. 将项目文件推送至 GitHub 仓库的 `main`（或 `gh-pages`）分支。
3. 在仓库 `Settings → Pages` 中启用 GitHub Pages，选择对应分支并保存。
4. 访问 `https://你的用户名.github.io/仓库名/` 即可看到网站。

## 📁 项目结构

```text
├── index.html               # 首页（个人信息、文章、通知卡片、浮动窗口容器）
├── background.html          # 图片库
├── emoji.html               # 表情包
├── FriendURL.html           # 友情链接
├── tags.html                # 标签浏览
├── log.html                 # 文章日志
├── proxy-status.html        # CORS 代理监控
├── Vocaloidplayer.html      # 术术播放器（内嵌）
├── pomodoro.html            # 番茄钟
├── drink.html               # 喝水提醒
├── notes.html               # 便签板
├── dice.html                # 骰子
├── common.css               # 全局样式（变量、主题、响应式）
├── common.js                # 核心脚本（导航、多语言、播放器、API 等）
├── header.html              # 公共头部
├── footer.html              # 公共底部
├── player.html              # 播放器外壳容器
├── data/                    # 数据文件
│   ├── index.json           # 文章/卡片/文件索引
│   ├── wallpapers.json      # 图片库条目
│   ├── emojis.json          # 表情包条目
│   ├── friends.json         # 友链数据
│   ├── notifications.json   # 通知数据
│   ├── projects.json        # 项目链接数据
│   └── webos-config.json    # WebOS 直链配置
├── lang/                    # 多语言文件
│   ├── zh.json / en.json / ja.json / ko.json
├── img/                     # 图片资源（头像、图标、光标、降级图等）
├── background/              # 壁纸文件（本地降级用）
├── emoji/                   # 表情包图片及压缩包
├── Vocaloid/                # 歌曲文件及封面（本地降级用）
└── README.md                # 本文件
```

🎨 自定义

· 更换头像与个人信息：编辑 index.html 中的 Bilibili UID 或直接修改静态文字。

· 修改颜色主题：在 common.css 的 :root 与 [data-color-theme] 规则中调整色值。

· 添加 / 修改文章：在 data/ 目录中放置 .md 文件，并在 data-index.json 中注册。

· 切换数据源为 WebOS：编辑 data/webos-config.json，填入你的直链基础地址和分享标识即可。

· 添加新语言：在 lang/ 中新增 JSON，并在 common.js 的 SUPPORTED_LANGS 数组中注册。

💻 技术栈

· 纯静态前端：HTML5 + CSS3 + JavaScript (ES2020+)

· UI 框架：无第三方框架，全部手写

· 图标库：Font Awesome 6 (CDN)

· 字体：Inter (Google Fonts)

· 部署：GitHub Pages / Cloudflare Pages / 任何静态托管

📄 许可

本项目采用 MIT License 开源，你可以自由使用和修改代码，但请保留作者信息。歌曲、图片等资源版权归原作者所有。

💬 联系作者

· B 站：https://space.bilibili.com/3493109964999279

· GitHub：https://github.com/WatchFleeting

· 邮箱：lzc737507@outlook.com