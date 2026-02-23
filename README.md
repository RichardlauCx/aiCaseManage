# aiCaseManage
A zero-dependency, frontend-only case management system that authenticates medical practices via location, role, and visit code verification, with AI-assisted development.

# aiCaseManage - AI 辅助病例管理系统 🩺

> 基于纯前端技术栈构建的零依赖病例管理系统，通过 LocalStorage 实现数据持久化，解决无后端环境下的诊疗行为真实性核验问题。

## 🌟 项目简介
aiCaseManage 是一个面向基层医疗场景的轻量级病例管理系统，无需后端服务即可独立运行。系统通过「地点+角色+就诊码」的三重校验机制，确保诊疗行为的真实性与可追溯性，同时提供全流程可视化的病历时间轴和仪表盘视图

aiCaseManage/
├── index.html          # 系统入口文件
├── css/
│   └── style.css       # 全局样式文件
├── js/
│   ├── app.js          # 核心业务逻辑
│   ├── storage.js      # LocalStorage 数据管理
│   └── ui.js           # UI 交互与渲染
├── data/
│   └── demo.json       # 演示数据初始化文件
└── README.md           # 项目说明文档

**核心价值：**
- 🏥 适配无网络/弱网络环境下的基层诊疗场景
- 🔒 构建不可篡改的诊疗行为证据链
- 📱 纯浏览器运行，降低部署与维护成本
- 🤖 AI 辅助开发，提升项目迭代效率

## ✨ 核心特性
- 🛠 **零依赖部署**：无需 Node.js、数据库或后端服务，浏览器双击 `index.html` 即可运行
- 🔐 **真实性核验**：基于地点、操作员角色、就诊码的三重校验，拦截不合规诊疗操作
- 📊 **全流程可视化**：时间轴病历展示诊疗全链路，仪表盘统计关键业务指标
- 📝 **闭环管理**：覆盖患者登记 → 处方开具 → 医技执行 → 病历归档的完整诊疗流程
- 🎨 响应式设计：适配桌面端与平板设备，支持多场景操作

## 🚀 快速开始
### 环境要求
- 现代浏览器（推荐 Chrome ≥ 80 或 Edge ≥ 80）
- 无网络环境也可离线运行

### 运行步骤
1. 下载或克隆本项目到本地
   ```bash
   git clone https://github.com/RichardlauCx/aiCaseManage.git
