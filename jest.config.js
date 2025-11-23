/**
 * Jest 配置文件
 */

module.exports = {
  // 设置测试环境为 JSDOM，模拟浏览器环境
  testEnvironment: 'jsdom',
  
  // 使用 ts-jest 转换器处理 TypeScript 文件
  preset: 'ts-jest',
  
  // 模块名称映射，处理别名和路径解析
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // 测试文件匹配规则
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/src/**/*.test.ts',
  ],
  
  // 忽略的文件
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  
  // 收集覆盖率信息的目录
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  
  // 覆盖率报告配置
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
  
  // 覆盖率报告格式
  coverageReporters: [
    'text',
    'lcov',
  ],
  
  // 模块文件扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // 运行测试前的准备工作
  setupFilesAfterEnv: [],
  
  // 是否显示测试结果的详细信息
  verbose: true,
  
  // 是否使用缓存来加速测试执行
  cacheDirectory: '.jest/cache',
};