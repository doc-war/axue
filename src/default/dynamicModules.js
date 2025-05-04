/**
 * 动态导入副作用依赖的的辅助函数
 * 1、支持按需加载
 * 2、避免重复导入。
 */

export  async function getLit() {
    // 使用一个简单的缓存，避免在多次调用时重复进行动态导入
    if (!globalThis._axueLitCache) {
        globalThis._axueLitCache = import('lit');
    }
    return globalThis._axueLitCache;
}

export async function getUnsafeHTML() {
     // 使用一个简单的缓存
    if (!globalThis._axueUnsafeHTMLCache) {
        globalThis._axueUnsafeHTMLCache = import('lit/directives/unsafe-html.js');
    }
    return globalThis._axueUnsafeHTMLCache;
}

export async function getAxueTip() {
    // 使用一个简单的缓存
   if (!globalThis._axueTipCache) {
       globalThis._axueTipCache = import('../elements/builtin/Tip');
   }
   return globalThis._axueTipCache;
}
