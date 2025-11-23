# web-version-checker

[![npm version](https://img.shields.io/npm/v/web-version-checker.svg)](https://www.npmjs.com/package/web-version-checker)
[![license](https://img.shields.io/npm/l/web-version-checker.svg)](https://github.com/yourusername/web-version-checker/blob/main/LICENSE)

一个纯前端实现的版本更新自动提示刷新插件，无需后端配合。

[English](./README.md) | 简体中文

## ✨ 特性

- 🚀 **纯前端实现** - 无需后端配合，通过轮询检测 HTML 中的 script 变化
- 📦 **开箱即用** - 简单配置即可使用
- 🎯 **TypeScript 支持** - 完整的类型定义
- ⚙️ **高度可配置** - 支持自定义轮询间隔、提示方式等
- 🎨 **自定义提示** - 支持自定义更新提示 UI
- 🔄 **智能暂停** - 页面隐藏时自动暂停检测，节省资源
- 📱 **多种引入方式** - 支持 ESM、CJS、UMD 多种模块格式

## 📦 安装

```bash
npm install web-version-checker
```

或使用 yarn:

```bash
yarn add web-version-checker
```

或使用 pnpm:

```bash
pnpm add web-version-checker
```

## 🚀 快速开始

### 基础用法

在你的项目入口文件（如 `main.js` 或 `main.ts`）中引入：

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// 创建检测器实例并自动开始检测
const notifier = createUpdateNotifier();
```

就这么简单！插件会自动每 10 秒检测一次版本更新，发现更新时会弹出确认框询问用户是否刷新。

### 两种使用模式

#### 模式 1：自动轮询模式（推荐）

插件自动定时检测，无需手动干预：

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// 每分钟自动检测一次
createUpdateNotifier({
  pollingInterval: 60000  // 60000ms = 1分钟
});
```

#### 模式 2：完全手动模式

禁用自动轮询，自己编写定时器控制检测时机：

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// 设置 pollingInterval 为 null 或 0 禁用自动轮询
const notifier = createUpdateNotifier({
  pollingInterval: null  // 或者 0
});

// 自己编写定时器，每分钟检测一次
setInterval(async () => {
  await notifier.checkUpdate();  // 检测并提示用户
}, 60000);

// 或者在特定事件触发时检测
button.addEventListener('click', async () => {
  const hasUpdate = await notifier.checkUpdate();
  if (!hasUpdate) {
    alert('当前已是最新版本');
  }
});
```

> **为什么需要手动模式？**
> 
> 手动模式让你完全控制检测时机，适用于：
> - 需要复杂的检测逻辑（如：只在特定时间段检测）
> - 根据用户活跃度动态调整检测频率
> - 与其他业务逻辑深度集成

---

## 📚 不同框架使用指南

### 原生 HTML + JavaScript

#### 方式 1：使用 UMD 版本（无需构建工具）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>版本更新检测</title>
</head>
<body>
  <h1>我的应用</h1>
  
  <!-- 引入 UMD 版本 -->
  <script src="https://unpkg.com/web-version-checker/dist/index.umd.js"></script>
  <script>
    // 通过全局变量 WebVersionChecker 使用
    WebVersionChecker.createUpdateNotifier({
      pollingInterval: 60000,  // 每分钟检测
      debug: true
    });
  </script>
</body>
</html>
```

#### 方式 2：使用 ES Module（现代浏览器）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>版本更新检测</title>
</head>
<body>
  <h1>我的应用</h1>
  
  <script type="module">
    import { createUpdateNotifier } from 'https://unpkg.com/web-version-checker/dist/index.esm.js';
    
    // 自动轮询模式
    createUpdateNotifier({
      pollingInterval: 60000
    });
  </script>
</body>
</html>
```

#### 方式 3：手动模式示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>版本更新检测 - 手动模式</title>
</head>
<body>
  <h1>我的应用</h1>
  <button id="checkBtn">检查更新</button>
  
  <script src="https://unpkg.com/web-version-checker/dist/index.umd.js"></script>
  <script>
    // 手动模式
    const notifier = WebVersionChecker.createUpdateNotifier({
      pollingInterval: null,  // 禁用自动轮询
      debug: true
    });
    
    // 点击按钮时检测
    document.getElementById('checkBtn').addEventListener('click', async () => {
      const hasUpdate = await notifier.checkUpdate();
      if (!hasUpdate) {
        alert('当前已是最新版本');
      }
    });
    
    // 或者自己编写定时器，每 2 分钟检测一次
    setInterval(async () => {
      await notifier.checkUpdate();
    }, 2 * 60 * 1000);
  </script>
</body>
</html>
```

---

### Vue 3 + JavaScript

#### main.js

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier } from 'web-version-checker';

const app = createApp(App);
app.mount('#app');

// 仅在生产环境启用
if (import.meta.env.PROD) {
  // 自动轮询模式
  createUpdateNotifier({
    pollingInterval: 60000,  // 每分钟检测一次
    onDetected: () => {
      console.log('检测到新版本！');
    }
  });
}
```

#### 使用 Element Plus 自定义提示

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { createUpdateNotifier } from 'web-version-checker';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');

if (import.meta.env.PROD) {
  createUpdateNotifier({
    pollingInterval: 60000,
    notifyType: 'custom',
    onUpdate: async () => {
      try {
        await ElMessageBox.confirm(
          '发现新版本，是否立即更新？',
          '版本更新',
          {
            confirmButtonText: '立即更新',
            cancelButtonText: '稍后再说',
            type: 'info'
          }
        );
        return true;
      } catch {
        return false;
      }
    }
  });
}
```

#### 手动模式示例

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier } from 'web-version-checker';

const app = createApp(App);
app.mount('#app');

if (import.meta.env.PROD) {
  // 手动模式
  const notifier = createUpdateNotifier({
    pollingInterval: null  // 禁用自动轮询
  });
  
  // 自己控制检测时机，每 2 分钟检测一次
  setInterval(async () => {
    await notifier.checkUpdate();
  }, 2 * 60 * 1000);
  
  // 也可以在全局暴露，在组件中手动调用
  app.config.globalProperties.$checkUpdate = () => notifier.checkUpdate();
}
```

---

### Vue 3 + TypeScript

#### main.ts

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier } from 'web-version-checker';
import type { UpdateNotifierOptions } from 'web-version-checker';

const app = createApp(App);
app.mount('#app');

if (import.meta.env.PROD) {
  // 自动轮询模式，带类型提示
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    notifyType: 'confirm',
    debug: false,
    onDetected: () => {
      console.log('检测到新版本！');
    }
  };
  
  createUpdateNotifier(options);
}
```

#### 使用 Element Plus + TypeScript

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { createUpdateNotifier } from 'web-version-checker';
import type { UpdateNotifierOptions } from 'web-version-checker';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');

if (import.meta.env.PROD) {
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    notifyType: 'custom',
    onUpdate: async (): Promise<boolean> => {
      try {
        await ElMessageBox.confirm(
          '发现新版本，是否立即更新？',
          '版本更新',
          {
            confirmButtonText: '立即更新',
            cancelButtonText: '稍后再说',
            type: 'info'
          }
        );
        return true;
      } catch {
        return false;
      }
    },
    onDetected: (): void => {
      console.log('检测到新版本！');
    }
  };
  
  createUpdateNotifier(options);
}
```

#### 手动模式 + TypeScript

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier } from 'web-version-checker';
import type { WebVersionChecker } from 'web-version-checker';

const app = createApp(App);
app.mount('#app');

if (import.meta.env.PROD) {
  // 手动模式，带类型
  const notifier: WebVersionChecker = createUpdateNotifier({
    pollingInterval: null
  });
  
  // 每 3 分钟检测一次
  setInterval(async (): Promise<void> => {
    await notifier.checkUpdate();
  }, 3 * 60 * 1000);
}
```

---

### React + JavaScript

#### index.jsx

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier } from 'web-version-checker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 仅在生产环境启用
if (process.env.NODE_ENV === 'production') {
  // 自动轮询模式
  createUpdateNotifier({
    pollingInterval: 60000,  // 每分钟检测
    onDetected: () => {
      console.log('检测到新版本！');
    }
  });
}
```

#### 使用 Ant Design 自定义提示

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Modal } from 'antd';
import App from './App';
import { createUpdateNotifier } from 'web-version-checker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  createUpdateNotifier({
    pollingInterval: 60000,
    notifyType: 'custom',
    onUpdate: () => {
      return new Promise((resolve) => {
        Modal.confirm({
          title: '版本更新',
          content: '发现新版本，是否立即更新？',
          okText: '立即更新',
          cancelText: '稍后再说',
          onOk: () => resolve(true),
          onCancel: () => resolve(false)
        });
      });
    }
  });
}
```

