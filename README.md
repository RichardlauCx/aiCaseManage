# aiCaseManage - AI 辅助病例管理系统 🩺

> 基于纯前端技术栈构建的零依赖病例管理系统，通过 LocalStorage 实现数据持久化，解决无后端环境下的诊疗行为真实性核验问题。
>
> A zero-dependency, frontend-only case management system built with pure HTML/CSS/JS, using LocalStorage for data persistence to solve the problem of verifying the authenticity of medical practices in a backend-free environment.

---

## 🌟 项目简介 | Project Overview

aiCaseManage 是一个面向基层医疗场景的轻量级病例管理系统，无需后端服务即可独立运行。系统通过「地点+角色+就诊码」的三重校验机制，确保诊疗行为的真实性与可追溯性，同时提供全流程可视化的病历时间轴和仪表盘视图。

aiCaseManage is a lightweight case management system designed for primary healthcare scenarios, which can run independently without backend services. The system ensures the authenticity and traceability of medical practices through a triple verification mechanism of "location + role + visit code", and provides a full-process visualized medical record timeline and dashboard view.

**核心价值 | Core Values:**
- 🏥 适配无网络/弱网络环境下的基层诊疗场景
- 🔒 构建不可篡改的诊疗行为证据链
- 📱 纯浏览器运行，降低部署与维护成本
- 🤖 AI 辅助开发，提升项目迭代效率
- 🏥 Adapt to primary healthcare scenarios in offline or low-network environments
- 🔒 Build an immutable evidence chain of medical practices
- 📱 Runs purely in the browser, reducing deployment and maintenance costs
- 🤖 AI-assisted development to improve project iteration efficiency

---

## ✨ 核心特性 | Core Features

- 🛠 **零依赖部署 | Zero-dependency Deployment**：无需 Node.js、数据库或后端服务，浏览器双击 `index.html` 即可运行
- 🔐 **真实性核验 | Authenticity Verification**：基于地点、操作员角色、就诊码的三重校验，拦截不合规诊疗操作
- 📊 **全流程可视化 | Full-process Visualization**：时间轴病历展示诊疗全链路，仪表盘统计关键业务指标
- 📝 **闭环管理 | Closed-loop Management**：覆盖患者登记 → 处方开具 → 医技执行 → 病历归档的完整诊疗流程
- 🎨 响应式设计 | Responsive Design：适配桌面端与平板设备，支持多场景操作

---

## 🚀 快速开始 | Quick Start

### 环境要求 | Prerequisites
- 现代浏览器（推荐 Chrome ≥ 80 或 Edge ≥ 80）
- 无网络环境也可离线运行
- Modern browsers (recommended Chrome ≥ 80 or Edge ≥ 80)
- Can run offline without network access

### 运行步骤 | How to Run
1. 下载或克隆本项目到本地 | Download or clone this project to your local machine
   ```bash
   git clone https://github.com/RichardlauCx/aiCaseManage.git
   ```
2. 进入项目目录，找到 `index.html` 文件 | Navigate to the project directory and find the `index.html` file
3. 双击打开 `index.html`，系统将自动初始化演示数据 | Double-click to open `index.html`, and the system will automatically initialize demo data
4. 按照核心流程脚本体验系统功能 | Follow the core process script to experience the system functions

---

## 📋 核心流程演示脚本 | Core Process Demo Script

为了全面体验系统功能，建议按以下顺序操作：

To fully experience the system functions, it is recommended to operate in the following order:

### Step 1: 患者登记 | Patient Registration
- 点击左侧导航栏「患者管理」→ 「新增患者」 | Click "Patient Management" → "Add New Patient" in the left sidebar
- 填写患者基本信息并提交 | Fill in the patient's basic information and submit
- 记录系统自动生成的 **就诊码 (VisitCode)**，用于后续诊疗核验 | Record the automatically generated **VisitCode** for subsequent medical verification

