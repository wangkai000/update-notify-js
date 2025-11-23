// update-notify-js 微前端场景使用示例

import { createUpdateNotifier } from 'update-notify-js';

/**
 * 微前端架构中的版本更新检测示例
 * 
 * 在微前端架构中，我们可以通过配置 indexPath 数组来同时监控多个子应用的更新情况
 */

// 示例1: 单一实例监控多个子应用（推荐用于简单场景）
function createSingleInstanceMultiPath() {
  const notifier = createUpdateNotifier({
    // 设置轮询间隔（毫秒）
    pollingInterval: 60000, // 1分钟
    
    // 配置监控多个应用的路径
    indexPath: [
      '/',                // 主应用
      '/sub-app-1/index.html',  // 子应用1
      '/sub-app-2/index.html',  // 子应用2
      '/sub-app-3'         // 子应用3（可以使用相对路径）
    ],
    
    // 使用自定义通知方式
    notifyType: 'custom',
    
    // 自定义更新处理函数
    onUpdate: () => {
      // 这里可以获取是哪个子应用有更新，并提供更精确的信息
      // 例如显示哪个子应用需要更新，以及可能的影响
      const appName = '某个应用'; // 实际应用中可以通过分析哪个路径有变化来确定
      
      console.log(`[update-notify-js] ${appName} 检测到新版本`);
      
      // 向用户展示更友好的提示
      const ok = confirm(`${appName} 有新版本可用，是否立即刷新页面更新？\n\n刷新将导致当前页面状态丢失`);
      
      // 返回 true 表示用户确认刷新
      return ok;
    },
    
    // 检测到更新时的回调函数
    onDetected: () => {
      console.log('[update-notify-js] 检测到新版本');
    },
    
    // 是否在页面隐藏时暂停检测
    pauseOnHidden: true,
    
    // 开启调试日志
    debug: true
  });
  
  return notifier;
}

// 示例2: 为不同子应用创建不同的检测实例（推荐用于复杂场景）
function createMultipleInstances() {
  // 主应用更新检测实例
  const mainAppNotifier = createUpdateNotifier({
    indexPath: '/', // 仅监控主应用
    pollingInterval: null, // 禁用自动轮询
    notifyType: 'custom',
    onUpdate: () => {
      // 主应用更新通常需要更谨慎的处理，因为它可能影响所有子应用
      return confirm('主应用有更新，确定要刷新吗？这将影响所有正在使用的子应用');
    }
  });
  
  // 业务子应用检测实例
  const businessAppsNotifier = createUpdateNotifier({
    indexPath: ['/sub-app-1/index.html', '/sub-app-2/index.html'], // 监控业务相关子应用
    pollingInterval: null,
    notifyType: 'custom',
    onUpdate: () => {
      return confirm('业务应用有更新，是否刷新页面？');
    }
  });
  
  // 工具子应用检测实例
  const toolAppsNotifier = createUpdateNotifier({
    indexPath: ['/sub-app-3', '/sub-app-4'], // 监控工具类子应用
    pollingInterval: null,
    notifyType: 'custom',
    onUpdate: () => {
      return confirm('工具应用有更新，是否刷新页面？');
    }
  });
  
  // 返回所有实例，方便统一管理
  return {
    mainApp: mainAppNotifier,
    businessApps: businessAppsNotifier,
    toolApps: toolAppsNotifier,
    
    // 便捷方法：检查所有更新
    checkAllUpdates: async () => {
      const [mainHasUpdate, businessHasUpdate, toolHasUpdate] = await Promise.all([
        mainAppNotifier.checkNow(), // 静默检测主应用
        businessAppsNotifier.checkUpdate(), // 检测业务应用并提示
        toolAppsNotifier.checkNow() // 静默检测工具应用
      ]);
      
      // 如果有静默检测到的更新，可以根据需要做进一步处理
      if (toolHasUpdate) {
        // 可以选择延时提示或其他处理方式
        console.log('工具应用有更新，请稍后刷新页面');
      }
      
      return {
        mainHasUpdate,
        businessHasUpdate,
        toolHasUpdate
      };
    }
  };
}

/**
 * 在微前端框架中的集成示例
 * 
 * 以下是一些常见微前端框架中集成 update-notify-js 的方法
 */

// Single-SPA 集成示例
function integrateWithSingleSpa() {
  // 安装全局通知器
  const notifier = createUpdateNotifier({
    indexPath: [
      '/', // 主应用
      '/single-spa-app1/index.html',
      '/single-spa-app2/index.html'
    ],
    pollingInterval: 60000,
    notifyType: 'custom',
    onUpdate: () => {
      // 可以结合 Single-SPA 的生命周期事件
      return confirm('检测到应用更新，是否刷新页面？');
    }
  });
  
  // 在 Single-SPA 的应用加载时触发手动检测
  window.singleSpa.registerApplication({
    name: 'my-app',
    app: () => import('./my-app'),
    activeWhen: ['/my-app'],
    customProps: {
      // 可以将 notifier 传递给子应用
      updateNotifier: notifier
    }
  });
  
  return notifier;
}

// Qiankun 微前端框架集成示例
function integrateWithQiankun() {
  const notifier = createUpdateNotifier({
    indexPath: [
      '/',
      '/app1/index.html',
      '/app2/index.html'
    ],
    pollingInterval: null, // 禁用自动轮询，通过框架生命周期控制
    notifyType: 'custom',
    onUpdate: () => {
      return confirm('检测到应用更新，是否刷新页面？');
    }
  });
  
  // 在 Qiankun 中注册应用时，可以在生命周期钩子中调用检测
  const apps = [
    {
      name: 'app1',
      entry: '/app1/index.html',
      container: '#app-container',
      activeRule: '/app1',
      props: {
        // 可以将 notifier 传递给子应用
        updateNotifier: notifier
      }
    }
  ];
  
  // 在合适的生命周期钩子中手动触发检测
  function checkUpdatesOnAppChange() {
    notifier.checkUpdate();
  }
  
  return notifier;
}

/**
 * 实际使用示例
 * 
 * 根据您的微前端架构和需求，可以选择以下不同的使用方式
 */

// 1. 简单场景：使用单一实例监控所有应用
const singleInstance = createSingleInstanceMultiPath();

// 2. 复杂场景：为不同应用类型创建不同实例（推荐）
const instances = createMultipleInstances();

// 例如：在用户点击刷新按钮时检测所有更新
function handleRefreshButtonClick() {
  instances.checkAllUpdates().then(results => {
    console.log('更新检测结果:', results);
  });
}

// 3. 结合微前端框架使用
// const qiankunNotifier = integrateWithQiankun();

/**
 * 最佳实践建议
 */

// 1. 仅在生产环境使用
if (process.env.NODE_ENV === 'production' || import.meta.env.PROD) {
  // 初始化通知器
  // ...
}

// 2. 在主应用中集中管理所有子应用的更新检测
// 这样可以提供一致的用户体验，避免每个子应用都弹出更新提示

// 3. 结合用户操作或应用生命周期事件触发检测
// 例如：当用户切换应用、打开新页面或空闲一段时间后触发检测

// 4. 对于大型微前端应用，建议使用手动模式而非自动轮询
// 可以在合适的时机（如页面切换、用户空闲等）触发检测

// 5. 考虑更新策略差异化
// 主应用更新可能需要更谨慎的处理
// 不同类型的子应用可能需要不同的更新提示和刷新策略