#### 手动模式示例

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier } from 'web-version-checker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  // 手动模式
  const notifier = createUpdateNotifier({
    pollingInterval: null
  });
  
  // 每 2 分钟检测一次
  setInterval(async () => {
    await notifier.checkUpdate();
  }, 2 * 60 * 1000);
  
  // 暴露到 window，方便在组件中调用
  window.checkUpdate = () => notifier.checkUpdate();
}
```

---

### React + TypeScript

#### index.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier } from 'web-version-checker';
import type { UpdateNotifierOptions } from 'web-version-checker';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  // 自动轮询模式，带类型
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    debug: false,
    onDetected: (): void => {
      console.log('检测到新版本！');
    }
  };
  
  createUpdateNotifier(options);
}
```

#### 使用 Ant Design + TypeScript

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Modal } from 'antd';
import App from './App';
import { createUpdateNotifier } from 'web-version-checker';
import type { UpdateNotifierOptions } from 'web-version-checker';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    notifyType: 'custom',
    onUpdate: async (): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: '版本更新',
          content: '发现新版本，是否立即更新？',
          okText: '立即更新',
          cancelText: '稍后再说',
          onOk: (): void => resolve(true),
          onCancel: (): void => resolve(false)
        });
      });
    },
    onDetected: (): void => {
      console.log('检测到新版本！');
    }
  };
  
  createUpdateNotifier(options);
}
```

#### 手动模式 + TypeScript

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier } from 'web-version-checker';
import type { WebVersionChecker } from 'web-version-checker';

// 扩展 Window 类型
declare global {
  interface Window {
    checkUpdate: () => Promise<boolean>;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  // 手动模式，带完整类型
  const notifier: WebVersionChecker = createUpdateNotifier({
    pollingInterval: null
  });
  
  // 每 3 分钟检测一次
  setInterval(async (): Promise<void> => {
    await notifier.checkUpdate();
  }, 3 * 60 * 1000);
  
  // 暴露到 window
  window.checkUpdate = (): Promise<boolean> => notifier.checkUpdate();
}
```

