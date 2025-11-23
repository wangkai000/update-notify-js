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
    console.log('🎉 检测到新版本！');
    // 发送统计数据
    analytics.track('version_update_detected');
  }
});

// 在用户完成关键操作后检测
async function onUserFinishImportantTask() {
  console.log('任务完成，检测更新...');
  await customNotifier.checkUpdate();
}

// 每隔 5 分钟检测一次
setInterval(() => {
  customNotifier.checkUpdate();
}, 5 * 60 * 1000);


// ==================== 方式 4: 混合模式 - 手动触发 + 条件检测 ====================
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
