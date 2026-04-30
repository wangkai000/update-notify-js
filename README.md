# update-notify-js

**简体中文** | [English](./README.en.md)

## 📦 项目简介

一个轻量级的纯前端实现的版本更新自动检测和提示刷新插件。它能够自动监测应用的新版本发布，并通过友好的方式通知用户进行更新，确保用户始终使用最新版本的应用。

## ✨ 核心特性

- 🎯 **自动检测更新**：定期轮询检测应用是否有新版本发布
- 🔄 **手动/自动模式**：支持自动轮询和手动触发两种工作模式
- 🎨 **多种通知方式**：支持系统原生confirm对话框或自定义通知UI
- 📱 **页面可见性感知**：可配置在页面隐藏时暂停检测，节省资源
- ⚡ **轻量高效**：核心代码简洁，无第三方依赖
- 🔧 **高度可配置**：提供丰富的配置选项以满足不同需求
- 🌐 **多框架支持**：支持原生JavaScript、React、Vue等多种框架

## 📥 安装

```bash
# 使用 npm
npm install update-notify-js

# 使用 yarn
yarn add update-notify-js

# 使用 pnpm
pnpm add update-notify-js
```

## 🚀 快速开始

### 1) 原生 HTML + JS（UMD）

#### 自动轮询模式
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>版本更新检测示例</title>
</head>
<body>
  <script src="https://unpkg.com/update-notify-js/dist/index.umd.js"></script>
  <script>
    // 默认自动轮询：每分钟检测一次，并打印日志与回调
    WebVersionChecker.createUpdateNotifier({
      pollingInterval: 60000,
      debug: true,
      onDetected: () => {
        console.log('[update-notify-js] 检测到新版本');
      },
      // 使用自定义提示：确认后手动刷新（演示 location.reload）
      notifyType: 'custom',
      onUpdate: () => {
        console.log('[update-notify-js] 准备刷新页面以更新版本');
        const ok = confirm('检测到新版本，是否立即刷新页面以更新？');
        if (ok) {
          // 手动刷新页面
          location.reload();
          // 返回 false，避免插件再次调用刷新（因为我们已手动刷新）
          return false;
        }
        return false;
      }
    });
  </script>
</body>
</html>
```

#### 手动启动暂停模式
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>版本更新检测示例</title>
</head>
<body>
  <script src="https://unpkg.com/update-notify-js/dist/index.umd.js"></script>
  <script>
    // 手动模式：禁用自动轮询，自己控制检测时机
    const notifier = WebVersionChecker.createUpdateNotifier({
      pollingInterval: null, // 禁用自动轮询
      debug: true,
      onDetected: () => {
        console.log('[update-notify-js] 检测到新版本');
      }
    });
    
    // 手动启动检测（例如点击按钮时）
    document.getElementById('checkUpdateBtn').addEventListener('click', async () => {
      const hasUpdate = await notifier.checkUpdate();
      console.log('检测完成，是否有更新:', hasUpdate);
    });
    
    // 也可以使用 checkNow 静默检测
    document.getElementById('checkSilentBtn').addEventListener('click', async () => {
      const hasUpdate = await notifier.checkNow();
      console.log('静默检测完成，是否有更新:', hasUpdate);
      if (hasUpdate) {
        // 自定义提示逻辑
        if (confirm('发现新版本，是否刷新页面？')) {
          location.reload();
        }
      }
    });
  </script>
  
  <button id="checkUpdateBtn">检查更新并提示</button>
  <button id="checkSilentBtn">静默检查更新</button>
</body>
</html>
```

### 2) Vue + TypeScript（main.ts）

#### 自动轮询模式
```ts
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier, type UpdateNotifierOptions } from 'update-notify-js';

createApp(App).mount('#app');

// 仅生产环境启用
if (import.meta.env.PROD) {
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    notifyType: 'confirm',
    promptMessage: '发现新版本，是否立即刷新？',
    onDetected: () => {
      console.log('检测到新版本');
    }
  };
  createUpdateNotifier(options);
}
```

#### 手动启动暂停模式
```ts
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier, type UpdateNotifierOptions } from 'update-notify-js';

const app = createApp(App);
app.mount('#app');

// 仅生产环境启用
if (import.meta.env.PROD) {
  // 手动模式：禁用自动轮询
  const options: UpdateNotifierOptions = {
    pollingInterval: null, // 禁用自动轮询
    notifyType: 'confirm',
    promptMessage: '发现新版本，是否立即刷新？',
    onDetected: () => {
      console.log('检测到新版本');
    }
  };
  
  const notifier = createUpdateNotifier(options);
  
  // 在需要时手动检测更新
  window.checkForUpdate = async () => {
    const hasUpdate = await notifier.checkUpdate();
    console.log('检测完成，是否有更新:', hasUpdate);
  };
  
  // 静默检测
  window.checkSilently = async () => {
    const hasUpdate = await notifier.checkNow();
    console.log('静默检测完成，是否有更新:', hasUpdate);
  };
}
```

### 3) React + TypeScript（index.tsx）

