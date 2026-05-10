# LLM Leaderboard: Price vs Performance

一个现代化的大模型评测榜单网页应用，用于比较不同 LLM 模型的性能和价格。

## How to Run

### 使用 Docker Compose（推荐）

```bash
docker-compose up --build
```

应用将在 `http://localhost:8080` 启动。

### 本地开发

```bash
# 进入项目目录
cd frontend-llm-leaderboard

# 安装依赖
npm install

# 开发模式
npm run dev

```

应用将在 `http://localhost:3000` 启动。

## Services

### Frontend LLM Leaderboard Web Application
- **外部端口**: 8080
- **内部端口**: 3000
- **技术栈**: Next.js 16.1.3, React 19.2.3, TypeScript 5
- **UI 框架**: Tailwind CSS 4, Shadcn/ui, Lucide Icons
- **图表库**: Recharts 3.6.0
- **功能**: 
  - 交互式散点图展示 LLM 模型的价格与性能对比
  - 实时筛选功能（按模型系列、价格范围、开源状态）
  - 深色模式界面
  - 响应式设计
  - 中文界面

## 测试账号

本应用无需登录，可直接访问所有功能。

## 题目内容

我想做一个大模型评测榜单网页。技术栈请使用：Next.js, Tailwind CSS, Shadcn/ui, Lucide Icons。页面布局包含：顶部是一个标题栏（Header），包含标题“LLM Leaderboard: Price vs Performance”。主体部分分为两栏：左侧是控制面板（筛选器），右侧是图表展示区。配色风格要现代、简洁，使用深色模式（Dark Mode）。

**技术栈要求：**
- Next.js
- Tailwind CSS
- Shadcn/ui
- Lucide Icons

**页面布局要求：**
- 顶部是一个标题栏（Header），包含标题"LLM Leaderboard: Price vs Performance"
- 主体部分分为两栏：
  - 左侧是控制面板（筛选器）
  - 右侧是图表展示区
- 配色风格要现代、简洁，使用深色模式（Dark Mode）

### 实现情况

✅ **技术栈完全满足**
- Next.js 16.1.3
- Tailwind CSS 4
- Shadcn/ui 完整组件库
- Lucide Icons 图标库

✅ **页面布局完全实现**
- Header：包含标题和图标
- 左侧筛选面板：模型系列、价格范围、开源模式
- 右侧图表区：统计卡片和交互式散点图

✅ **深色模式设计**
- 现代简洁的配色方案
- 高对比度易于阅读
- 完整的深色模式 CSS 变量

---

## 项目介绍

### 功能特性

- **模型对比**: 通过散点图直观展示不同 LLM 模型的性能评分与价格关系
- **智能筛选**: 
  - 按模型系列筛选（GPT-4、Claude 3、Llama 3、Gemini、Mistral）
  - 按价格范围筛选（0-50 美元/百万 tokens）
  - 仅显示开源模型选项
  - 一键重置筛选条件
- **实时统计**: 动态显示筛选结果的统计信息
  - 总模型数
  - 平均性能评分
  - 最佳性价比模型
  - 最佳性能模型
- **现代 UI**: 深色模式设计，简洁优雅的界面
- **中文界面**: 完整的中文本地化

### 技术栈详情

- **前端框架**: Next.js 16.1.3
- **UI 库**: React 19.2.3
- **样式**: Tailwind CSS 4
- **组件库**: Shadcn/ui（Button、Card、Checkbox、Label、Select、Slider、Switch、Badge）
- **图表**: Recharts 3.6.0
- **图标**: Lucide React 0.562.0
- **类型检查**: TypeScript 5
- **容器化**: Docker（支持 ARM64 和 x86_64）

### 项目结构

