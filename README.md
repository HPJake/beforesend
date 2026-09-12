# BeforeSend — AI 沟通防火墙

> 在发送之前，看看对方听到的是什么。
> Not nicer. **Clearer.**

一个 AI Communication Firewall：在用户发送消息之前，预测对方会怎么理解，并指出"想表达"与"可能被理解"之间的差距（Intent–Perception Gap）。
在线演示链接： https://beforesend.vercel.app/
介绍文档：https://my.feishu.cn/wiki/QzXgwg3hMihEzFkTuHoctYVNnBh?from=from_copylink

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置 API Key
cp .env.local.example .env.local
# 编辑 .env.local，填入 DEEPSEEK_API_KEY

# 3. 启动
npm run dev
# 访问 http://localhost:3000
```

未配置 API Key 时，应用会自动 fallback 到 **Mock 模式**（返回占位数据，方便预览 UI）。

## 环境要求

- Node.js >= 18
- DeepSeek API Key（[申请地址](https://platform.deepseek.com/)）

## 技术栈

- **Next.js 16** (App Router + Turbopack)
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4**
- **Framer Motion**（动画）
- **Lucide React**（图标）
- **DeepSeek-V3** (`deepseek-chat`)——支持 JSON mode，中文能力强

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页：输入 + 关系/目标选择
│   ├── analyze/page.tsx      # 分析页：Risk + Gap + Tone Slider
│   └── api/analyze/route.ts  # 后端 API（DeepSeek 调用）
├── components/               # UI 组件
├── lib/
│   ├── schemas.ts            # 类型定义
│   ├── prompts.ts            # Prompt 模板（可调优）
│   ├── llm.ts                # DeepSeek 调用 + Mock fallback
│   └── examples.ts           # 示例消息
```

## 核心功能

1. **Communication Risk Score**——0–100 综合风险分 + 六维度细分
2. **You Mean ↔ They May Hear**——左右双栏 + 中间 GAP 数值
3. **Tone Slider**——温和/坚定/强硬三档实时切换
4. **Receiver Simulation**——模拟对方的第一反应
5. **一键示例**——内置 4 条典型消息快速试用

## 部署

推荐 Vercel：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 在 Vercel Dashboard 配置环境变量 DEEPSEEK_API_KEY
```

## 设计原则（来自 PRD §19）

1. **不评判用户**——只描述"可能产生的理解"
2. **不把所有话变礼貌**——强硬本身不是问题
3. **尽量少打扰**——低风险消息直接通过
4. **AI 给用户选择，而不是替用户决定**

## 路线图

- **V1**: Message Intelligence（当前 MVP）—— 理解一句话
- **V2**: Relationship Intelligence—— 理解两个人的关系
- **V3**: Personal Communication Intelligence—— 长期用户画像 + 关系图谱

---

**有些话没有恶意，只是发送得太快。** 🛡️
