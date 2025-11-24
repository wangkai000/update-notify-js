// React 项目使用示例
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createUpdateNotifier } from 'update-notify-js';

/**
 * React 应用初始化
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * 版本更新检测器配置
 * 在 React 项目中集成版本更新检测功能
 */
function setupVersionUpdateNotifier() {
  // 仅在生产环境启用版本检测
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 版本更新检测器初始化（生产环境）');
    
    // 创建更新检测器实例
    const notifier = createUpdateNotifier({
      pollingInterval: 30000, // 每 30 秒检测一次
      debug: false,
      notifyType: 'custom', // 使用自定义通知
      
      // 排除第三方库和CDN资源，只检测应用核心代码更新
      excludeScripts: [
        'https://cdn.jsdelivr.net/npm/*',
        'https://unpkg.com/*',
        '/static/js/vendors~*.js',
        '/analytics.js'
      ],
      
      // 检测到新版本时的回调
      onDetected: () => {
        console.log('🎉 检测到新版本！');
        // 这里可以触发 React 组件中的状态更新
        // 例如使用事件总线或 Context API 通知相关组件
      },
      
      // 用户交互确认更新的回调
      onUpdate: async () => {
        // 在实际 React 应用中，这里可以使用 React 组件库的模态框
        // 例如 Ant Design、Material-UI 等提供的 Modal 组件
        console.log('🤔 等待用户确认更新');
        
        // 使用原生 confirm 作为示例
        // 在实际项目中，建议替换为 React 组件
        return confirm('检测到新版本，是否立即刷新页面更新？');
      },
      
      // 错误处理回调
      onError: (error) => {
        console.error('❌ 版本检测出错:', error);
        // 这里可以集成错误监控服务
      }
    });
    
    return notifier;
  } else {
    console.log('📝 开发环境，版本更新检测器已禁用');
    return null;
  }
}

/**
 * React 组件中使用版本检测器示例
 * 下面是一个模拟的 React Hook 示例，展示如何在组件中集成
 */
/*
function useVersionUpdateNotifier() {
  const [hasUpdate, setHasUpdate] = React.useState(false);
  
  React.useEffect(() => {
    const notifier = createUpdateNotifier({
      pollingInterval: 60000,
      notifyType: 'custom',
      onDetected: () => {
        setHasUpdate(true);
      }
    });
    
    return () => {
      notifier.stop();
    };
  }, []);
  
  return {
    hasUpdate,
    checkUpdate: async () => {
      const notifier = createUpdateNotifier({ immediate: false });
      try {
        return await notifier.checkNow();
      } finally {
        notifier.stop();
      }
    }
  };
}
*/

// 初始化版本更新检测器
const updateNotifier = setupVersionUpdateNotifier();

// 导出检测器实例，以便在应用其他地方使用
export { updateNotifier };
