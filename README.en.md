# update-notify-js

<div align="center">
  <a href="./README.md" style="margin-right: 15px;">简体中文</a> | 
  <a href="./README.en.md" style="font-weight: bold; margin-right: 15px;">English</a>
</div>

## 📦 Project Introduction

A lightweight front-end version update detection and notification plugin. It can automatically monitor for new version releases of your application and notify users in a friendly way to update, ensuring users always use the latest version of your application.

## ✨ Core Features

- 🎯 **Automatic Update Detection**: Regularly polls to check if there's a new version of your application
- 🔄 **Manual/Auto Modes**: Supports both automatic polling and manual triggering modes
- 🎨 **Multiple Notification Methods**: Supports system native confirm dialog or custom notification UI
- 📱 **Page Visibility Awareness**: Can be configured to pause detection when the page is hidden to save resources
- ⚡ **Lightweight and Efficient**: Clean core code with no third-party dependencies
- 🔧 **Highly Configurable**: Provides rich configuration options to meet different needs
- 🌐 **Multi-framework Support**: Supports vanilla JavaScript, React, Vue and other frameworks

## 📥 Installation

```bash
# Using npm
npm install update-notify-js

# Using yarn
yarn add update-notify-js

# Using pnpm
pnpm add update-notify-js
```

## 🚀 Quick Start

### 1) Native HTML + JS (UMD)

#### Auto Polling Mode
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Version Check Demo</title>
</head>
<body>
  <script src="https://unpkg.com/update-notify-js/dist/index.umd.js"></script>
  <script>
    // Auto polling: check every minute, with logging and callbacks
    WebVersionChecker.createUpdateNotifier({
      pollingInterval: 60000,
      debug: true,
      onDetected: () => {
        console.log('[update-notify-js] New version detected');
      },
      // Custom prompt: confirm then manually refresh (demo of location.reload)
      notifyType: 'custom',
      onUpdate: () => {
        console.log('[update-notify-js] Ready to refresh page for update');
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

#### Manual Start/Stop Mode
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Version Check Demo</title>
</head>
<body>
  <script src="https://unpkg.com/update-notify-js/dist/index.umd.js"></script>
  <script>
    // Manual mode: disable auto polling, control detection timing yourself
    const notifier = WebVersionChecker.createUpdateNotifier({
      pollingInterval: null, // Disable auto polling
      debug: true,
      onDetected: () => {
        console.log('[update-notify-js] New version detected');
      }
    });
    
    // Manual detection (e.g., on button click)
    document.getElementById('checkUpdateBtn').addEventListener('click', async () => {
      const hasUpdate = await notifier.checkUpdate();
      console.log('Detection complete, has update:', hasUpdate);
    });
    
    // Silent detection
    document.getElementById('checkSilentBtn').addEventListener('click', async () => {
      const hasUpdate = await notifier.checkNow();
      console.log('Silent detection complete, has update:', hasUpdate);
      if (hasUpdate) {
        // Custom prompt logic
        if (confirm('New version found, refresh page?')) {
          location.reload();
        }
      }
    });
  </script>
  
  <button id="checkUpdateBtn">Check Update and Prompt</button>
  <button id="checkSilentBtn">Silent Check Update</button>
</body>
</html>
```

### 2) Vue + TypeScript (main.ts)

#### Auto Polling Mode
```ts
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier, type UpdateNotifierOptions } from 'update-notify-js';

createApp(App).mount('#app');

if (import.meta.env.PROD) {
  const options: UpdateNotifierOptions = {
    pollingInterval: 60000,
    notifyType: 'confirm',
    promptMessage: 'New version found, refresh now?',
    onDetected: () => console.log('New version detected')
  };
  createUpdateNotifier(options);
}
```

#### Manual Start/Stop Mode
```ts
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier, type UpdateNotifierOptions } from 'update-notify-js';

const app = createApp(App);
app.mount('#app');

if (import.meta.env.PROD) {
  // Manual mode: disable auto polling
  const options: UpdateNotifierOptions = {
    pollingInterval: null, // Disable auto polling
    notifyType: 'confirm',
    promptMessage: 'New version found, refresh now?',
    onDetected: () => console.log('New version detected')
  };
  
  const notifier = createUpdateNotifier(options);
  
  // Manual detection when needed
  window.checkForUpdate = async () => {
    const hasUpdate = await notifier.checkUpdate();
    console.log('Detection complete, has update:', hasUpdate);
  };
  
  // Silent detection
  window.checkSilently = async () => {
    const hasUpdate = await notifier.checkNow();
    console.log('Silent detection complete, has update:', hasUpdate);
  };
}
```

### 3) React + TypeScript (index.tsx)

#### Auto Polling Mode
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
    promptMessage: 'New version found, refresh now?'
  };
  createUpdateNotifier(options);
}
```

#### Manual Start/Stop Mode
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
  // Manual mode: disable auto polling
  const options: UpdateNotifierOptions = {
    pollingInterval: null, // Disable auto polling
    notifyType: 'confirm',
    promptMessage: 'New version found, refresh now?'
  };
  
  const notifier = createUpdateNotifier(options);
  
  // Expose to global for component usage
  window.versionNotifier = notifier;
}
```

## 📚 API Documentation

### UpdateNotifierOptions Configuration

| Option | Type | Default | Description |
|--------|------|--------|-------------|
| `pollingInterval` | `number \| null` | `10000` | Polling interval in milliseconds. Set to `null` or `0` to disable auto-polling and enter manual mode |
| `notifyType` | `'confirm' \| 'custom'` | `'confirm'` | Method to prompt users for updates. `'confirm'` uses system native dialog, `'custom'` uses custom function |
| `onUpdate` | `() => boolean \| Promise<boolean>` | `undefined` | Custom update prompt function (used when `notifyType='custom'`), returns `true` to confirm refresh |
| `onDetected` | `() => void` | `() => {}` | Callback function when update is detected |
| `pauseOnHidden` | `boolean` | `true` | Whether to pause detection when page is hidden (only effective in auto-polling mode) |
| `immediate` | `boolean` | `true` | Whether to start detection immediately (only effective in auto-polling mode) |
| `indexPath` | `string \| string[]` | `'/'` | Custom request path, can be a single string or an array of paths. In micro-frontend scenarios, you can configure multiple sub-application entry paths for unified detection |
| `scriptRegex` | `RegExp` | `/<script.*src=["'](?<src>[^"]+)/gm` | Script tag regex pattern for custom matching rules |
| `excludeScripts` | `string[] \| RegExp` | `undefined` | List of script paths to exclude, supports string array (with * and ? wildcards) or regular expression |
| `debug` | `boolean` | `false` | Whether to output logs to console |
| `promptMessage` | `string` | `'New version detected. Click OK to refresh and update'` | Default confirm prompt message (used for `notifyType='confirm'`) |
| `cacheControl` | `RequestCache` | `'no-cache'` | Cache control option for fetch request, defaults to 'no-cache' to ensure getting the latest content |

### VersionUpdateNotifier Instance Methods

| Method | Return Value | Description |
|--------|--------------|-------------|
| `start()` | `void` | Start version update detection (only effective in auto-polling mode) |
| `stop()` | `void` | Stop version update detection (only effective in auto-polling mode) |
| `checkNow()` | `Promise<boolean>` | Manually trigger a silent detection, returns whether there's an update but doesn't show prompt |
| `checkUpdate()` | `Promise<boolean>` | Manually trigger a detection, shows prompt if there's an update, returns whether there's an update |
| `reset()` | `void` | Reset status, clear history records |

### Factory Function

```ts
createUpdateNotifier(options?: UpdateNotifierOptions): VersionUpdateNotifier
```

Creates and returns a new version update notifier instance.

## 🔍 Working Principle

This plugin detects version updates through the following methods:

1. **Script Resource Comparison**: Regularly requests the application's entry HTML file and extracts the src attributes of script tags
2. **Change Detection**: Compares the extracted resource list with the previously saved list
3. **Update Notification**: When changes are found in the resource list, it considers a new version to be released and notifies the user

### Micro-Frontend Support

In micro-frontend architecture, you can monitor updates for multiple sub-applications simultaneously by configuring the `indexPath` array:

```ts
// Monitor multiple sub-applications
const options = {
  pollingInterval: 60000,
  indexPath: [
    '/',                // Main application
    '/sub-app-1/index.html',  // Sub-application 1
    '/sub-app-2/index.html'   // Sub-application 2
  ],
  // Other options...
};
createUpdateNotifier(options);
```

> **Tip**: For most modern front-end applications, the build process injects hash values into file names. When code changes, the generated file names also change, so version updates can be determined by detecting changes in script tag src attributes.

## 🛠️ Best Practices

### Micro-Frontend Architecture Best Practices

1. **Configure Paths Properly**: Configure the `indexPath` array according to the actual deployment paths of your sub-applications
2. **Unified Update Management**: Centralize update detection for all sub-applications in the main application to provide a consistent user experience
3. **Differentiated Configuration**: You can create different detection instances for different sub-applications by calling `createUpdateNotifier` multiple times to implement differentiated update strategies
4. **Use Manual Mode**: For micro-frontend scenarios, it's recommended to use manual mode and trigger detection in combination with user actions or application lifecycle events

```ts
// Create different detection instances for different sub-applications
const mainAppNotifier = createUpdateNotifier({
  indexPath: '/',
  pollingInterval: null,
  notifyType: 'custom',
  onUpdate: () => {
    // Main application update prompt, which may require more careful handling
    return confirm('Main application has an update, are you sure you want to refresh? This will affect all active sub-applications');
  }
});

