// 使用 ES Module 的原生 JS 示例
import { createUpdateNotifier } from 'update-notify-js';

/**
 * 示例 1: 基础使用
 * 配置自动检测，每分钟检查一次版本更新
 */
const notifier = createUpdateNotifier({
  pollingInterval: 60000, // 1 分钟检测一次
  debug: true,
  onDetected: () => {
    console.log('🔔 基础使用示例 - 检测到新版本！');
  }
});

/**
 * 示例 2: 高级使用 - 自定义 UI 和交互
 * 配置自定义通知方式和用户交互逻辑
 */
const advancedNotifier = createUpdateNotifier({
  pollingInterval: 30000, // 30秒检测一次
  notifyType: 'custom',   // 使用自定义通知
  immediate: true,        // 立即开始检测
  onUpdate: async () => {
    console.log('🎨 高级使用示例 - 准备显示自定义更新提示');
    
    // 创建自定义提示 UI
    const modal = document.createElement('div');
    modal.className = 'update-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;
    modal.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 5px 25px rgba(0,0,0,0.2);
      ">
        <h3 style="margin-top: 0; color: #2c3e50;">🎉 发现新版本</h3>
        <p style="color: #555;">检测到系统有新版本，建议立即更新以获得最佳体验。</p>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
          <button id="updateNow" style="
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background-color: #3498db;
            color: white;
            cursor: pointer;
            font-size: 14px;
          ">立即更新</button>
          <button id="updateLater" style="
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background-color: #95a5a6;
            color: white;
            cursor: pointer;
            font-size: 14px;
          ">稍后再说</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // 返回 Promise 控制更新行为
    return new Promise((resolve) => {
      document.getElementById('updateNow').onclick = () => {
        console.log('✅ 用户确认更新');
        modal.remove();
        resolve(true); // 确认更新
      };
      document.getElementById('updateLater').onclick = () => {
        console.log('⏸️ 用户选择稍后更新');
        modal.remove();
        resolve(false); // 拒绝更新
      };
    });
  },
  onDetected: () => {
    console.log('🔍 高级使用示例 - 检测到新版本');
  },
  onError: (error) => {
    console.error('❌ 高级使用示例 - 检测更新时出错:', error);
  }
});

/**
 * 示例 3: 手动控制示例
 * 配置为不立即开始检测，等待手动控制
 */
const manualNotifier = createUpdateNotifier({
  immediate: false,      // 不立即开始检测
  pollingInterval: 120000, // 2分钟检测一次
  debug: true
});

// 手动控制函数示例
function demonstrateManualControl() {
  console.log('📱 手动控制示例 - 开始演示');
  
  // 1. 延迟后启动检测
  setTimeout(() => {
    console.log('▶️ 手动控制示例 - 启动检测');
    manualNotifier.start();
  }, 5000);
  
  // 2. 再次延迟后手动检查
  setTimeout(async () => {
    console.log('🔄 手动控制示例 - 手动触发检查');
    try {
      const hasUpdate = await manualNotifier.checkNow();
      console.log(`📊 手动控制示例 - 检查结果: ${hasUpdate ? '有更新' : '无更新'}`);
    } catch (error) {
      console.error('❌ 手动控制示例 - 手动检查失败:', error);
    }
  }, 10000);
  
  // 3. 最后停止检测
  setTimeout(() => {
    console.log('⏹️ 手动控制示例 - 停止检测');
    manualNotifier.stop();
  }, 15000);
}

/**
 * 导出示例实例，供其他模块使用
 */
export {
  notifier,
  advancedNotifier,
  manualNotifier,
  demonstrateManualControl
};

// 运行手动控制演示
demonstrateManualControl();

// 在某个时机开始检测
setTimeout(() => {
  manualNotifier.start();
}, 5000);

// 导出供外部使用
export { notifier, advancedNotifier, manualNotifier, excludedNotifier };

/**
 * 示例 5: 使用 excludeScripts 排除特定脚本
 * 配置排除第三方库和CDN资源，只关注应用核心脚本
 */
const excludedNotifier = createUpdateNotifier({
  pollingInterval: 60000, // 1分钟检测一次
  debug: true,
  // 排除第三方库、CDN资源和Service Worker
  excludeScripts: [
    'https://cdn.jsdelivr.net/npm/*',
    'https://unpkg.com/*',
    '/assets/vendor/*.js',
    '/analytics.js',
    '/sw.js'
  ],
  onDetected: () => {
    console.log('🎯 排除脚本示例 - 检测到应用核心脚本有更新！');
  }
});