### Step 2: 医生开处方（核验演示）| Doctor Prescribing (Verification Demo)
1. 进入「诊疗任务追踪」模块，找到状态为“待执行”的黄色任务 | Enter the "Medical Task Tracking" module and find the yellow task with the status "Pending"
2. 点击「执行并核验」按钮 | Click the "Execute and Verify" button
3. **正确操作流程 | Correct Operation Process**：
   - 地点选择：`医生诊室` | Location selection: `Doctor's Office`
   - 操作员：`张医生` | Operator: `Dr. Zhang`
   - 输入 PIN 码：`1234` | Enter PIN code: `1234`
   - 输入 Step 1 生成的就诊码 | Enter the VisitCode generated in Step 1
4. **错误测试 | Error Testing**：尝试选择错误地点（如影像中心）或操作员，系统将拦截并提示校验失败 | Try selecting the wrong location (e.g., Imaging Center) or operator, and the system will block and prompt verification failure

### Step 3: 医技执行（自动流转）| Medical Technology Execution (Automatic Flow)
- 处方完成后，系统自动派发「理疗」或「影像」任务 | After the prescription is completed, the system will automatically assign a "Physiotherapy" or "Imaging" task
- 根据任务提示前往对应地点（如理疗室/影像中心） | Go to the corresponding location (e.g., Physiotherapy Room/Imaging Center) according to the task prompt
- 完成医技操作后，系统自动更新诊疗状态 | After completing the medical technology operation, the system will automatically update the medical status

### Step 4: 病历查看 | Medical Record Viewing
- 回到「患者管理」列表，点击目标患者的「详情」按钮 | Return to the "Patient Management" list and click the "Details" button of the target patient
- 查看完整的时间轴病历，追溯所有诊疗操作记录 | View the complete timeline medical record and trace all medical operation records

---

## 🛠 技术栈 | Tech Stack

- **前端框架 | Frontend Framework**：原生 HTML5 / CSS3 / JavaScript（ES6+）
- **数据持久化 | Data Persistence**：浏览器 LocalStorage API
- **UI 组件 | UI Components**：自定义响应式组件，无第三方 UI 库依赖
- **开发辅助 | Development Assistance**：AI 辅助需求拆解、架构设计与代码调试

---

## 📁 项目结构 | Project Structure

```
aiCaseManage/
├── index.html          # 系统入口文件 | System entry file
├── css/
│   └── style.css       # 全局样式文件 | Global style file
├── js/
│   ├── app.js          # 核心业务逻辑 | Core business logic
│   ├── storage.js      # LocalStorage 数据管理 | LocalStorage data management
│   └── ui.js           # UI 交互与渲染 | UI interaction and rendering
├── data/
│   └── demo.json       # 演示数据初始化文件 | Demo data initialization file
└── README.md           # 项目说明文档 | Project documentation
```

---

## ⚠️ 注意事项 | Notes

1. **数据安全 | Data Security**：本系统基于浏览器 LocalStorage 存储数据，清除浏览器缓存将导致数据丢失，生产环境需定期导出备份
   The system stores data based on browser LocalStorage. Clearing the browser cache will result in data loss. Regular export backups are required in production environments.
2. **兼容性 | Compatibility**：不支持 IE 浏览器，建议使用 Chrome/Edge/Firefox 等现代浏览器
   IE browsers are not supported. It is recommended to use modern browsers such as Chrome/Edge/Firefox.
3. **演示数据 | Demo Data**：首次运行时系统会自动加载演示数据，可通过「设置」模块重置数据
   The system will automatically load demo data when running for the first time, and you can reset the data through the "Settings" module.
4. **角色权限 | Role Permissions**：默认操作员角色包括医生、医技人员、管理员，不同角色操作权限不同
   The default operator roles include doctors, medical technicians, and administrators, with different operation permissions for different roles.

---

## 🤝 贡献指南 | Contributing

欢迎提交 Issue 或 Pull Request 来改进项目：

Welcome to submit an Issue or Pull Request to improve the project:

1. Fork 本仓库 | Fork this repository
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`) | Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`) | Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`) | Push to the branch (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request | Open a Pull Request

---

## 📄 许可证 | License

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
