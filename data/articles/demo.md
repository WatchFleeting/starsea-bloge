---
id: "article-demo-01"
title: "如何搭建 Markdown 驱动的个人站点"
author: "鸿渚"
date: "2025-06-15"
readTime: "8分钟阅读"
tags: ["教程", "Markdown", "GitHub Pages"]
summary: "从零开始，用 Markdown 和 GitHub Pages 构建一个纯静态、易维护的个人资源分享站。"
---
## 为什么要用 Markdown 驱动？

Markdown 语法简单，容易上手；配合 Front Matter 可以灵活存储元数据。

### 优点
- **纯静态**，无需后端服务器
- **版本控制**，所有内容可追溯
- **快速渲染**，直接输出 HTML

## 准备工作

1. 安装一个 Markdown 编辑器（如 Typora 或 VS Code）
2. 创建 `data/articles/` 目录
3. 编写 `.md` 文件，并在 `data-index.json` 中注册

## 发布与维护

每次新增文章只需添加一个 `.md` 文件，并更新索引即可。

> 💡 小提示：记得在 Front Matter 中设置 `summary` 字段，这样首页卡片会显示摘要。

## 一张截图

![示例图片](https://via.placeholder.com/600x300/06b6d4/ffffff?text=Markdown+Blog)