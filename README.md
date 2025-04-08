
# 在线课程观看系统

## 项目简介
本项目是一个基于 Vue + Express 的在线课程观看系统，支持用户登录注册、课程观看、进度保存等功能，并具备高并发处理能力。
本项目的目的是为了提供一个简单易用的在线课程观看平台，同时也为了学习和实践 Vue.js 和 Express 的相关知识。
本项目大量采用chatgpt与treaAI工具完成，代码质量可能存在一定的问题，仅供参考。

## 功能需求
1. 使用nodejs express搭建后台，实现登陆注册，要有token，前端界面使用vue elementUI；
2. 登陆后，实现学生看课功能（两三个视频展示即可），要求实时保存进度（允许中间可暂停等情况），且保存历史看课记录，能承受2000人同时观看的高并发，用测试软件测试；
3. 前后端同时开发，页面自行设计和编写。

## 技术栈
### 前端
- Vue.js
- Element UI
- Axios
- Vue Router
- Vuex

### 后端
- Node.js
- Express
- JWT
- suqobase
-- Redis (用于缓存和提升并发性能)

## 项目运行
### 前端
```bash
# 进入前端目录
cd front
# 安装依赖
npm install  
npm run dev
http://localhost:5174/

# code server
npm install &npm run dev or node app.js
http://localhost:3000/

.
├── front                  # 前端项目目录
│   ├── src/                # 源码目录
│   ├── public/             # 静态资源
│   └── package.json        # 项目依赖
├── server/                # 后端项目目录
│   ├── src/               # 源码目录
│   ├── config/            # 配置文件
│   └── package.json       # 项目依赖
└── README.md              # 项目说明文档



这个 README 包含了：
1. 项目简介和功能需求
2. 使用的技术栈
3. 运行说明
4. 项目结构
5. API 文档
6. 性能测试说明
7. 注意事项

这样的文档结构清晰，能够帮助开发者快速了解和启动项目。如果你觉得还需要补充其他内容，请告诉我。

## PI 文档
### 用户相关
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- GET /api/auth/profile - 获取用户信息
### 课程相关
- GET /api/courses - 获取课程列表
- GET /api/courses/:id - 获取课程详情
- POST /api/courses/progress - 保存观看进度
- GET /api/courses/history - 获取观看历史
## 性能测试
使用 Apache JMeter 进行并发测试，确保系统可以支持 2000 人同时在线观看视频。

## 注意事项
1. 请确保已安装 Node.js (v14+) 和 npm
2. 需要本地安装并运行 MongoDB 和 Redis
3. 视频文件建议使用云存储服务
4. 开发时注意性能优化和并发处理