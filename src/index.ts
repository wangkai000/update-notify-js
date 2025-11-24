/**
 * 版本更新检测配置选项
 * Version update detection configuration options
 */
export interface UpdateNotifierOptions {
  /** 
   * 轮询间隔时间，单位毫秒，默认 10000ms (10秒)
   * 设置为 null 或 0 则禁用自动轮询（需手动调用 checkUpdate）
   * Polling interval in milliseconds, default 10000ms (10 seconds)
   * Set to null or 0 to disable automatic polling (manual checkUpdate required)
   */
  pollingInterval?: number | null;
  /** 提示用户更新的方式，默认 'confirm' */
  /** Method to prompt user for update, default 'confirm' */
  notifyType?: 'confirm' | 'custom';
  /** 自定义提示函数，返回 true 表示确认刷新 */
  /** Custom prompt function, returns true to confirm refresh */
  onUpdate?: () => boolean | Promise<boolean>;
  /** 检测到更新时的回调 */
  /** Callback when update is detected */
  onDetected?: () => void;
  /** 是否在页面隐藏时暂停检测，默认 true（仅在自动轮询模式下有效） */
  /** Whether to pause detection when page is hidden, default true (only effective in auto polling mode) */
  pauseOnHidden?: boolean;
  /** 是否立即开始检测，默认 true（仅在自动轮询模式下有效） */
  /** Whether to start detection immediately, default true (only effective in auto polling mode) */
  immediate?: boolean;
  /** 自定义请求路径，支持单路径（字符串）或多路径（字符串数组，用于微前端场景），默认 '/' */
  /** Custom request path, supports single path (string) or multiple paths (string array, for micro-frontend scenarios), default '/' */
  indexPath?: string | string[];
  /** script 标签正则匹配，用于自定义匹配规则 */
  /** Regular expression for script tag matching, for custom matching rules */
  scriptRegex?: RegExp;
  /** 需要排除的脚本路径列表，支持字符串数组（支持glob模式）或正则表达式 */
  /** List of script paths to exclude, supports string array (with glob patterns) or regular expression */
  excludeScripts?: string[] | RegExp;
  /** 是否在控制台输出日志，默认 false */
  /** Whether to output logs to console, default false */
  debug?: boolean;
  /** 默认 confirm 提示文案（用于 notifyType='confirm'） */
  /** Default confirm prompt message (for notifyType='confirm') */
  promptMessage?: string;
  /** fetch 请求的缓存控制选项，默认 'no-cache' */
  /** Cache control option for fetch request, default 'no-cache' */
  cacheControl?: RequestCache;
}

/**
 * 版本更新检测配置选项（内部使用）
 * Version update detection configuration options (internal use)
 */
interface InternalOptions extends Omit<UpdateNotifierOptions, 'pollingInterval' | 'excludeScripts'> {
  pollingInterval: number;
  excludeScripts?: string[] | RegExp;
}

/**
 * 版本更新通知器类
 * Version update notifier class
 */
class VersionUpdateNotifier {
  private lastSrcs: string[] | null = null;
  private timerId: number | null = null;
  private isPageVisible: boolean = true;
  private isManualMode: boolean = false;
  
  private options: Required<InternalOptions>;
  private scriptReg: RegExp;
  private excludeScripts: string[] | RegExp | null = null;

  constructor(options: UpdateNotifierOptions = {}) {
    // 处理 pollingInterval 为 null 或 0 的情况
    // Handle cases where pollingInterval is null or 0
    const pollingInterval = options.pollingInterval === null || options.pollingInterval === 0 
      ? null 
      : (options.pollingInterval || 10000);

    this.isManualMode = pollingInterval === null;
    // Flag for manual mode vs auto polling mode

    this.options = {
      pollingInterval: pollingInterval || 10000,
      notifyType: options.notifyType || 'confirm',
      onUpdate: options.onUpdate || null!,
      onDetected: options.onDetected || (() => {}),
      pauseOnHidden: options.pauseOnHidden !== false,
      immediate: options.immediate !== false,
      indexPath: options.indexPath || '/',
      scriptRegex: options.scriptRegex || /\<script.*src=["'](?<src>[^"]+)/gm,
      excludeScripts: options.excludeScripts || undefined,
      debug: options.debug || false,
      promptMessage: options.promptMessage || '检测到新版本，点击确定将刷新页面并更新',
      cacheControl: options.cacheControl || 'no-cache'
    } as Required<InternalOptions>;

    this.scriptReg = this.options.scriptRegex;
    this.excludeScripts = this.options.excludeScripts || null;

