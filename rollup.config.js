const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const dts = require('rollup-plugin-dts').default;
const { readFileSync } = require('fs');

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/**
 * @esengine/pathfinding v${pkg.version}
 * 高性能寻路算法库 - 支持A*、广度优先等算法，适用于Cocos Creator、Laya等游戏引擎
 * 
 * @author ${pkg.author}
 * @license ${pkg.license}
 */`;

const external = [];

const commonPlugins = [
  resolve({
    browser: true,
    preferBuiltins: false
  }),
  commonjs({
    include: /node_modules/
  })
];

module.exports = [
  // 完整版本 ES模块构建
  {
    input: 'bin/index.js',
    output: {
      file: 'dist/pathfinding.mjs',
      format: 'es',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      ...commonPlugins
    ],
    external,
    context: 'globalThis',
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  },
  
  // 完整版本 CommonJS构建
  {
    input: 'bin/index.js',
    output: {
      file: 'dist/pathfinding.cjs',
      format: 'cjs',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      ...commonPlugins
    ],
    external,
    context: 'globalThis',
    treeshake: {
      moduleSideEffects: false
    }
  },

  // 完整版本 UMD构建（浏览器兼容）
  {
    input: 'bin/index.js',
    output: {
      file: 'dist/pathfinding.js',
      format: 'umd',
      name: 'Pathfinding',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      ...commonPlugins
    ],
    external: [],
    context: 'globalThis',
    treeshake: {
      moduleSideEffects: false
    }
  },
  
  // 类型定义构建
  {
    input: 'bin/index.d.ts',
    output: {
      file: 'dist/pathfinding.d.ts',
      format: 'es',
      banner: `/**
 * @esengine/pathfinding v${pkg.version}
 * TypeScript definitions
 */`
    },
    plugins: [
      dts({
        respectExternal: true
      })
    ],
    external: []
  }
];