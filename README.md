# 待办事项应用 (Todo App)

一个美观的待办事项管理应用，支持成就系统、进度追踪和连续打卡功能。

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **后端**: Supabase (PostgreSQL)
- **部署**: Vercel + Supabase

## 项目结构

```
todo/
├── docs/
│   ├── api-spec.md         # API 接口规范
│   ├── features.md         # 功能规格文档
│   └── supabase-setup.sql  # 数据库设置脚本
│
├── public/                  # 前端资源
│   ├── index.html          # 入口页面
│   ├── env.example         # 环境变量示例
│   ├── vercel.json         # Vercel 配置
│   ├── css/
│   │   └── styles.css      # 样式文件
│   └── js/
│       ├── main.js          # 业务逻辑
│       └── api/
│           ├── config.js   # Supabase 配置
│           └── api.js      # API 调用
│
└── README.md
```

---

## 快速部署指南

### 第一步：注册账号

1. **注册 Supabase**: https://supabase.com
2. **注册 Vercel**: https://vercel.com (用邮箱注册)

### 第二步：创建 Supabase 数据库

1. 登录 Supabase Dashboard
2. 点击 **New Project** → 创建项目
   - 选择区域：**香港** 或 **新加坡**（国内访问快）
3. 等待创建完成（1-2分钟）

### 第三步：设置数据库

1. 进入项目 → **SQL Editor**
2. 复制 `docs/supabase-setup.sql` 内容并执行
3. 验证表创建成功

### 第四步：获取 API 密钥

1. 进入项目 → **Settings** → **API**
2. 复制：
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: 一长串字符

### 第五步：更新配置文件

编辑 `public/js/api/config.js`:

```javascript
const CONFIG = {
  SUPABASE_URL: 'https://你的项目ID.supabase.co',
  SUPABASE_ANON_KEY: '你的anon密钥'
};
```

### 第六步：部署到 Vercel

#### 方式一：Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 进入 public 目录
cd public

# 部署
vercel --prod
```

#### 方式二：GitHub 部署

1. 创建 GitHub 仓库
2. Vercel → **Import Project** → 选择仓库
3. 配置：
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (留空)
   - **Output Directory**: public
4. 点击 **Deploy**

### 第七步：验证部署

访问 Vercel 提供的 URL，测试功能：
- [ ] 添加待办
- [ ] 完成待办
- [ ] 删除待办
- [ ] 成就系统
- [ ] 刷新页面确认数据持久化

---

## 功能特性

- [x] 添加/删除待办事项
- [x] 标记待办完成/未完成
- [x] 清除已完成的待办
- [x] 进度条显示
- [x] 今日完成数统计
- [x] 连续打卡天数追踪
- [x] 成就系统
- [x] 鼓励弹窗动画
- [x] 毛玻璃视觉效果
- [x] 时间戳显示

## 成本估算

| 服务 | 免费额度 | 费用 |
|------|---------|------|
| Supabase | 500MB 数据库 | 免费 |
| Vercel | 100GB 带宽/月 | 免费 |

**总计：免费**

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

---

## 本地开发

```bash
# 启动本地服务器
npx serve public

# 或 Python
python -m http.server 8080
```

访问 http://localhost:8080
