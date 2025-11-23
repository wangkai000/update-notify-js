# version-update-check

[![npm version](https://img.shields.io/npm/v/%40wangkai000%2Fversion-update-check.svg)](https://www.npmjs.com/package/@wangkai000/version-update-check)
[![license](https://img.shields.io/npm/l/%40wangkai000%2Fversion-update-check.svg)](https://github.com/wangkai000/version-update-check/blob/main/LICENSE)

A pure front-end solution for automatic version update detection and refresh notification.

[简体中文](./README.md) | English

## Features
- Front-end only, no backend needed
- Auto or manual detection modes
- Customizable UI (confirm or custom dialog)
- Smart pause when page hidden
- Supports ESM / CJS / UMD

## Install
```bash
npm install @wangkai000/version-update-check
# or
yarn add @wangkai000/version-update-check
# or
pnpm add @wangkai000/version-update-check
```

## Usage (3 common cases)

### 1) Native HTML + JS (UMD)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Version Check Demo</title>
</head>
<body>
  <script src="https://unpkg.com/@wangkai000/version-update-check/dist/index.umd.js"></script>
  <script>
    // Auto polling: check every minute, with logging and callbacks
    WebVersionChecker.createUpdateNotifier({
      pollingInterval: 60000,
      debug: true,
      onDetected: () => {
        console.log('[version-update-check] New version detected');
      },
      // Custom prompt: confirm then manually refresh (demo of location.reload)
      notifyType: 'custom',
      onUpdate: () => {
        console.log('[version-update-check] Ready to refresh page for update');
        const ok = confirm('New version detected. Refresh page now to update?');
        if (ok) {
          // Manually refresh the page
          location.reload();
          // Return false to avoid plugin reloading again (we already refreshed)
          return false;
        }
        return false;
      }
    });
  </script>
</body>
</html>
```

### 2) Vue + TypeScript (main.ts)
```ts
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

createApp(App).mount('#app');

if (import.meta.env.PROD) {
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    notifyType: 'custom',
    onUpdate: async () => confirm('New version found, refresh now?'),
    onDetected: () => console.log('New version detected')
  };
  createUpdateNotifier(options);
}
```

### 3) React + TypeScript (index.tsx)
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
  const options: UpdateNotifierOptions = { pollingInterval: 60000 };
  createUpdateNotifier(options);
}
```

## Options (UpdateNotifierOptions)

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| pollingInterval | number \| null | 10000 | Polling interval in ms. Set null or 0 to disable auto polling and use manual `checkUpdate`. |
| notifyType | 'confirm' \| 'custom' | 'confirm' | Notification type. 'confirm' uses browser confirm; 'custom' requires `onUpdate`. |
| onUpdate | () => boolean \| Promise<boolean> | - | Custom prompt function; return true to refresh, false to cancel. Used with `notifyType='custom'`. |
| onDetected | () => void | - | Callback when an update is detected (does not affect refresh flow). |
| pauseOnHidden | boolean | true | Pause detection when page is hidden (auto mode only). |
| immediate | boolean | true | Start detection immediately (auto mode only). |
| indexPath | string | '/' | Path to fetch page HTML. |
| scriptRegex | RegExp | /\<script.*src=["'](?<src>[^"']+)/gm | Regex to extract script src list. |
| debug | boolean | false | Print debug logs. |

## API

| Name | Signature | Description | Notes |
| --- | --- | --- | --- |
| createUpdateNotifier | (options?: UpdateNotifierOptions) => WebVersionChecker | Create and return a detector instance | - |
| start | () => void | Start detection | Auto mode only |
| stop | () => void | Stop detection | Auto mode only |
| checkNow | () => Promise<boolean> | Silent detection, returns whether update exists | - |
| checkUpdate | () => Promise<boolean> | Manual detection and prompt, reload on confirm | Use in manual mode |
| reset | () => void | Reset and stop detection | - |

## How it works
1) Build changes script filenames in index.html (with hash)
2) Fetch latest index.html and extract script list
3) Compare lists; if changed, prompt to refresh
