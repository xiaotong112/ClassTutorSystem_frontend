# 班导师管理系统

一个全面的高校班导师管理平台，支持班级、学生、课程、活动、计划管理等功能。

## 技术栈

### 后端

- Spring Boot 3.2.5
- MyBatis Plus 3.5.5
- MySQL
- JWT 认证
- Knife4j (Swagger) API 文档

### 前端

- Vue 3
- Element Plus
- Vue Router
- Pinia
- Axios
- Vite

## 项目结构

```
project-teacher/
├── project-teacher-end/          # 后端代码
│   ├── src/main/java/com/cuit/
│   │   ├── controller/          # 控制器层
│   │   ├── service/             # 服务层
│   │   ├── mapper/              # 数据访问层
│   │   ├── entity/              # 实体类
│   │   ├── dto/                 # 数据传输对象
│   │   ├── vo/                  # 视图对象
│   │   └── utils/               # 工具类
│   └── src/main/resources/
│       ├── application.yml      # 配置文件
│       └── db/schema.sql        # 数据库初始化脚本
└── teacher-front/               # 前端代码
    ├── src/
    │   ├── views/               # 页面组件
    │   ├── components/          # 公共组件
    │   ├── layouts/             # 布局组件
    │   ├── router/              # 路由配置
    │   ├── api/                 # API 服务
    │   └── stores/              # 状态管理
    └── package.json
```

## 功能模块

1. **用户管理** - 用户登录、注册、权限管理
2. **班级管理** - 班级信息维护、学生统计
3. **学生管理** - 学生信息管理、查询
4. **课程管理** - 课程信息维护
5. **活动管理** - 活动创建、状态跟踪
6. **计划管理** - 计划制定、进度跟踪
7. **学生评估** - 学生表现评估记录
8. **数据统计** - 系统数据分析和统计报告

## 快速开始

### 数据库配置

1. 创建数据库：

```sql
CREATE DATABASE project_teacher DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 执行初始化脚本：

```bash
mysql -u root -p project_teacher < project-teacher-end/src/main/resources/db/schema.sql
```

3. 修改数据库配置（`application.yml`）：

```yaml
spring:
  datasource:
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/project_teacher?characterEncoding=utf-8&useSSL=false
```

### 后端启动

```bash
cd project-teacher-end
mvn clean install
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

API 文档地址：`http://localhost:8080/doc.html`

### 前端启动

```bash
cd teacher-front
npm install
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

### 默认账号

- 用户名：`admin`
- 密码：`admin123`（需要在数据库中设置）

## 开发说明

### 后端开发

- 使用 MyBatis Plus 进行数据库操作
- 统一使用 `Result<T>` 封装返回结果
- 使用 JWT 进行身份认证
- 使用 Swagger 生成 API 文档

### 前端开发

- 使用 Element Plus 组件库
- 使用 Pinia 进行状态管理
- 使用 Vue Router 进行路由管理
- API 请求统一使用 axios 封装

## 注意事项

1. 确保 MySQL 服务已启动
2. 确保后端服务先启动，前端才能正常调用 API
3. 首次运行需要执行数据库初始化脚本
4. 前端需要安装 `@element-plus/icons-vue` 图标库

## 许可证

MIT License
