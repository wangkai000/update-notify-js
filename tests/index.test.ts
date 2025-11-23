import { VersionUpdateNotifier } from '../src/index';

describe('VersionUpdateNotifier 简化测试', () => {
  // 在每个测试前重置全局模拟
  beforeEach(() => {
    // 清除所有现有的模拟
    jest.clearAllMocks();
    
    // 基本的浏览器API模拟
    global.window = {
      ...global.window,
      confirm: jest.fn(() => true),
      setTimeout: jest.fn((callback) => {
        if (typeof callback === 'function') {
          callback();
        }
        return 1;
      }),
      clearTimeout: jest.fn(),
      location: {
        reload: jest.fn()
      }
    } as any;
    
    global.document = {
      ...global.document,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      hidden: false,
    } as any;
    
    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue('<html><script src="/test.js"></script></html>')
    });
  });
  
  // 测试实例创建
  test('VersionUpdateNotifier可以被实例化', () => {
    expect(() => new VersionUpdateNotifier()).not.toThrow();
  });
  
  test('VersionUpdateNotifier接受不同的配置选项', () => {
    const optionsList = [
      { pollingInterval: 10000 },
      { indexPath: '/custom-index.html' },
      { scriptRegex: /script/ },
      { promptMessage: '有新版本！' },
      { notificationType: 'confirm' as const },
      { immediate: false },
      { pauseOnHidden: false },
    ];
    
    optionsList.forEach(options => {
      expect(() => new VersionUpdateNotifier(options)).not.toThrow();
    });
  });
  
  // 测试公共方法
  test('公共方法可以被安全调用', () => {
    const notifier = new VersionUpdateNotifier({ pollingInterval: null });
    
    // 确保所有公共方法都可以被调用
    expect(() => notifier.start()).not.toThrow();
    expect(() => notifier.stop()).not.toThrow();
    expect(() => notifier.reset()).not.toThrow();
  });
  
  // 异步方法测试
  test('异步方法不会抛出未捕获的异常', async () => {
    const notifier = new VersionUpdateNotifier({ pollingInterval: null });
    
    // 测试异步方法不会抛出未捕获的异常
    await expect(notifier.checkNow()).resolves.not.toThrow();
    await expect(notifier.checkUpdate()).resolves.not.toThrow();
  });
  
  // 回调函数测试
  test('回调函数配置有效', () => {
    const onUpdate = jest.fn(() => true);
    const onDetected = jest.fn();
    
    const notifier = new VersionUpdateNotifier({
      pollingInterval: null,
      onUpdate,
      onDetected
    });
    
    expect(notifier).toBeDefined();
  });
  
  // 边界情况测试
  test('重复调用方法不会导致错误', () => {
    const notifier = new VersionUpdateNotifier({ pollingInterval: null });
    
    // 测试重复调用
    expect(() => {
      notifier.start();
      notifier.start(); // 重复调用
      notifier.stop();
      notifier.stop(); // 重复调用
      notifier.reset();
      notifier.reset(); // 重复调用
    }).not.toThrow();
  });
});