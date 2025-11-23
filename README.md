# version-update-check

[![npm version](https://img.shields.io/npm/v/%40wangkai000%2Fversion-update-check.svg)](https://www.npmjs.com/package/@wangkai000/version-update-check)
[![license](https://img.shields.io/npm/l/%40wangkai000%2Fversion-update-check.svg)](https://github.com/wangkai000/version-update-check/blob/main/LICENSE)

一个纯前端实现的版本更新自动检测与提示刷新插件，无需后端配合。

简体中文 | [English](./README.en.md)

## ✨ 特性
- 纯前端实现，无需后端
- 自动或手动检测两种模式
- 可自定义提示UI（confirm或自定义弹窗）
- 页面隐藏时智能暂停（可配置）
- 支持 ESM / CJS / UMD，多框架适配

## 📦 安装
```bash
npm install @wangkai000/version-update-check
# 或
yarn add @wangkai000/version-update-check
# 或
pnpm add @wangkai000/version-update-check
```

## 🚀 使用示例（三种常见场景）

### 1) 原生 HTML + JS（UMD）
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

### 2) Vue + TypeScript（main.ts）
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

### 3) React + TypeScript（index.tsx）
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>

if (process.env.NODE_ENV === 'production') {
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    debug: false
  };
  createUpdateNotifier(options);
}

## ⚙️ 参数说明（UpdateNotifierOptions）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| pollingInterval | number \| null | 10000 | 轮询间隔（毫秒）。设为 null 或 0 禁用自动轮询，需手动调用 `checkUpdate`。 |
| notifyType | 'confirm' \| 'custom' | 'confirm' | 提示方式。'confirm' 使用浏览器确认框；'custom' 需提供 `onUpdate`。 |
| onUpdate | () => boolean \| Promise<boolean> | - | 自定义提示函数；返回 true 表示确认刷新，false 表示取消。与 `notifyType='custom'` 配合使用。 |
| onDetected | () => void | - | 检测到更新时触发的回调（不影响刷新流程）。 |
| pauseOnHidden | boolean | true | 页面隐藏时是否暂停检测（仅自动轮询模式有效）。 |
| immediate | boolean | true | 是否立即开始检测（仅自动轮询模式有效）。 |
| indexPath | string | '/' | 拉取页面内容的路径。 |
| scriptRegex | RegExp | /\<script.*src=["'](?<src>[^"']+)/gm | 提取 script 的正则。 |
| debug | boolean | false | 是否打印调试日志。 |
| promptMessage | string | '检测到新版本，点击确定将刷新页面并更新' | confirm 模式的提示文案。 |


## 🧩 API

| 名称 | 签名 | 说明 | 备注 |
| --- | --- | --- | --- |
| createUpdateNotifier | (options?: UpdateNotifierOptions) => WebVersionChecker | 创建并返回检测器实例 | - |
| start | () => void | 开始检测 | 仅自动轮询模式有效 |
| stop | () => void | 停止检测 | 仅自动轮询模式有效 |
| checkNow | () => Promise<boolean> | 静默检测，仅返回是否有更新，不弹窗 | - |
| checkUpdate | () => Promise<boolean> | 手动检测并弹窗提示用户，用户确认后刷新 | 适用于手动模式 |
| reset | () => void | 重置状态并停止检测 | - |


## 🔍 工作原理（简述）
1) 每次构建后，index.html 中的 script 文件名会变化（通常带 hash）。
2) 插件定期拉取最新的 index.html，提取其中的 script 列表。
3) 与上一次记录对比，若不同则判定为版本更新，并提示刷新。
