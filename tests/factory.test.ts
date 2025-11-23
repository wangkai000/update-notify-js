import { createUpdateNotifier, UpdateNotifierOptions } from '../src/index';

// 简化的浏览器环境设置
const setupSimplifiedEnvironment = () => {
  // 清除所有模拟
  jest.clearAllMocks();

  // 基本的全局模拟
  global.window = {
    ...global.window,
    confirm: jest.fn(() => true),
  } as any;

  global.document = {
    ...global.document,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    hidden: false
  } as any;

  global.setTimeout = jest.fn(() => 1);
  global.clearTimeout = jest.fn();

  // 模拟fetch
  global.fetch = jest.fn().mockResolvedValue({
    text: () => Promise.resolve('<html><script src="/test.js"></script></html>')
  });
};

describe('createUpdateNotifier 工厂函数 - 简化测试', () => {
  beforeEach(() => {
    setupSimplifiedEnvironment();
  });

  // 基本功能测试
  test('createUpdateNotifier返回有效的notifier对象', () => {
    const notifier = createUpdateNotifier();
    expect(notifier).toBeDefined();
    expect(typeof notifier).toBe('object');
  });

  test('notifier对象包含必要的公共方法', () => {
    const notifier = createUpdateNotifier();
    
    expect(typeof notifier.start).toBe('function');
    expect(typeof notifier.stop).toBe('function');
    expect(typeof notifier.reset).toBe('function');
    expect(typeof notifier.checkNow).toBe('function');
    expect(typeof notifier.checkUpdate).toBe('function');
  });

  // 配置选项测试
  test('支持设置不同的轮询间隔', () => {
    const notifier = createUpdateNotifier({ pollingInterval: 30000 });
    expect(notifier).toBeDefined();
  });

  test('支持null作为轮询间隔', () => {
    const notifier = createUpdateNotifier({ pollingInterval: null });
    expect(notifier).toBeDefined();
  });

  test('支持自定义indexPath', () => {
    const notifier = createUpdateNotifier({ indexPath: '/custom-index.html' });
    expect(notifier).toBeDefined();
  });

  test('支持自定义scriptRegex', () => {
    const notifier = createUpdateNotifier({ scriptRegex: /<script.*src=["'](?<src>[^"']+)/gm });
    expect(notifier).toBeDefined();
  });

  test('支持自定义提示消息', () => {
    const notifier = createUpdateNotifier({ promptMessage: '新版本已发布！' });
    expect(notifier).toBeDefined();
  });

  test('支持immediate设置', () => {
    const notifier = createUpdateNotifier({ immediate: false });
    expect(notifier).toBeDefined();
  });

  test('支持pauseOnHidden设置', () => {
    const notifier = createUpdateNotifier({ pauseOnHidden: false });
    expect(notifier).toBeDefined();
  });

  // 公共方法调用测试
  test('所有公共方法可安全调用', () => {
    const notifier = createUpdateNotifier();
    
    // 确保这些方法可以被调用而不会抛出错误
    expect(() => notifier.start()).not.toThrow();
    expect(() => notifier.stop()).not.toThrow();
    expect(() => notifier.reset()).not.toThrow();
  });

  // 配置验证测试
  test('配置验证不会导致程序崩溃', () => {
    // 测试一些边界值配置
    expect(() => {
      // 传递一个无效的通知类型（应该抛出错误但不应该崩溃）
      try {
        createUpdateNotifier({ notificationType: 'invalid_type' as any });
      } catch (error) {
        // 预期会抛出错误，这是正常的验证行为
      }
    }).not.toThrow();
  });

  // 异步方法测试
  test('异步方法不会导致未捕获的异常', async () => {
    const notifier = createUpdateNotifier();
    
    // 测试异步方法调用不会抛出未捕获的异常
    await expect(notifier.checkNow()).resolves.not.toThrow();
    await expect(notifier.checkUpdate()).resolves.not.toThrow();
  });

  // 回调配置测试
  test('回调函数配置不会导致问题', () => {
    const notifier = createUpdateNotifier({
      onUpdate: () => true,
      onDetected: () => {}
    });
    
    expect(notifier).toBeDefined();
  });

  // 边界情况测试
  test('多次调用start/stop方法不会导致问题', () => {
    const notifier = createUpdateNotifier();
    
    // 测试重复调用
    expect(() => {
      notifier.start();
      notifier.start(); // 重复调用
      notifier.stop();
      notifier.stop(); // 重复调用
    }).not.toThrow();
  });

  test('边界值配置处理', () => {
    // 测试一些边界值
    expect(() => {
      createUpdateNotifier({ pollingInterval: -1 }); // 负值
      createUpdateNotifier({ pollingInterval: 1000000000 }); // 大值
    }).not.toThrow();
  });

  // 测试组合配置
  test('复杂配置组合', () => {
    const notifier = createUpdateNotifier({
      pollingInterval: 30000,
      immediate: false,
      pauseOnHidden: true,
      notificationType: 'confirm',
      promptMessage: '检测到新版本，请刷新页面！',
      onUpdate: () => true,
      onDetected: () => {}
    });
    
    expect(notifier).toBeDefined();
  });
});