const subAppNotifier = createUpdateNotifier({
  indexPath: ['/sub-app-1', '/sub-app-2'],
  pollingInterval: null,
  notifyType: 'custom',
  onUpdate: () => {
    // Sub-application update prompt
    return confirm('Sub-application update detected, are you sure you want to refresh the page?');
  }
});

// Trigger detection at appropriate times
function checkAllUpdates() {
  mainAppNotifier.checkUpdate();
  subAppNotifier.checkUpdate();
}

### Enable Only in Production Environment

It's recommended to enable update detection only in production environments to avoid interference during development:

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

### Set Polling Interval Reasonably

The polling interval should not be too short, at least 30 seconds or more to avoid excessive network requests:

```ts
const options = {
  pollingInterval: 60000, // 1 minute
  // other options...
};
```

### Use Custom Notification UI

For more beautiful user interfaces, you can use custom notifications:

```ts
const options = {
  notifyType: 'custom',
  onUpdate: async () => {
    // Display custom notification UI
    // For example: using Toast, Modal components
    return await showCustomNotification(); // Return whether user confirmed update
  }
};
```

## 🤝 Contribution Guidelines

Contributions are welcome through the following ways:

1. Submit Issues to report bugs or suggest new features
2. Fork the repository and submit Pull Requests
3. Improve documentation and examples

## 📄 License

[MIT](https://github.com/wangkai000/update-notify-js/blob/main/LICENSE)

## 🌐 Related Links

- [GitHub Repository](https://github.com/wangkai000/update-notify-js)
- [NPM Package](https://www.npmjs.com/package/update-notify-js)

---

**Thank you for using update-notify-js! If you have any questions, please submit an Issue on GitHub.**