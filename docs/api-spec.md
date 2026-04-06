# 待办事项应用 - API 接口规范

## 概述

本规范定义了待办事项应用的 RESTful API 接口，供前端调用。  
当前环境为 Mock 模式，数据存储在浏览器 localStorage 中。

---

## 基础信息

```
Base URL: /api/v1
Content-Type: application/json
```

---

## 数据模型

### Todo (待办事项)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 唯一标识符 |
| text | string | 待办内容 |
| done | boolean | 完成状态 |
| createdAt | string | 创建时间 (ISO 8601) |
| updatedAt | string | 更新时间 (ISO 8601) |

### Stats (统计数据)

| 字段 | 类型 | 描述 |
|------|------|------|
| totalCompleted | number | 历史累计完成数 |
| todayCompleted | number | 今日完成数 |
| todayDate | string | 当前日期 |
| currentStreak | number | 连续完成天数 |
| lastCompletedDate | string | 上次完成日期 |
| achievements | string[] | 已解锁成就ID列表 |

### Achievement (成就)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 唯一标识符 |
| name | string | 成就名称 |
| desc | string | 成就描述 |
| icon | string | 成就图标 |
| require | number | 解锁条件值 |

---

## 接口列表

### 1. 获取所有待办事项

```
GET /todos
```

**响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "uuid-1",
      "text": "完成项目报告",
      "done": false,
      "createdAt": "2026-04-05T10:00:00Z",
      "updatedAt": "2026-04-05T10:00:00Z"
    },
    {
      "id": "uuid-2",
      "text": "买菜",
      "done": true,
      "createdAt": "2026-04-05T09:00:00Z",
      "updatedAt": "2026-04-05T09:30:00Z"
    }
  ]
}
```

---

### 2. 添加待办事项

```
POST /todos
```

**请求体**
```json
{
  "text": "新待办事项内容"
}
```

**响应示例**
```json
{
  "code": 201,
  "message": "created",
  "data": {
    "id": "uuid-3",
    "text": "新待办事项内容",
    "done": false,
    "createdAt": "2026-04-05T11:00:00Z",
    "updatedAt": "2026-04-05T11:00:00Z"
  }
}
```

---

### 3. 更新待办事项

```
PUT /todos/:id
```

**请求体**
```json
{
  "text": "更新后的内容",
  "done": true
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "uuid-1",
    "text": "更新后的内容",
    "done": true,
    "createdAt": "2026-04-05T10:00:00Z",
    "updatedAt": "2026-04-05T11:00:00Z"
  }
}
```

---

### 4. 删除待办事项

```
DELETE /todos/:id
```

**响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 5. 批量删除已完成事项

```
DELETE /todos/completed
```

**响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "deletedCount": 3
  }
}
```

---

### 6. 获取统计数据

```
GET /stats
```

**响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalCompleted": 25,
    "todayCompleted": 3,
    "todayDate": "2026-04-05",
    "currentStreak": 5,
    "lastCompletedDate": "2026-04-05",
    "achievements": ["first", "ten", "streak3"]
  }
}
```

---

### 7. 更新统计数据

```
PUT /stats
```

**请求体**
```json
{
  "todayCompleted": 4,
  "totalCompleted": 26,
  "currentStreak": 5
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalCompleted": 26,
    "todayCompleted": 4,
    "todayDate": "2026-04-05",
    "currentStreak": 5,
    "lastCompletedDate": "2026-04-05",
    "achievements": ["first", "ten", "streak3"]
  }
}
```

---

### 8. 解锁成就

```
POST /stats/achievements
```

**请求体**
```json
{
  "achievementId": "streak7"
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "achievements": ["first", "ten", "streak3", "streak7"]
  }
}
```

---

### 9. 获取所有成就

```
GET /achievements
```

**响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "unlocked": [
      {
        "id": "first",
        "name": "初露锋芒",
        "desc": "完成第一个任务",
        "icon": "🌟",
        "require": 1,
        "unlockedAt": "2026-04-01T10:00:00Z"
      }
    ],
    "locked": [
      {
        "id": "fifty",
        "name": "高效达人",
        "desc": "累计完成50个任务",
        "icon": "🚀",
        "require": 50
      }
    ]
  }
}
```

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## Mock 模式配置

当前为 Mock 模式，配置项位于 `config.js`:

```javascript
const CONFIG = {
  API_BASE_URL: '/api/v1',
  USE_MOCK: true,  // 切换为 false 启用真实API
  MOCK_DELAY: 300   // 模拟网络延迟(ms)
};
```
