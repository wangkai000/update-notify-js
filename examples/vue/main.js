// Vue 3 项目使用示例
import { createApp } from 'vue';
import App from './App.vue';
import { createUpdateNotifier } from '@wangkai000/version-update-check';

/**
 * Vue 应用初始化
 */
const app = createApp(App);

/**
 * 版本更新检测器配置
 * 在 Vue 应用中集成版本更新检测功能
 */
function setupVersionUpdateNotifier() {
  // 仅在生产环境启用版本检测
  if (import.meta.env.PROD) {
    console.log('🔄 版本更新检测器初始化（生产环境）');
    
    // 创建更新检测器实例
    const notifier = createUpdateNotifier({
      pollingInterval: 60000, // 每分钟检测一次
      debug: false,
      notifyType: 'custom', // 使用自定义通知
      
      // 检测到新版本时的回调
      onDetected: () => {
        console.log('🎉 检测到新版本！');
        // 可以在这里使用 Vue 的全局状态或事件总线通知组件
        app.config.globalProperties.$emit('version-update-detected');
      },
      
      // 用户交互确认更新的回调
      onUpdate: async () => {
        console.log('🤔 等待用户确认更新');
        
        // 方式1: 使用原生 confirm (简单方式)
        // return confirm('检测到新版本，点击确定将刷新页面并更新');
        
        // 方式2: 使用 UI 库的对话框 (推荐在实际项目中使用)
        // 例如 Element Plus、Ant Design Vue 等
        /*
        return ElMessageBox.confirm('发现新版本，是否立即更新？', '版本更新', {
          confirmButtonText: '立即更新',
          cancelButtonText: '稍后再说',
          type: 'info'
        }).then(() => true).catch(() => false);
        */
        
        // 方式3: 使用 Vue 组件通信机制
        // 可以通过 Vue 的全局状态或事件触发自定义组件显示
        return new Promise((resolve) => {
          // 假设我们通过全局方法显示自定义对话框
          app.config.globalProperties.$showUpdateDialog({
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false)
          });
        });
      },
      
      // 错误处理回调
      onError: (error) => {
        console.error('❌ 版本检测出错:', error);
        // 可以集成到 Vue 应用的错误处理机制中
      }
    });
    
    // 将检测器实例挂载到 Vue 应用上，以便在组件中访问
    app.config.globalProperties.$versionNotifier = notifier;
    
    return notifier;
  } else {
    console.log('📝 开发环境，版本更新检测器已禁用');
    return null;
  }
}

/**
 * Vue 组件中使用版本检测器示例
 * 在实际项目中，你可以这样在组件中使用
 */
/*
export default {
  mounted() {
    // 监听版本更新事件
    this.$on('version-update-detected', () => {
      this.hasUpdate = true;
    });
  },
  methods: {
    // 手动触发检查
    async checkForUpdates() {
      if (this.$versionNotifier) {
        try {
          const hasUpdate = await this.$versionNotifier.checkNow();
          console.log('检查更新结果:', hasUpdate);
        } catch (error) {
          console.error('检查更新失败:', error);
        }
      }
    }
  }
}
*/

// 初始化版本更新检测器
const versionNotifier = setupVersionUpdateNotifier();

// 挂载应用
app.mount('#app');

// 导出应用实例和版本检测器（用于测试或特殊场景）
export { app, versionNotifier };
