## Usage (3 common cases)

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

#### Manual Start/Stop Mode
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
    // Manual mode: disable auto polling, control detection timing yourself
    const notifier = WebVersionChecker.createUpdateNotifier({
      pollingInterval: null, // Disable auto polling
      debug: true,
      onDetected: () => {
        console.log('[version-update-check] New version detected');
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
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

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
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

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
import { createUpdateNotifier, type UpdateNotifierOptions } from '@wangkai000/version-update-check';

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

// Usage example in component
const UpdateChecker: React.FC = () => {
  const handleCheckUpdate = async () => {
    if (window.versionNotifier) {
      const hasUpdate = await window.versionNotifier.checkUpdate();
      console.log('Detection complete, has update:', hasUpdate);
    }
  };
  
  const handleCheckSilent = async () => {
    if (window.versionNotifier) {
      const hasUpdate = await window.versionNotifier.checkNow();
      console.log('Silent detection complete, has update:', hasUpdate);
    }
  };
  
  return (
    <div>
      <button onClick={handleCheckUpdate}>Check Update and Prompt</button>
      <button onClick={handleCheckSilent}>Silent Check Update</button>
    </div>
  );
};