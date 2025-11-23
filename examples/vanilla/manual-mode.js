// 手动模式使用示例 - VersionUpdateCheck
// 手动模式：完全由开发者控制版本检测的时机和通知的显示方式

import { createUpdateNotifier } from '@wangkai000/version-update-check';

/**
 * 手动模式示例
 * 在手动模式下，组件不会自动进行轮询检测，而是由开发者控制检测的时机
 * 通知的显示方式也完全由开发者自定义
 */
function setupManualMode() {
  console.log('🎮 初始化手动模式版本检测器');
  
  // 创建更新检测器实例 - 手动模式配置
  const notifier = createUpdateNotifier({
    // 禁用自动轮询
    pollingInterval: 0, // 设置为0表示禁用自动轮询
    
    // 禁用自动通知
    notifyType: 'custom',
    
    // 启用调试模式
    debug: true,
    
    // 不立即检测更新
    immediate: false,
    
    // 检测到新版本时的回调
    onDetected: (currentVersion, latestVersion) => {
      console.log(`🎉 检测到新版本! 当前版本: ${currentVersion}, 最新版本: ${latestVersion}`);
      
      // 在手动模式下，我们需要自己显示通知
      showCustomNotification(currentVersion, latestVersion, notifier);
    },
    
    // 错误处理回调
    onError: (error) => {
      console.error('❌ 版本检测出错:', error);
      // 显示错误信息
      showErrorNotification(error.message);
    }
  });
  
  console.log('✅ 手动模式版本检测器已初始化，等待手动触发');
  return notifier;
}

/**
 * 显示自定义通知
 * 在手动模式下，我们需要完全自定义通知的样式和行为
 */
function showCustomNotification(currentVersion, latestVersion, notifier) {
  console.log('🖥️  显示自定义更新通知');
  
  // 检查是否已经存在通知元素
  let notification = document.getElementById('custom-update-notification');
  
  if (!notification) {
    // 创建通知元素
    notification = document.createElement('div');
    notification.id = 'custom-update-notification';
    notification.className = 'custom-update-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 20px;
      width: 320px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // 添加通知内容
    notification.innerHTML = `
      <div style="margin-bottom: 12px;">
        <h4 style="margin: 0; color: #262626; font-size: 16px; font-weight: 500;">版本更新提醒</h4>
        <p style="margin: 8px 0 0 0; color: #595959; font-size: 14px;">
          当前版本: <span id="current-version">${currentVersion}</span><br>
          最新版本: <span id="latest-version">${latestVersion}</span>
        </p>
      </div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="update-later-btn" style="
          padding: 6px 16px;
          border: 1px solid #d9d9d9;
          background: #ffffff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #595959;
        ">稍后提醒</button>
        <button id="update-now-btn" style="
          padding: 6px 16px;
          border: none;
          background: #1890ff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #ffffff;
        ">立即更新</button>
      </div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加淡入动画
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    // 添加按钮事件监听器
    document.getElementById('update-now-btn').addEventListener('click', async () => {
      console.log('🔄 用户点击了立即更新按钮');
      // 隐藏通知
      hideNotification(notification);
      // 执行更新
      await notifier.update();
    });
    
    document.getElementById('update-later-btn').addEventListener('click', () => {
      console.log('⏰ 用户点击了稍后提醒按钮');
      // 隐藏通知
      hideNotification(notification);
    });
  } else {
    // 更新版本信息
    document.getElementById('current-version').textContent = currentVersion;
    document.getElementById('latest-version').textContent = latestVersion;
    
    // 显示通知
    notification.style.display = 'block';
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
  }
}

/**
 * 隐藏通知
 */
function hideNotification(notification) {
  notification.style.opacity = '0';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 300);
}

/**
 * 显示错误通知
 */
function showErrorNotification(message) {
  console.log('⚠️  显示错误通知');
  
  // 检查是否已经存在错误通知元素
  let errorNotification = document.getElementById('error-notification');
  
  if (!errorNotification) {
    // 创建错误通知元素
    errorNotification = document.createElement('div');
    errorNotification.id = 'error-notification';
    errorNotification.className = 'error-notification';
    errorNotification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fff1f0;
      border: 1px solid #ffccc7;
      border-radius: 4px;
      padding: 16px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // 添加错误通知内容
    errorNotification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span style="color: #ff4d4f; font-size: 16px;">⚠️</span>
        <div>
          <h4 style="margin: 0; color: #ff4d4f; font-size: 14px; font-weight: 500;">检查更新失败</h4>
          <p style="margin: 4px 0 0 0; color: #595959; font-size: 14px; max-width: 300px;">
            <span id="error-message">${message}</span>
          </p>
        </div>
        <button id="close-error-btn" style="
          background: none;
          border: none;
          color: #bfbfbf;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          margin-left: auto;
        ">×</button>
      </div>
    `;
    
    // 添加到页面
    document.body.appendChild(errorNotification);
    
    // 添加淡入动画
    errorNotification.style.opacity = '0';
    errorNotification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      errorNotification.style.opacity = '1';
    }, 10);
    
    // 添加关闭按钮事件监听器
    document.getElementById('close-error-btn').addEventListener('click', () => {
      hideErrorNotification(errorNotification);
    });
    
    // 3秒后自动隐藏
    setTimeout(() => {
      hideErrorNotification(errorNotification);
    }, 5000);
  } else {
    // 更新错误信息
    document.getElementById('error-message').textContent = message;
    
    // 显示错误通知
    errorNotification.style.display = 'block';
    errorNotification.style.opacity = '0';
    setTimeout(() => {
      errorNotification.style.opacity = '1';
    }, 10);
    
    // 重置自动隐藏计时器
    clearTimeout(errorNotification._hideTimer);
    errorNotification._hideTimer = setTimeout(() => {
      hideErrorNotification(errorNotification);
    }, 5000);
  }
}

