# Project Overview: Song App

这是一个全栈 Web 应用程序，包含基于 Node.js 的后端和高度模块化的 React 前端。

## 技术栈

- **Frontend:** React (TypeScript), Vite, CSS3 (Modular CSS), Glassmorphism UI
- **Backend:** Node.js, Express, SQLite (better-sqlite3), bcrypt (加密), jsonwebtoken (JWT 认证), multer (文件上传)
- **Deployment:** Nginx (反向代理), SSL (Certbot)

## 项目结构

- `backend/`: 后端源码
  - `src/`: Express 路由和鉴权中间件
  - `uploads/`: 用户媒体文件（图片、视频、音乐）
  - `database.sqlite`: SQLite 核心数据库
- `frontend/`: 前端源码
  - `src/components/`: 模块化组件
    - `Auth/`: 登录/注册逻辑与样式（支持登录历史记忆）
    - `Social/`: 社交中心与整合版生活圈
    - `Layout/`: 顶部导航与全局布局
    - `Music/`, `Wardrobe/`, `Nest/`: 功能模块专属组件与样式
  - `App.tsx`: 全局状态控制中心
- `root/`: 部署脚本、Nginx 配置与 Python 维护工具

## 核心功能

1. **用户系统:** 注册、登录、修改昵称、退出登录。登录页面支持 **本地 ID 历史记忆**。
2. **社交中心 (整合版):** 
   - **聊天**: 好友搜索、实时聊天、申请处理、好友管理。
   - **生活圈**: 与社交中心合并，支持发布心情动态（图文/视频）、删除动态。
3. **日程管理:** 基于时间轴的 24 小时日程安排。
4. **小小窝:** 个人私密收藏空间，支持分类管理照片、视频和日记。
5. **音乐中心:** 搜索音乐（网易云/模拟）、上传个人/专属音乐、全功能播放器。
6. **小衣柜:** 衣服上传、**AI 自动分类与颜色识别**、场景化智能搭配推荐。
7. **桌面宠物:** 交互式动态宠物（猫、狗、团子等），支持拖拽、改名、互动。
8. **管理面板:** 管理员权限控制，用户数据全量管理。
9. **游戏中心:** 预留的分区，用于未来新游戏的接入。

## 运行与开发

### 后端 (Backend)

- **安装依赖:** `cd backend && npm install`
- **启动服务:** `npm start` (默认运行在 3000 端口)
- **运行测试:** `npm test`

### 前端 (Frontend)

- **安装依赖:** `cd frontend && npm install`
- **开发模式:** `npm run dev`
- **构建项目:** `npm run build`
- **运行测试:** `npm run test`

## 开发规约

- **安全与认证 (CRITICAL):**
  - 后端采用 JWT (JSON Web Token) 进行身份验证。
  - **防越权 (Anti-IDOR):** 绝对禁止在受保护的路由中信任客户端传来的 `user_id` (无论是 query 还是 body)。必须使用 `req.user.id` (由 `authMiddleware` 提供) 来进行数据库操作和权限校验。
  - 管理员操作必须通过 `adminMiddleware` 校验 (`req.user.is_admin === 1`)。
- **前后端通信:**
  - 前端在 `main.tsx` 中配置了全局 `fetch` 拦截器，自动从 `localStorage` 读取 `token` 并注入 `Authorization: Bearer <token>` 请求头。开发者在编写 API 请求时无需手动附加 token。
- **数据存储:**
  - 所有结构化数据（包括 nest 记录、wardrobe 衣柜物品、music 记录等）**必须**存储在 SQLite 数据库中。严禁使用本地 `.json` 文件进行数据持久化，以确保多用户并发安全和数据隔离。
  - 数据库表结构定义统一在 `backend/src/db.js` 中。
- **后端模块:** 
  - 使用 CommonJS 模块。路由逻辑按功能模块划分（如 `auth.js`, `music.js`, `social.js`, `wardrobe.js`）。
- **前端:** 
  - 使用 TypeScript 和 React 函数式组件。样式主要集中在 `App.css` 和组件对应的 CSS 文件中。
- **API:** 
  - 所有 API 接口以 `/api` 开头。

## 部署信息

- 生产环境下，Nginx 监听 80/443 端口。
- 静态文件由 Nginx 直接提供服务（指向 `frontend/dist`）。
- API 请求被转发到后端 Node.js 服务。

## 常用维护脚本

- `check_user.py`: 检查数据库中的用户。
- `create_user.py`: 创建新用户。
- `fix_api_urls.py`: 修复 API URL 地址。
- `deploy.bat`: 部署相关的批处理文件。
