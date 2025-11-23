# web-version-checker

[![npm version](https://img.shields.io/npm/v/web-version-checker.svg)](https://www.npmjs.com/package/web-version-checker)
[![license](https://img.shields.io/npm/l/web-version-checker.svg)](https://github.com/yourusername/web-version-checker/blob/main/LICENSE)

A pure front-end solution for automatic version update detection and refresh notification, no backend required.

English | [简体中文](./README.zh-CN.md)

## ✨ Features

- 🚀 **Pure Front-end** - No backend required, detects script changes in HTML through polling
- 📦 **Out of the Box** - Simple configuration and ready to use
- 🎯 **TypeScript Support** - Complete type definitions
- ⚙️ **Highly Configurable** - Supports custom polling intervals, notification methods, etc.
- 🎨 **Custom UI** - Supports custom update notification UI
- 🔄 **Smart Pause** - Automatically pauses detection when page is hidden to save resources
- 📱 **Multiple Import Methods** - Supports ESM, CJS, UMD module formats

## 📦 Installation

```bash
npm install web-version-checker
```

Or using yarn:

```bash
yarn add web-version-checker
```

Or using pnpm:

```bash
pnpm add web-version-checker
```

## 🚀 Quick Start

### Basic Usage

Import in your project entry file (e.g., `main.js` or `main.ts`):

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// Create detector instance and start automatically
const notifier = createUpdateNotifier();
```

That's it! The plugin will automatically check for version updates every 10 seconds, and prompt users whether to refresh when an update is detected.

### Two Usage Modes

#### Mode 1: Auto Polling Mode (Recommended)

Plugin automatically detects at regular intervals without manual intervention:

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// Auto check every minute
createUpdateNotifier({
  pollingInterval: 60000  // 60000ms = 1 minute
});
```

#### Mode 2: Manual Mode

Disable auto polling and control detection timing with your own timer:

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// Set pollingInterval to null or 0 to disable auto polling
const notifier = createUpdateNotifier({
  pollingInterval: null  // or 0
});

// Write your own timer, check every minute
setInterval(async () => {
  await notifier.checkUpdate();  // Check and prompt user
}, 60000);

// Or trigger check on specific events
button.addEventListener('click', async () => {
  const hasUpdate = await notifier.checkUpdate();
  if (!hasUpdate) {
    alert('Already on the latest version');
  }
});
```

> **Why Manual Mode?**
> 
> Manual mode gives you complete control over detection timing, suitable for:
> - Complex detection logic (e.g., check only during specific time periods)
> - Dynamically adjust detection frequency based on user activity
> - Deep integration with other business logic

---

## 📚 For Detailed Documentation

For complete usage guide with framework examples (Vue, React, HTML), please refer to:
- **Chinese**: [README.zh-CN.md](./README.zh-CN.md) - 完整中文文档，包含所有框架示例

---

## ⚙️ Configuration Options

```typescript
interface UpdateNotifierOptions {
  /** 
   * Polling interval in milliseconds, default 10000ms (10 seconds)
   * Set to null or 0 to disable auto polling (requires manual checkUpdate call)
   */
  pollingInterval?: number | null;
  
  /** Notification type, default 'confirm' */
  notifyType?: 'confirm' | 'custom';
  
  /** Custom notification function, return true to confirm refresh */
  onUpdate?: () => boolean | Promise<boolean>;
  
  /** Callback when update detected */
  onDetected?: () => void;
  
  /** Pause detection when page hidden, default true (only effective in auto polling mode) */
  pauseOnHidden?: boolean;
  
  /** Start detection immediately, default true (only effective in auto polling mode) */
  immediate?: boolean;
  
  /** Custom request path, default '/' */
  indexPath?: string;
  
  /** RegExp for matching script tags */
  scriptRegex?: RegExp;
  
  /** Output logs to console, default false */
  debug?: boolean;
}
```

## 📖 Advanced Usage

### Custom Update Notification UI

Use custom notification to replace default `confirm` 对话框：

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
    console.log('🎉 New version detected！');
  }
});
```

### Manual Control

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// 方式 1：自动轮询模式 - 可以手动控制
const notifier = createUpdateNotifier({
  immediate: false  // 不立即开始
});

notifier.start();  // 手动开始
notifier.stop();   // 暂停检测

// checkNow: 仅检测，No提示
const hasUpdate = await notifier.checkNow();
if (hasUpdate) {
  console.log('有新版本');
}

notifier.reset();  // 重置状态

// 方式 2：full manual mode - 自己控制定时器
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

### Enable Under Specific Conditions

```javascript
import { createUpdateNotifier } from 'web-version-checker';

// Enable only in production
if (process.env.NODE_ENV === 'production') {
  createUpdateNotifier({
    pollingInterval: 60000, // Lower detection frequency in production
    pauseOnHidden: true // Pause when page hidden
  });
}
```

### Custom Detection Rules

```javascript
import { createUpdateNotifier } from 'web-version-checker';

createUpdateNotifier({
  // Custom script matching rule
  scriptRegex: /\<script.*src=["'](?<src>[^"']+\.js)/gm,
  
  // Custom request path
  indexPath: '/index.html'
});
```

## 🔍 How It Works

1. **Version Identification**: 每次打包后，`index.html` 中的 script 文件名都会变化（通常包含哈希值）
2. **Polling Detection**: 定时获取最新的 `index.html` 内容
3. **Comparison Analysis**: 提取并对比 script 文件列表
4. **Update Notification**: 发现变化时提示用户刷新页面

## 📝 API

### createUpdateNotifier(options?)

Create and return a version update detector instance。

**Parameters:**
- `options` - Optional configuration object

**Returns:**
- `WebVersionChecker` 实例

### WebVersionChecker Instance Methods

#### start()

Start version detection（Only effective in auto polling mode）。

```javascript
const notifier = createUpdateNotifier({ immediate: false });
notifier.start();
```

#### stop()

Stop version detection（Only effective in auto polling mode）。

```javascript
notifier.stop();
```

#### checkNow()

Manually trigger a detection，**仅Returns是否有更新，No提示**。

**Returns:** `Promise<boolean>` - `true` indicates update available，`false` indicates no update

```javascript
const hasUpdate = await notifier.checkNow();
if (hasUpdate) {
  console.log('New version detected');
  // Handle it yourself, e.g. show custom notification
}
```

#### checkUpdate()

Manually check and prompt user to update。Suitable for**full manual mode**，会YesUpdate Notification并根据用户选择刷新页面。

**Returns:** `Promise<boolean>` - `true` indicates update available，`false` indicates no update

```javascript
// full manual mode
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

Reset detection state and stop detection。

```javascript
notifier.reset();
```

---

**Method Comparison：**

| 方法 | Show Notification | Use Cases |
|------|------------|----------|
| `checkNow()` | ✖️ No | Silent detection, handle update logic yourself |
| `checkUpdate()` | ✔️ Yes | Manual mode, automatically prompt user to update |

## 🎯 Use Cases

- ✅ 单页应用（SPA）的版本Update Notification
- ✅ Web applications that need timely update notifications
- ✅ Don't want users to stay on old versions for long
- ✅ Pure static websites without backend support

## ⚠️ Notes

1. **Production Use**: 建议Enable only in production，开发环境可能会频繁触发Update Notification
2. **轮询间隔**: Set reasonable polling intervals based on actual needs, avoid too frequent requests
3. **Cache Issues**: Request `index.html` 时已添加时间戳Parameters避免缓存
4. **Build Tools**: 确保你的Build Tools（如 Webpack、Vite）会为 script 文件生成哈希值

## 🔧 Browser Compatibility

Supports all modern browsers, requires the following API support：

- `fetch`
- `Promise`
- `setTimeout`
- `document.visibilitychange` (optional)

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📮 Feedback

If you have any questions or suggestions, feel free to submit [Issue](https://github.com/yourusername/web-version-checker/issues)。
