import { defineConfig } from 'vite';

// Vite 配置
export default defineConfig({
  build: {
    minify:false,   //可以禁用，或者指定esbuild还是terser压缩
    assetsInlineLimit:5,   //默认4，小于4kb则会把资源内联转成base64 data url，直接写在代码里，但如果在publicDir内且启用拷贝，则不会内联处理
    lib: {
      entry: './src/index.js', // 入口文件
      name: 'Axue',          // UMD 全局变量名称,这样浏览器全局挂载模块的就是 window.Axue
      formats: ['es','umd'], // 生成 ESM、CJS 和 UMD 格式
      fileName: (format) =>
        format === 'es'
          ? 'axue.mjs'
          : 'axue.umd.js', // 为 UMD 格式定义文件名
    },
    rollupOptions: {
      // 可以在此处添加 Rollup 的额外配置
      external: ['cross-fetch'], // fetch不支持node环境,不打包 cross-fetch，使用外部依赖
      output: {
        // 强制模块的导出方式为“命名导出” (named exports)。以防止代码被混淆，保持清晰可读。否则require('ainiao')会报错
        exports: 'named',
        globals: {
          'cross-fetch': 'fetch', // 定义 UMD 文件中 cross-fetch 的全局变量映射，让浏览器中使用原生 fetch
        },
      },
    },
    terserOptions: {
    // compress: {
    //   drop_console: true, // 移除 console.log
    //   drop_debugger: true, // 移除 debugger
    // },
    format: {
      comments: false, // 不生成注释
    },
  },
  },
});


// build:{
//   minify:false,   //可以禁用，或者指定esbuild还是terser压缩
//   assetsInlineLimit:5,   //默认4，小于4kb则会把资源内联转成base64 data url，直接写在代码里，但如果在publicDir内且启用拷贝，则不会内联处理
//   lib: {    //指定构建成库，能输出多种格式，但这只是一种相对input的简化构建方式，不支持全量、单独等多级导出，放弃
//     entry: resolve(__dirname, 'src/index.js'),     // 入口文件，如果要支持d.ts类型提醒,则相对麻烦一点
//     name:"axue",
//     formats: ['es'], // 设置输出格式['es',"umd"]
//     fileName: (format,entryName) => `index.js`,   //index可以避免业务层vite找不准入口，原因未知
//     // fileName: (format,entryName) => `${entryName}.${format}.js`,
//   },
//   terserOptions: {
//     // compress: {
//     //   drop_console: true, // 移除 console.log
//     //   drop_debugger: true, // 移除 debugger
//     // },
//     format: {
//       comments: false, // 不生成注释
//     },
//   },
// }
// });