#### 自动轮询模式
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier, type UpdateNotifierOptions } from 'update-notify-js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    notifyType: 'confirm',
    promptMessage: '发现新版本，是否立即刷新？',
    debug: false
  };
  createUpdateNotifier(options);
}
```

#### 手动启动暂停模式
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier, type UpdateNotifierOptions } from 'update-notify-js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  // 手动模式：禁用自动轮询
  const options: UpdateNotifierOptions = {
    pollingInterval: null, // 禁用自动轮询
    notifyType: 'confirm',
    promptMessage: '发现新版本，是否立即刷新？',
    debug: false
  };
  
  const notifier = createUpdateNotifier(options);
  
  // 暴露到全局供组件调用
  window.versionNotifier = notifier;
}
```

## 📚 API 文档

### UpdateNotifierOptions 配置选项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `pollingInterval` | `number \| null` | `10000` | 轮询间隔时间（毫秒）。设置为 `null` 或 `0` 则禁用自动轮询，进入手动模式 |
| `notifyType` | `'confirm' \| 'custom'` | `'confirm'` | 提示用户更新的方式。`'confirm'` 使用系统原生对话框，`'custom'` 使用自定义函数 |
| `onUpdate` | `() => boolean \| Promise<boolean>` | `undefined` | 自定义更新提示函数（当 `notifyType='custom'` 时使用），返回 `true` 表示确认刷新 |
| `onDetected` | `() => void` | `() => {}` | 检测到更新时的回调函数 |
| `pauseOnHidden` | `boolean` | `true` | 是否在页面隐藏时暂停检测（仅在自动轮询模式下有效） |
| `immediate` | `boolean` | `true` | 是否立即开始检测（仅在自动轮询模式下有效） |
| `indexPath` | `string` | `'/'` | 自定义请求路径，默认请求根路径 |
| `scriptRegex` | `RegExp` | `/<script.*src=["'](?<src>[^"']+)/gm` | script 标签正则匹配，用于自定义匹配规则 |
| `debug` | `boolean` | `false` | 是否在控制台输出日志 |
| `promptMessage` | `string` | `'检测到新版本，点击确定将刷新页面并更新'` | 默认 confirm 提示文案（用于 `notifyType='confirm'`） |

### VersionUpdateNotifier 实例方法

| 方法名 | 返回值 | 说明 |
|--------|--------|------|
| `start()` | `void` | 开始版本更新检测（仅在自动轮询模式下有效） |
| `stop()` | `void` | 停止版本更新检测（仅在自动轮询模式下有效） |
| `checkNow()` | `Promise<boolean>` | 手动触发一次静默检测，返回是否有更新，但不显示提示 |
| `checkUpdate()` | `Promise<boolean>` | 手动触发一次检测，如有更新会显示提示，返回是否有更新 |
| `reset()` | `void` | 重置状态，清空历史记录 |

### 工厂函数

```ts
createUpdateNotifier(options?: UpdateNotifierOptions): VersionUpdateNotifier
```

创建并返回一个新的版本更新通知器实例。

## 🔍 工作原理

该插件通过以下方式检测版本更新：

1. **脚本资源对比**：定期请求应用的入口HTML文件，提取其中的script标签src属性
2. **变化检测**：将提取到的资源列表与之前保存的列表进行对比
3. **更新通知**：当发现资源列表发生变化时，认为有新版本发布，通知用户

> **提示**：对于大多数现代前端应用，构建过程会在文件名中注入哈希值。当代码变更时，生成的文件名也会改变，因此可以通过检测script标签src的变化来判断是否有新版本。

## 🛠️ 最佳实践

### 仅在生产环境启用

建议只在生产环境中启用更新检测，以避免开发过程中的干扰：

```ts
// Vue + Vite
if (import.meta.env.PROD) {
  createUpdateNotifier(/* options */);
}

// React + Webpack
if (process.env.NODE_ENV === 'production') {
  createUpdateNotifier(/* options */);
}
```

### 合理设置轮询间隔

轮询间隔不宜过短，建议至少30秒以上，以避免过多的网络请求：

```ts
const options = {
  pollingInterval: 60000, // 1分钟
  // 其他配置...
};
```

### 使用自定义通知UI

对于需要更美观的用户界面，可以使用自定义通知：

```ts
const options = {
  notifyType: 'custom',
  onUpdate: async () => {
    // 显示自定义通知UI
    // 例如：使用Toast、Modal等组件
    return await showCustomNotification(); // 返回用户是否确认更新
  }
};
```

## 🤝 贡献指南

欢迎通过以下方式参与贡献：

1. 提交Issue报告bug或建议新功能
2. Fork仓库并提交Pull Request
3. 完善文档和示例

## 📄 许可证

[MIT](https://github.com/wangkai000/update-notify-js/blob/main/LICENSE)

## 🌐 相关链接

- [GitHub 仓库](https://github.com/wangkai000/update-notify-js)
- [NPM 包](https://www.npmjs.com/package/update-notify-js)

---

**感谢使用 update-notify-js！如有任何问题，欢迎在GitHub上提交Issue。**