    // 仅在自动轮询模式下设置页面可见性监听
    // Set up page visibility listener only in auto polling mode
    if (!this.isManualMode && this.options.pauseOnHidden) {
      this.setupVisibilityListener();
    }

    // 仅在自动轮询模式下且 immediate 为 true 时自动开始
    // Automatically start only in auto polling mode and when immediate is true
    if (!this.isManualMode && this.options.immediate) {
      this.start();
    }

    this.log(this.isManualMode ? '手动模式已启用，请使用 checkUpdate() 方法检测更新' : `自动轮询模式已启用，间隔: ${this.options.pollingInterval}ms`);
  }

  /**
   * 日志输出
   * Log output
   */
  private log(...args: any[]) {
    if (this.options.debug) {
      console.log('[VersionUpdateNotifier]', ...args);
    }
  }

  /**
   * 设置页面可见性监听
   * Set up page visibility listener
   */
  private setupVisibilityListener() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isPageVisible = !document.hidden;
        this.log('页面可见性变化:', this.isPageVisible ? '可见' : '隐藏');
        
        if (this.isPageVisible && !this.timerId) {
          this.log('页面恢复可见，重新开始检测');
          this.autoRefresh();
        }
      });
    }
  }

  /**
   * 获取最新页面中的 script 链接
   * Extract script links from the latest page(s)
   */
  private async extractNewScripts(): Promise<string[]> {
    try {
      // 处理单路径或多路径配置
      const paths = Array.isArray(this.options.indexPath) ? this.options.indexPath : [this.options.indexPath];
      
      // 存储所有路径提取的脚本
      const allScripts: string[] = [];
      
      // 遍历所有路径
      for (const path of paths) {
        const url = `${path}?timestamp=${Date.now()}`;
        this.log('请求URL:', url);
        
        try {
          const html = await fetch(url, {
            cache: this.options.cacheControl || 'no-cache'
          }).then(res => res.text());
          
          // 使用内部的extractNewScripts方法提取脚本
          const scripts = this.extractScriptsFromHtml(html, path);
          allScripts.push(...scripts);
        } catch (error) {
          console.error(`[VersionUpdateNotifier] 获取路径 ${path} 内容失败:`, error);
          // 继续尝试其他路径，不中断
        }
      }
      
      this.log('提取到的script列表:', allScripts);
      return allScripts;
    } catch (error) {
      console.error('[VersionUpdateNotifier] 脚本提取过程发生错误:', error);
      return [];
    }
  }
  
  /**
   * 从HTML文本中提取脚本src列表
   * @param html HTML文本
   * @param path 当前路径，用于标识脚本来源
   * @returns 脚本src列表
   */
  private extractScriptsFromHtml(html: string, path: string): string[] {
    // 重置正则下标
    this.scriptReg.lastIndex = 0;
    
    // 提取所有匹配的src
    const srcs: string[] = [];
    let match: RegExpExecArray | null;
    
    while ((match = this.scriptReg.exec(html)) !== null) {
      const src = match.groups?.src;
      if (src && !this.shouldExcludeScript(src)) {
        // 添加路径标识，避免不同路径下相同文件名的脚本冲突
        const scriptId = `${path}::${src}`;
        srcs.push(scriptId);
      }
    }
    
    return srcs;
  }
  
  /**
   * 检查脚本是否应该被排除
   * @param scriptPath 脚本路径
   * @returns 是否应该排除该脚本
   */
  private shouldExcludeScript(scriptPath: string): boolean {
    if (!this.excludeScripts) {
      return false;
    }
    
    if (this.excludeScripts instanceof RegExp) {
      return this.excludeScripts.test(scriptPath);
    }
    
    if (Array.isArray(this.excludeScripts)) {
      for (const pattern of this.excludeScripts) {
        // 简单的glob匹配实现
        if (this.matchGlob(pattern, scriptPath)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * 简单的glob模式匹配
   * @param pattern glob模式
   * @param str 要匹配的字符串
   * @returns 是否匹配
   */
  private matchGlob(pattern: string, str: string): boolean {
    // 将glob模式转换为正则表达式
    // 简单实现，支持 * 和 ? 通配符
    const regexPattern = pattern
      .replace(/\./g, '\\.') // 转义点号
      .replace(/\*/g, '.*')   // 将 * 替换为 .*
      .replace(/\?/g, '.');   // 将 ? 替换为 .
    
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(str);
  }

  /**
   * 对比是否有更新
   * Compare to check for updates
   */
  private async needUpdate(): Promise<boolean> {
    const newScripts = await this.extractNewScripts();
    
    if (!this.lastSrcs) {
      this.lastSrcs = newScripts;
      this.log('首次记录script列表');
      return false;
    }

    let result = false;

    // 数量不同，说明有更新
     // Different count means there are updates
    if (this.lastSrcs.length !== newScripts.length) {
      this.log('script数量变化:', this.lastSrcs.length, '->', newScripts.length);
      result = true;
    } else {
      // 逐个对比
    // Compare one by one
      for (let i = 0; i < newScripts.length; i++) {
        if (this.lastSrcs[i] !== newScripts[i]) {
          this.log('script变化:', this.lastSrcs[i], '->', newScripts[i]);
          result = true;
          break;
        }
      }
    }

    this.lastSrcs = newScripts;
    return result;
  }

  /**
   * 自动刷新检测
   * Auto refresh detection
   */
  private async autoRefresh() {
    // 如果页面不可见且配置了暂停检测，则不执行
    // If page is not visible and pause on hidden is configured, do not execute
    if (this.options.pauseOnHidden && !this.isPageVisible) {
      this.log('页面不可见，暂停检测');
      this.timerId = null;
      return;
    }

    this.timerId = window.setTimeout(async () => {
      const willUpdate = await this.needUpdate();
      
      if (willUpdate) {
        this.log('检测到版本更新');
        
        // 触发检测到更新的回调
        // Trigger update detected callback
        if (this.options.onDetected) {
          this.options.onDetected();
        }

        let shouldReload = false;

        // 根据配置的通知类型处理
        // Handle according to configured notification type
        if (this.options.notifyType === 'custom' && this.options.onUpdate) {
          shouldReload = await this.options.onUpdate();
        } else {
          // 默认使用 confirm 提示
          // Default to using confirm prompt
          shouldReload = confirm(this.options.promptMessage);
        }

        if (shouldReload) {
          this.log('用户确认刷新，即将重载页面');
          location.reload();
          return; // 不再继续轮询
        } else {
          this.log('用户取消刷新');
        }
      }

      // 继续下一轮检测
        // Continue next round of detection
      this.autoRefresh();
    }, this.options.pollingInterval);
  }

  /**
   * 开始检测
   * Start detection
   */
  public start() {
    this.log('开始版本更新检测');
    if (this.timerId) {
      this.log('检测已在运行中');
      return;
    }
    this.autoRefresh();
  }

  /**
   * 停止检测
   * Stop detection
   */
  public stop() {
    this.log('停止版本更新检测');
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * 手动触发一次检测（不显示提示，仅返回是否有更新）
   * @returns 返回是否检测到更新
   * Manually trigger a detection (no prompt, only returns whether update is detected)
   * @returns Whether an update was detected
   */
  public async checkNow(): Promise<boolean> {
    this.log('手动触发检测（静默模式）');
    return await this.needUpdate();
  }

  /**
   * 手动检测并提示用户更新
   * 适用于完全手动控制的场景，会显示更新提示并根据用户选择刷新页面
   * @returns 返回是否检测到更新
   * Manually detect and prompt user for update
   * Suitable for fully manually controlled scenarios, shows update prompt and refreshes page based on user selection
   * @returns Whether an update was detected
   */
  public async checkUpdate(): Promise<boolean> {
    this.log('手动检测更新并提示');
    const hasUpdate = await this.needUpdate();
    
    if (hasUpdate) {
      this.log('检测到版本更新');
      
      // 触发检测到更新的回调
      if (this.options.onDetected) {
        this.options.onDetected();
      }

      let shouldReload = false;

      // 根据配置的通知类型处理
      if (this.options.notifyType === 'custom' && this.options.onUpdate) {
        shouldReload = await this.options.onUpdate();
      } else {
        // 默认使用 confirm 提示
        shouldReload = confirm(this.options.promptMessage);
      }

      if (shouldReload) {
        this.log('用户确认刷新，即将重载页面');
        location.reload();
      } else {
        this.log('用户取消刷新');
      }
    }
    
    return hasUpdate;
  }

  /**
   * 重置状态
   * Reset status
   */
  public reset() {
    this.log('重置状态');
    this.lastSrcs = null;
    this.stop();
  }
}

/**
 * 创建一个版本更新检测器实例
 * Create a version update detector instance
 */
export function createUpdateNotifier(options?: UpdateNotifierOptions): VersionUpdateNotifier {
  return new VersionUpdateNotifier(options);
}

// 导出类，方便 TypeScript 用户使用类型
// Export class for TypeScript users to use types
export { VersionUpdateNotifier };

export default VersionUpdateNotifier;
