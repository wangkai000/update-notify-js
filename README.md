## 🚀 使用示例（三种常见场景）

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
  <script src="https://unpkg.com/@wangkai000/version-update-check/dist/index.umd.js"></script>
  <script>
    // 默认自动轮询：每分钟检测一次，并打印日志与回调
    WebVersionChecker.createUpdateNotifier({
      pollingInterval: 60000,
      debug: true,
      onDetected: () => {
        console.log('[version-update-check] 检测到新版本');
      },
      // 使用自定义提示：确认后手动刷新（演示 location.reload）
      notifyType: 'custom',
      onUpdate: () => {
        console.log('[version-update-check] 准备刷新页面以更新版本');
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
  <script src="https://unpkg.com/@wangkai000/version-update-check/dist/index.umd.js"></script>
  <script>
    // 手动模式：禁用自动轮询，自己控制检测时机
    const notifier = WebVersionChecker.createUpdateNotifier({
      pollingInterval: null, // 禁用自动轮询
      debug: true,
      onDetected: () => {
        console.log('[version-update-check] 检测到新版本');
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
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

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
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

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
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

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
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

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

// 在组件中使用示例
const UpdateChecker: React.FC = () => {
  const handleCheckUpdate = async () => {
    if (window.versionNotifier) {
      const hasUpdate = await window.versionNotifier.checkUpdate();
      console.log('检测完成，是否有更新:', hasUpdate);
    }
  };
  
  const handleCheckSilent = async () => {
    if (window.versionNotifier) {
      const hasUpdate = await window.versionNotifier.checkNow();
      console.log('静默检测完成，是否有更新:', hasUpdate);
    }
  };
  
  return (
    <div>
      <button onClick={handleCheckUpdate}>检查更新并提示</button>
      <button onClick={handleCheckSilent}>静默检查更新</button>
    </div>
  );
};