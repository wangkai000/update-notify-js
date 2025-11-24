// 自动轮询模式示例
import { createUpdateNotifier } from 'update-notify-js';

// ==================== 方式 1: 每分钟自动检测（最简单） ====================
const notifier1 = createUpdateNotifier({
  pollingInterval: 60000  // 每分钟检测一次
});


// ==================== 方式 2: 每 30 秒自动检测 ====================
const notifier2 = createUpdateNotifier({
  pollingInterval: 30000,  // 每 30 秒
  debug: true  // 开启日志查看检测过程
});


// ==================== 方式 3: 每 5 分钟检测，带自定义提示 ====================
const notifier3 = createUpdateNotifier({
  pollingInterval: 5 * 60 * 1000,  // 5 分钟
  notifyType: 'custom',
  onUpdate: async () => {
    // 使用 Element Plus 对话框
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
  onDetected: () => {
    console.log('检测到新版本！');
  }
});


// ==================== 方式 4: 延迟启动的自动检测 ====================
const notifier4 = createUpdateNotifier({
  pollingInterval: 60000,
  immediate: false  // 不立即开始
});

// 5 秒后开始检测
setTimeout(() => {
  notifier4.start();
  console.log('延迟启动的自动检测已开始');
}, 5000);


// ==================== 方式 5: 使用 excludeScripts 排除特定脚本 ====================
const notifier5 = createUpdateNotifier({
  pollingInterval: 60000,
  debug: true,
  // 排除第三方库、CDN资源和分析脚本，只关注应用核心脚本
  excludeScripts: [
    'https://cdn.jsdelivr.net/npm/react/*',
    'https://cdn.jsdelivr.net/npm/react-dom/*',
    'https://cdn.jsdelivr.net/npm/axios/*',
    'https://analytics.example.com/*.js',
    '/assets/vendor/*.js',
    '/sw.js'  // 排除 Service Worker 脚本
  ],
  onDetected: () => {
    console.log('检测到应用核心脚本有更新！');
  }
});


// ==================== 方式 6: 使用正则表达式排除脚本 ====================
const notifier6 = createUpdateNotifier({
  pollingInterval: 60000,
  debug: true,
  // 使用正则表达式排除常见的第三方库和CDN资源
  excludeScripts: /(https?:\/\/(cdn|unpkg|jsdelivr)\.com\/|\/assets\/(vendor|libs)\/|\.hot-update\.js|\.map)$/,
  onDetected: () => {
    console.log('检测到应用脚本有更新（已排除第三方库）！');
  }
});

// 在某些情况下停止检测
function pauseUpdateCheck() {
  notifier5.stop();
  console.log('已暂停版本检测');
}

// 恢复检测
function resumeUpdateCheck() {
  notifier5.start();
  console.log('已恢复版本检测');
}

// 用户开始重要操作时暂停
document.getElementById('importantForm')?.addEventListener('focus', pauseUpdateCheck);

// 用户完成操作后恢复
document.getElementById('importantForm')?.addEventListener('blur', resumeUpdateCheck);


// ==================== 方式 6: 生产环境专用配置 ====================
if (import.meta.env.PROD) {
  createUpdateNotifier({
    pollingInterval: 2 * 60 * 1000,  // 生产环境每 2 分钟检测
    pauseOnHidden: true,  // 页面隐藏时暂停
    onDetected: () => {
      // 发送统计
      console.log('检测到新版本，发送统计数据');
    }
  });
}


// ==================== 方式 7: Vue 项目中使用 ====================
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier } from 'update-notify-js';

createApp(App).mount('#app');

if (import.meta.env.PROD) {
  createUpdateNotifier({
    pollingInterval: 60000,  // 每分钟
    notifyType: 'custom',
    onUpdate: async () => {
      const { ElMessageBox } = await import('element-plus');
      try {
        await ElMessageBox.confirm(
          '发现新版本，是否立即更新？',
          '版本更新提示',
          {
            confirmButtonText: '立即更新',
            cancelButtonText: '稍后',
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


// ==================== 方式 8: React 项目中使用 ====================
// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier } from 'update-notify-js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  createUpdateNotifier({
    pollingInterval: 60000  // 每分钟
  });
}


// ==================== 方式 9: 根据网络状态调整检测频率 ====================
let currentPollingInterval = 60000;  // 默认 1 分钟
const adaptiveNotifier = createUpdateNotifier({
  pollingInterval: currentPollingInterval,
  immediate: false
});

// 监听网络状态
window.addEventListener('online', () => {
  console.log('网络恢复，恢复检测');
  adaptiveNotifier.start();
});

window.addEventListener('offline', () => {
  console.log('网络断开，暂停检测');
  adaptiveNotifier.stop();
});

// 根据网络速度调整检测频率
if (navigator.connection) {
  const connection = navigator.connection;
  const effectiveType = connection.effectiveType;
  
  if (effectiveType === '4g') {
    currentPollingInterval = 30000;  // 4G 网络，30 秒检测一次
  } else if (effectiveType === '3g') {
    currentPollingInterval = 2 * 60000;  // 3G 网络，2 分钟检测一次
  } else {
    currentPollingInterval = 5 * 60000;  // 慢速网络，5 分钟检测一次
  }
}

adaptiveNotifier.start();