```
frontend-llm-leaderboard/
├── src/
│   ├── app/
│   │   ├── page.tsx           # 主页面，状态管理
│   │   ├── layout.tsx         # 根布局
│   │   └── globals.css        # 全局样式和深色模式配置
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx     # 顶部标题栏
│   │   ├── dashboard/
│   │   │   ├── Filters.tsx    # 左侧筛选面板
│   │   │   └── ChartSection.tsx # 右侧图表展示
│   │   └── ui/                # Shadcn/ui 组件库
│   └── lib/
│       └── utils.ts           # 工具函数
├── public/                    # 静态资源
├── Dockerfile                 # Docker 镜像配置（支持跨平台）
├── package.json              # 项目依赖
└── tsconfig.json             # TypeScript 配置
```

### 页面布局详情

**Header（顶部标题栏）**
- 应用标题："LLM Leaderboard: Price vs Performance"
- 图表图标
- 现代简洁的设计

**Sidebar（左侧筛选面板）**
- 模型系列多选框（GPT-4、Claude 3、Llama 3、Gemini、Mistral）
- 价格范围滑块（0-50 美元/百万 tokens）
- 仅开源模式开关
- 重置按钮

**Main（右侧内容区域）**
- 4 个统计卡片
  - 总模型数
  - 平均性能评分
  - 最佳性价比
  - 最佳性能
- 交互式散点图
  - X 轴：价格（美元/百万 tokens）
  - Y 轴：性能评分
  - 按模型系列着色
  - 自定义 Tooltip 显示详情

### 配色方案

采用现代深色模式设计：
- **背景色**: oklch(0.22 0 0) - 深灰色
- **前景色**: oklch(0.93 0 0) - 浅白色
- **主色**: oklch(0.65 0.15 200) - 蓝色
- **卡片**: oklch(0.32 0 0) - 中灰色
- **边框**: oklch(1 0 0 / 20%) - 半透明白色

### 数据示例

应用包含 10 个示例 LLM 模型：
- GPT-4o (88.7 分, $15/M tokens, 专有)
- Claude 3.5 Sonnet (88.3 分, $6/M tokens, 专有)
- GPT-4 Turbo (86.5 分, $20/M tokens, 专有)
- Llama 3 70B (82.0 分, $0.8/M tokens, 开源)
- Gemini 1.5 Pro (85.9 分, $7/M tokens, 专有)
- Mistral Large (84.0 分, $8/M tokens, 专有)
- Llama 3 8B (68.0 分, $0.1/M tokens, 开源)
- Claude 3 Haiku (75.2 分, $0.5/M tokens, 专有)
- GPT-3.5 Turbo (70.0 分, $1.0/M tokens, 专有)
- Mixtral 8x22B (77.8 分, $1.2/M tokens, 开源)

## 开发指南

### 添加新模型

编辑 `src/components/dashboard/ChartSection.tsx` 中的 `allData` 数组：

```typescript
const allData = [
  { name: '模型名称', price: 价格, score: 评分, family: '系列', type: '类型' },
  // ...
];
```

### 修改筛选条件

在 `src/app/page.tsx` 中修改 `FilterState` 接口和初始状态。

### 自定义颜色

编辑 `src/app/globals.css` 中的 CSS 变量。

## Docker 部署

### 使用 Docker Compose

```bash
# 构建并启动
docker-compose up --build

# 查看日志
docker-compose logs -f frontend-llm-leaderboard

# 停止服务
docker-compose down
```

### 单独构建 Docker 镜像

```bash
# 构建镜像
docker build -t frontend-llm-leaderboard ./frontend-llm-leaderboard

# 运行容器
docker run -p 8080:3000 frontend-llm-leaderboard
```

### 跨平台支持

Dockerfile 使用 `--platform` 标志支持多架构构建：
- **Linux AMD64** (x86_64) - 标准 Intel/AMD 处理器
- **Linux ARM64** (Apple Silicon, ARM 服务器)

构建命令：
```bash
# 构建多架构镜像
docker buildx build --platform linux/amd64,linux/arm64 -t frontend-llm-leaderboard ./frontend-llm-leaderboard
```

## 许可证

MIT