---

## ⚙️ 配置选项

```typescript
interface UpdateNotifierOptions {
  /** 
   * 轮询间隔时间，单位毫秒，默认 10000ms (10秒)
   * 设置为 null 或 0 则禁用自动轮询（需手动调用 checkUpdate）
   */
  pollingInterval?: number | null;
  
  /** 提示用户更新的方式，默认 'confirm' */
  notifyType?: 'confirm' | 'custom';
  
  /** 自定义提示函数，返回 true 表示确认刷新 */
  onUpdate?: () => boolean | Promise<boolean>;
  
  /** 检测到更新时的回调 */
  onDetected?: () => void;
  
  /** 是否在页面隐藏时暂停检测，默认 true（仅在自动轮询模式下有效） */
  pauseOnHidden?: boolean;
  
  /** 是否立即开始检测，默认 true（仅在自动轮询模式下有效） */
  immediate?: boolean;
  
  /** 自定义请求路径，默认 '/' */
  indexPath?: string;
  
  /** script 标签正则匹配，用于自定义匹配规则 */
  scriptRegex?: RegExp;
  
  /** 是否在控制台输出日志，默认 false */
  debug?: boolean;
}
```

## 📖 高级用法

### 自定义更新提示 UI

使用自定义提示替代默认的 `confirm` 对话框：

```javascript
import { createUpdateNotifier } from 'web-version-checker';

createUpdateNotifier({
  notifyType: 'custom',
  onUpdate: () => {
    // 使用你喜欢的 UI 库，如 Element Plus
    return ElMessageBox.confirm(
      '发现新版本，是否立即更新？',
      '版本更新',
      {
        confirmButtonText: '立即更新',
        cancelButtonText: '稍后再说',
        type: 'info'
      }
    ).then(() => true)
      .catch(() => false);
  },
  onDetected: () => {
    console.log('🎉 检测到新版本！');
  }
});
```

### 手动控制检测

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// 方式 1：自动轮询模式 - 可以手动控制
const notifier = createUpdateNotifier({
  immediate: false  // 不立即开始
});

notifier.start();  // 手动开始
notifier.stop();   // 暂停检测

// checkNow: 仅检测，不显示提示
const hasUpdate = await notifier.checkNow();
if (hasUpdate) {
  console.log('有新版本');
}

