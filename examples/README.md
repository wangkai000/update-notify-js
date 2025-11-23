# Examples

这个目录包含了 `update-notify-js` 在不同框架中的使用示例。

## 目录结构

- `vue/` - Vue 3 项目示例
- `react/` - React 项目示例
- `vanilla/` - 原生 JavaScript 示例
- `auto-mode.js` - 自动模式示例
- `manual-mode.js` - 手动模式示例
- `micro-frontend.js` - 微前端场景示例（支持多路径配置）

## 安装

```bash
npm install update-notify-js
# 或
yarn add update-notify-js
# 或
pnpm add update-notify-js
```

## 快速开始

### Vue 3 项目

```javascript
import { createUpdateNotifier } from 'update-notify-js';

if (import.meta.env.PROD) {
  createUpdateNotifier({
    pollingInterval: 60000, // 每分钟检查一次
    debug: false,
    onDetected: () => {
      console.log('检测到新版本！');
    }
  });
}
```

### React 项目

```javascript
import { createUpdateNotifier } from 'update-notify-js';

if (process.env.NODE_ENV === 'production') {
  createUpdateNotifier({
    pollingInterval: 30000, // 每30秒检查一次
    debug: false,
    onDetected: () => {
      console.log('检测到新版本！');
    }
  });
}
```

### 原生 JavaScript

- 使用 ES Module
  ```javascript
  import { createUpdateNotifier } from 'update-notify-js';
  
  const notifier = createUpdateNotifier({
    pollingInterval: 60000,
    debug: true
  });
  ```

- 使用 UMD 格式（浏览器直接引用）
  ```html
  <script src="path/to/index.umd.js"></script>
  <script>
    const notifier = VersionUpdateCheck.createUpdateNotifier({
      pollingInterval: 60000
    });
  </script>
  ```

## 特性说明

- 自动检测项目版本更新
- 支持自定义检测间隔
- 支持自定义更新提示UI
- 支持手动触发检查
- 支持停止/重启检测
- 支持环境区分（仅生产环境运行）

## 使用示例

请查看对应目录中的文件了解详细用法：

1. 原生JS完整示例：`vanilla/index.html`
2. Vue 3 集成：`vue/main.js`
3. React 集成：`react/index.jsx`
4. 自动模式：`auto-mode.js`
5. 手动模式：`manual-mode.js`
6. 微前端场景：`micro-frontend.js` - 展示如何监控多个子应用的更新
