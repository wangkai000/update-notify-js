// exclude-scripts.js - 使用excludeScripts功能排除特定脚本的示例

// 导入方式1：在ES模块环境中
// import { createUpdateNotifier } from 'update-notify-js';

// 导入方式2：在CommonJS环境中
// const { createUpdateNotifier } = require('update-notify-js');

// 导入方式3：在浏览器中使用UMD版本
// <script src="https://unpkg.com/update-notify-js/dist/index.umd.js"></script>
// 然后通过全局对象访问：const { createUpdateNotifier } = WebVersionChecker;

// 示例1：使用字符串数组排除特定脚本（支持通配符）
function exampleWithStringArray() {
  const options = {
    pollingInterval: 30000, // 30秒轮询一次
    debug: true,
    // 排除第三方库和分析脚本，只关注应用核心脚本
    excludeScripts: [
      'https://cdn.jsdelivr.net/npm/react/*',
      'https://cdn.jsdelivr.net/npm/react-dom/*',
      'https://cdn.jsdelivr.net/npm/axios/*',
      'https://analytics.example.com/*.js',
      '/assets/vendor/*.js',
      '/sw.js' // 排除Service Worker脚本
    ],
    onDetected: () => {
      console.log('检测到应用核心脚本有更新');
    }
  };

  const notifier = createUpdateNotifier(options);
  console.log('已启动使用字符串数组排除脚本的更新检测');
  return notifier;
}

// 示例2：使用正则表达式排除脚本
function exampleWithRegex() {
  const options = {
    pollingInterval: 60000, // 1分钟轮询一次
    debug: true,
    // 使用正则表达式排除常见的第三方库和CDN资源
    excludeScripts: /(https?:\/\/(cdn|unpkg|jsdelivr)\.com\/|\/assets\/(vendor|libs)\/|\.hot-update\.js|\.map)$/,
    onDetected: () => {
      console.log('检测到应用脚本有更新');
    }
  };

  const notifier = createUpdateNotifier(options);
  console.log('已启动使用正则表达式排除脚本的更新检测');
  return notifier;
}

// 示例3：在微前端场景中使用排除功能
function exampleWithMicroFrontend() {
  const options = {
    pollingInterval: 120000, // 2分钟轮询一次
    debug: true,
    // 监控多个子应用
    indexPath: [
      '/',                // 主应用
      '/sub-app-1/index.html',  // 子应用1
      '/sub-app-2/index.html'   // 子应用2
    ],
    // 排除所有第三方库和共享依赖，只关注业务代码变化
    excludeScripts: [
      '/shared-libs/*.js',
      '/common/*.js',
      'https://cdn.example.com/vendors/*.js',
      '/**/polyfills.js',
      '/**/runtime-*.js'
    ],
    onDetected: (updatedPath) => {
      console.log(`检测到以下路径有更新: ${updatedPath}`);
    }
  };

  const notifier = createUpdateNotifier(options);
  console.log('已启动微前端场景下的更新检测');
  return notifier;
}

// 使用指南：
// 1. 对于第三方库、CDN资源和很少变化的脚本，建议将其排除在检测范围之外
// 2. 可以使用通配符 '*' 匹配任意字符序列，'?' 匹配单个字符
// 3. 对于复杂的匹配模式，正则表达式会更加灵活
// 4. 排除不相关的脚本可以减少误报，提高更新检测的准确性

// 实际应用时，选择适合你的示例取消注释并运行：
// const notifier1 = exampleWithStringArray();
// const notifier2 = exampleWithRegex();
// const notifier3 = exampleWithMicroFrontend();

// 注意：在生产环境中，建议禁用debug选项