notifier.reset();  // 重置状态

// 方式 2：完全手动模式 - 自己控制定时器
const manualNotifier = createUpdateNotifier({
  pollingInterval: null  // 禁用自动轮询
});

// 自己编写定时器
setInterval(async () => {
  await manualNotifier.checkUpdate();  // 检测并提示用户
}, 60000);

// 或者在事件触发时检测
button.onclick = async () => {
  const hasUpdate = await manualNotifier.checkUpdate();
  if (!hasUpdate) alert('当前已是最新版本');
};
```

### 在特定条件下启用

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// 仅在生产环境启用
if (process.env.NODE_ENV === 'production') {
  createUpdateNotifier({
    pollingInterval: 60000, // 生产环境降低检测频率
    pauseOnHidden: true // 页面隐藏时暂停
  });
}
```

### 自定义检测规则

```javascript
import { createUpdateNotifier } from 'web-version-checker';

createUpdateNotifier({
  // 自定义 script 匹配规则
  scriptRegex: /\<script.*src=["'](?<src>[^"']+\.js)/gm,
  
  // 自定义请求路径
  indexPath: '/index.html'
});
```

## 🔍 工作原理

1. **版本标识**: 每次打包后，`index.html` 中的 script 文件名都会变化（通常包含哈希值）
2. **轮询检测**: 定时获取最新的 `index.html` 内容
3. **对比分析**: 提取并对比 script 文件列表
4. **更新提示**: 发现变化时提示用户刷新页面

## 📝 API

### createUpdateNotifier(options?)

创建并返回一个版本更新检测器实例。

**参数:**
- `options` - 可选的配置对象

**返回:**
- `WebVersionChecker` 实例

### WebVersionChecker 实例方法

#### start()

开始版本检测（仅在自动轮询模式下有效）。

```javascript
const notifier = createUpdateNotifier({ immediate: false });
notifier.start();
```

#### stop()

停止版本检测（仅在自动轮询模式下有效）。

```javascript
notifier.stop();
```

#### checkNow()

手动触发一次检测，**仅返回是否有更新，不显示提示**。

**返回:** `Promise<boolean>` - `true` 表示有更新，`false` 表示无更新

```javascript
const hasUpdate = await notifier.checkNow();
if (hasUpdate) {
  console.log('检测到新版本');
  // 自己处理，比如显示自定义通知
}
```

#### checkUpdate()

手动检测并提示用户更新。适用于**完全手动模式**，会显示更新提示并根据用户选择刷新页面。

**返回:** `Promise<boolean>` - `true` 表示有更新，`false` 表示无更新

```javascript
// 完全手动模式
const notifier = createUpdateNotifier({ pollingInterval: null });

// 自己编写定时器
setInterval(async () => {
  await notifier.checkUpdate();  // 检测并提示用户
}, 60000);

// 或者在按钮点击时检测
button.onclick = async () => {
  const hasUpdate = await notifier.checkUpdate();
  if (!hasUpdate) {
    alert('当前已是最新版本');
  }
};
```

#### reset()

重置检测状态并停止检测。

```javascript
notifier.reset();
```

---

**方法对比：**

| 方法 | 是否显示提示 | 适用场景 |
|------|------------|----------|
| `checkNow()` | ✖️ 不显示 | 静默检测，自己处理更新逻辑 |
| `checkUpdate()` | ✔️ 显示 | 手动模式，自动提示用户更新 |

## 🎯 使用场景

- ✅ 单页应用（SPA）的版本更新提示
- ✅ 需要及时推送更新的 Web 应用
- ✅ 不希望用户长时间停留在旧版本
- ✅ 无后端支持的纯静态网站

## ⚠️ 注意事项

1. **生产环境使用**: 建议仅在生产环境启用，开发环境可能会频繁触发更新提示
2. **轮询间隔**: 根据实际需求设置合理的轮询间隔，避免过于频繁的请求
3. **缓存问题**: 请求 `index.html` 时已添加时间戳参数避免缓存
4. **构建工具**: 确保你的构建工具（如 Webpack、Vite）会为 script 文件生成哈希值

## 🔧 浏览器兼容性

支持所有现代浏览器，需要以下 API 支持：

- `fetch`
- `Promise`
- `setTimeout`
- `document.visibilitychange` (可选)

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 反馈

如果你有任何问题或建议，欢迎提交 [Issue](https://github.com/yourusername/web-version-checker/issues)。
