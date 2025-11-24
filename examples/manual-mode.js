// 完全手动模式示例
import { createUpdateNotifier } from 'update-notify-js';

// ==================== 方式 1: 禁用自动轮询，完全手动控制 ====================
// 设置 pollingInterval 为 null 或 0
const manualNotifier = createUpdateNotifier({
  pollingInterval: null,  // 或者 0，禁用自动轮询
  debug: true
});

// 自己编写定时器，每分钟检测一次
setInterval(async () => {
  console.log('开始手动检测更新...');
  await manualNotifier.checkUpdate();  // 检测并提示用户
}, 60000); // 每分钟

// 或者在特定事件触发时检测
document.getElementById('checkUpdateBtn')?.addEventListener('click', async () => {
  const hasUpdate = await manualNotifier.checkUpdate();
  if (!hasUpdate) {
    alert('当前已是最新版本');
  }
});


// ==================== 方式 2: 使用 checkNow (仅检测，不提示) ====================
const quietNotifier = createUpdateNotifier({
  pollingInterval: null
});

setInterval(async () => {
  // 仅检测是否有更新，不显示任何提示
  const hasUpdate = await quietNotifier.checkNow();
  
  if (hasUpdate) {
    console.log('检测到新版本！');
    // 可以在这里做其他处理，比如显示自定义通知
    showCustomNotification('发现新版本');
  }
}, 60000);


// ==================== 方式 3: 自定义复杂的检测逻辑 ====================
const customNotifier = createUpdateNotifier({
  pollingInterval: 0,  // 禁用自动轮询
  notifyType: 'custom',
  onUpdate: async () => {
    // 自定义更新提示 UI
    return await showMyCustomDialog();
  },
  onDetected: () => {
    console.log('检测到新版本，即将显示自定义对话框');
  }
});


// ==================== 方式 4: 结合 excludeScripts 的手动检测 ====================
const excludedNotifier = createUpdateNotifier({
  pollingInterval: null,  // 禁用自动轮询
  debug: true,
  // 排除第三方库和CDN资源，只检测应用核心脚本
  excludeScripts: [
    'https://cdn.jsdelivr.net/npm/*',
    '/assets/libs/*.js',
    '/public/vendors/*.js',
    '/sw.js'
  ]
});

// 手动触发检测，只关注应用核心脚本变化
document.getElementById('checkCoreUpdateBtn')?.addEventListener('click', async () => {
  console.log('开始检测核心脚本更新（已排除第三方库）...');
  const hasUpdate = await excludedNotifier.checkUpdate();
  if (!hasUpdate) {
    alert('核心应用脚本已是最新版本');
  }
});

// 静默检测 - 每小时检查一次核心脚本
setInterval(async () => {
  console.log('执行定时静默检测...');
  const hasUpdate = await excludedNotifier.checkNow();
  if (hasUpdate) {
    console.log('核心应用脚本有更新，准备通知用户');
    // 这里可以显示自定义通知
  }
}, 3600000); // 每小时

// ==================== 混合模式 - 手动触发 + 条件检测 ====================
const hybridNotifier = createUpdateNotifier({
  pollingInterval: null,
  debug: true
});

// 定时器：仅在工作时间检测
const checkDuringWorkHours = () => {
  const hour = new Date().getHours();
  // 9:00 - 18:00 之间才检测
  if (hour >= 9 && hour < 18) {
    console.log('工作时间，检测更新');
    hybridNotifier.checkUpdate();
  }
};

// 每 30 分钟执行一次检测（但只在工作时间）
setInterval(checkDuringWorkHours, 30 * 60 * 1000);


// ==================== 方式 5: 智能检测 - 根据用户活跃度 ====================
const smartNotifier = createUpdateNotifier({
  pollingInterval: null
});

let lastActivityTime = Date.now();
let isUserActive = true;

// 监听用户活动
['click', 'keydown', 'scroll'].forEach(event => {
  document.addEventListener(event, () => {
    lastActivityTime = Date.now();
    isUserActive = true;
  });
});

// 定时检测：用户活跃时才检测
setInterval(() => {
  const timeSinceLastActivity = Date.now() - lastActivityTime;
  
  // 用户在过去 2 分钟内有活动
  if (timeSinceLastActivity < 2 * 60 * 1000) {
    console.log('用户活跃，检测更新');
    smartNotifier.checkUpdate();
  } else {
    console.log('用户不活跃，跳过检测');
  }
}, 60 * 1000);


// ==================== 辅助函数 ====================

function showCustomNotification(message) {
  // 使用你自己的通知组件
  const notification = document.createElement('div');
  notification.className = 'custom-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

async function showMyCustomDialog() {
  // 返回 Promise<boolean>
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.innerHTML = `
      <div class="custom-dialog">
        <h3>发现新版本</h3>
        <p>是否立即更新？</p>
        <button id="confirm-update">立即更新</button>
        <button id="cancel-update">稍后再说</button>
      </div>
    `;
    document.body.appendChild(dialog);
    
    document.getElementById('confirm-update').onclick = () => {
      dialog.remove();
      resolve(true);
    };
    
    document.getElementById('cancel-update').onclick = () => {
      dialog.remove();
      resolve(false);
    };
  });
}
