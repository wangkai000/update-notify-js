// 自动模式使用示例 - VersionUpdateCheck
// 自动模式：组件自动进行轮询检测和通知，无需手动干预

import { createUpdateNotifier } from '@wangkai000/version-update-check';

/**
 * 自动模式示例
 * 在自动模式下，组件会按照设定的轮询间隔自动检测版本更新，并在发现新版本时显示通知
 */
function setupAutoMode() {
  console.log('🚀 初始化自动模式版本检测器');
  
  // 创建更新检测器实例 - 自动模式配置
  const notifier = createUpdateNotifier({
    // 轮询间隔设置为60秒
    pollingInterval: 60000,
    
    // 启用自动通知
    notifyType: 'auto', // auto: 自动显示系统通知, custom: 自定义通知
    
    // 启用调试模式
    debug: true,
    
    // 立即检测更新（组件初始化后立即进行第一次检测）
    immediate: true,
    
    // 自定义通知消息
    notificationMessage: {
      title: '版本更新提醒',
      description: '发现新版本，点击更新',
      updateButtonText: '立即更新',
      laterButtonText: '稍后提醒'
    },
    
    // 检测到新版本时的回调
    onDetected: (currentVersion, latestVersion) => {
      console.log(`🎉 检测到新版本! 当前版本: ${currentVersion}, 最新版本: ${latestVersion}`);
      // 可以在这里添加自定义的业务逻辑
    },
    
    // 用户确认更新时的回调
    onUpdate: async () => {
      console.log('🔄 用户确认更新');
      // 这里返回true表示允许刷新页面
      return true;
    },
    
    // 检测开始时的回调
    onCheckStart: () => {
      console.log('⏳ 开始检查版本更新...');
      // 可以在这里显示加载状态
    },
    
    // 检测完成时的回调
    onCheckComplete: (hasUpdate) => {
      console.log(`✅ 版本检查完成，${hasUpdate ? '有更新' : '暂无更新'}`);
      // 可以在这里隐藏加载状态
    },
    
    // 错误处理回调
    onError: (error) => {
      console.error('❌ 版本检测出错:', error);
      // 可以在这里添加错误处理逻辑
    }
  });
  
  console.log('✅ 自动模式版本检测器已启动，将每60秒自动检查一次更新');
  return notifier;
}

/**
 * 自动模式与其他功能的结合示例
 */
function integrateWithAutoMode() {
  const notifier = setupAutoMode();
  
  // 示例：与UI按钮结合
  document.addEventListener('DOMContentLoaded', () => {
    // 手动触发检查按钮
    const checkNowBtn = document.getElementById('check-now-btn');
    if (checkNowBtn) {
      checkNowBtn.addEventListener('click', async () => {
        try {
          checkNowBtn.disabled = true;
          console.log('👆 用户手动触发检查更新');
          const hasUpdate = await notifier.checkNow();
          console.log(`📊 手动检查结果: ${hasUpdate ? '有更新' : '暂无更新'}`);
        } catch (error) {
          console.error('❌ 手动检查失败:', error);
          alert('检查更新失败，请稍后重试');
        } finally {
          checkNowBtn.disabled = false;
        }
      });
    }
    
    // 暂停检测按钮
    const pauseBtn = document.getElementById('pause-check-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        console.log('⏸️  暂停自动检查');
        notifier.pause();
        pauseBtn.disabled = true;
        document.getElementById('resume-check-btn')?.removeAttribute('disabled');
      });
    }
    
    // 恢复检测按钮
    const resumeBtn = document.getElementById('resume-check-btn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        console.log('▶️  恢复自动检查');
        notifier.resume();
        resumeBtn.disabled = true;
        document.getElementById('pause-check-btn')?.removeAttribute('disabled');
      });
    }
  });
  
  return notifier;
}

// 导出函数，以便在其他文件中使用
export { setupAutoMode, integrateWithAutoMode };

// 如果是直接运行此文件，则初始化自动模式
if (typeof window !== 'undefined' && !import.meta.hot) {
  integrateWithAutoMode();
}