/**
 * 隐藏错误通知
 */
function hideErrorNotification(errorNotification) {
  errorNotification.style.opacity = '0';
  setTimeout(() => {
    errorNotification.style.display = 'none';
  }, 300);
}

/**
 * 示例：在适当时机手动检查更新
 * 在实际应用中，你可能会在以下场景手动触发检查：
 * 1. 用户点击"检查更新"按钮
 * 2. 应用启动时
 * 3. 用户登录后
 * 4. 特定操作后
 */
function manualCheckExample() {
  const notifier = setupManualMode();
  
  // 绑定UI事件
  document.addEventListener('DOMContentLoaded', () => {
    // 检查更新按钮
    const checkUpdateBtn = document.getElementById('check-update-btn');
    if (checkUpdateBtn) {
      checkUpdateBtn.addEventListener('click', async () => {
        try {
          checkUpdateBtn.disabled = true;
          checkUpdateBtn.textContent = '检查中...';
          
          console.log('👆 用户手动触发检查更新');
          
          // 手动检查更新
          const hasUpdate = await notifier.checkNow();
          
          // 如果没有更新，显示提示
          if (!hasUpdate) {
            console.log('✅ 当前已是最新版本');
            showNoUpdateNotification();
          }
        } catch (error) {
          console.error('❌ 手动检查更新失败:', error);
          showErrorNotification(error.message);
        } finally {
          checkUpdateBtn.disabled = false;
          checkUpdateBtn.textContent = '检查更新';
        }
      });
    }
  });
  
  // 应用启动3秒后自动检查一次更新
  setTimeout(async () => {
    try {
      console.log('🚀 应用启动，执行初始版本检查');
      await notifier.checkNow();
    } catch (error) {
      console.error('❌ 初始版本检查失败:', error);
      // 静默失败，不显示错误通知
    }
  }, 3000);
  
  return notifier;
}

/**
 * 显示无更新通知
 */
function showNoUpdateNotification() {
  // 检查是否已经存在无更新通知元素
  let noUpdateNotification = document.getElementById('no-update-notification');
  
  if (!noUpdateNotification) {
    // 创建无更新通知元素
    noUpdateNotification = document.createElement('div');
    noUpdateNotification.id = 'no-update-notification';
    noUpdateNotification.className = 'no-update-notification';
    noUpdateNotification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f6ffed;
      border: 1px solid #b7eb8f;
      border-radius: 4px;
      padding: 16px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // 添加无更新通知内容
    noUpdateNotification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span style="color: #52c41a; font-size: 16px;">✅</span>
        <div>
          <h4 style="margin: 0; color: #52c41a; font-size: 14px; font-weight: 500;">已是最新版本</h4>
          <p style="margin: 4px 0 0 0; color: #595959; font-size: 14px;">
            当前没有可用的更新
          </p>
        </div>
        <button id="close-no-update-btn" style="
          background: none;
          border: none;
          color: #bfbfbf;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          margin-left: auto;
        ">×</button>
      </div>
    `;
    
    // 添加到页面
    document.body.appendChild(noUpdateNotification);
    
    // 添加淡入动画
    noUpdateNotification.style.opacity = '0';
    noUpdateNotification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      noUpdateNotification.style.opacity = '1';
    }, 10);
    
    // 添加关闭按钮事件监听器
    document.getElementById('close-no-update-btn').addEventListener('click', () => {
      hideNoUpdateNotification(noUpdateNotification);
    });
  } else {
    // 显示无更新通知
    noUpdateNotification.style.display = 'block';
    noUpdateNotification.style.opacity = '0';
    setTimeout(() => {
      noUpdateNotification.style.opacity = '1';
    }, 10);
  }
  
  // 3秒后自动隐藏
  setTimeout(() => {
    hideNoUpdateNotification(noUpdateNotification);
  }, 3000);
}

/**
 * 隐藏无更新通知
 */
function hideNoUpdateNotification(noUpdateNotification) {
  noUpdateNotification.style.opacity = '0';
  setTimeout(() => {
    noUpdateNotification.style.display = 'none';
  }, 300);
}

// 导出函数，以便在其他文件中使用
export { setupManualMode, manualCheckExample };

// 如果是直接运行此文件，则初始化手动模式
if (typeof window !== 'undefined' && !import.meta.hot) {
  manualCheckExample();
}