import { initAxueNodeAndFrameFunc } from '../frame/util.js' 

// 创建一个API类，延迟加载实际实现

class LazyLoadedAPI {
  constructor() {
    this._implementation = null;
    this._loading = false;    // 标记是否正在加载实现模块，但暂时没用途
    this._loadPromise = null;
  }

  // 确保实现模块被加载
  async _ensureImplementation() {
    // 如果已经加载了实现模块，直接返回
    if (this._implementation) {
      return this._implementation;
    }
    // 如果正在加载实现模块，等待加载完成
    if (!this._loadPromise) {
      this._loading = true;
      this._loadPromise = new Promise(async (resolve) => {
        try {
          // 进行基础的浏览器容器节点和全局函数注册
          initAxueNodeAndFrameFunc()
          // 动态导入实现模块
          const module = await import('./apiImplementation.js');
          this._implementation = module;
          resolve(this._implementation);
        } catch (error) {
          console.error('无法加载框架API模块:', error); // 打印错误，并说明后果
          // 提供一个最简空实现：一个对象，每个 API 入口对应一个空对象
          // 这样 Proxy 访问 instance[prop] 时，instance 是个空对象，instance[prop] 始终是 undefined
          this._implementation = {
            showTip: {}, // 空对象
            showPage: {}, // 空对象
            showSlot: {}, // 空对象
            showPropertyBar: {}, // 空对象
            showToast: {}, // 空对象
            showEdit: {}, // 空对象
            showModule: {} // 空对象
          };
          resolve(this._implementation);
        } finally {
          this._loading = false;
        }
      });
    }

    return this._loadPromise;
  }

  // 返回类实例，而不是直接调用方法
  async showTip() {
    const impl = await this._ensureImplementation();
    return impl.showTip; // 返回 showTip 的类实例
  }

  async showPage() {
    const impl = await this._ensureImplementation();
    return impl.showPage;
  }

  async showSlot() {
    const impl = await this._ensureImplementation();
    return impl.showSlot;
  }

  async showPropertyBar() {
    const impl = await this._ensureImplementation();
    return impl.showPropertyBar;
  }

  async showToast() {
    const impl = await this._ensureImplementation();
    return impl.showToast;
  }

  async showEdit() {
    const impl = await this._ensureImplementation();
    return impl.showEdit;
  }

  async showModule() {
    const impl = await this._ensureImplementation();
    return impl.showModule;
  }

  static isBrowserEnvironment() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
}

// 创建标准API接口
const axueAPI = new LazyLoadedAPI();  //实例化不会实际执行实现，只是空对象

/*
延迟绑定方法调用。目的：懒加载 + 自动解包方法
  showTip 本身是个“壳子”，你可以像使用普通对象那样调用其内部方法。
  1、他不会提前加载实现模块，只有在调用时才会加载
  2、axueAPI.showTip对应的是async函数，这个过程await this._ensureImplementation();会加载实现模块
*/



// 创建一个 Proxy 对象并导出，代理一个空对象 {}
export const showTip = new Proxy({}, {
  // 拦截属性访问，例如 showTip.open、showTip.close 等
  get: (_, prop) => {
    // 返回一个 async 函数，用户调用时会触发它，透传参数
    return async (...args) => {
      const instance = await axueAPI.showTip(); // 等待加载真实实例,instance 在加载失败时是 {}来容错
      const fn = instance[prop];                // 获取目标方法或属性，如send、info方法
      return typeof fn === 'function'
        ? fn.apply(instance, args)              // 若是函数则调用（绑定 this）
        : fn;                                   // 否则直接返回属性值，或者undefined
    };
  },
});


export const showPage = new Proxy({}, {
  get: (_, prop) => {
    return async (...args) => {
      const instance = await axueAPI.showPage(); 
      const fn = instance[prop];                
      return typeof fn === 'function'
        ? fn.apply(instance, args)              
        : fn;                              
    };
  },
});

export const showSlot = new Proxy({}, {
  get: (_, prop) => {
    return async (...args) => {
      const instance = await axueAPI.showSlot(); 
      const fn = instance[prop];                
      return typeof fn === 'function'
        ? fn.apply(instance, args)              
        : fn;                              
    };
  },
});

export const showPropertyBar = new Proxy({}, { 
  get: (_, prop) => {
    return async (...args) => {
      const instance = await axueAPI.showPropertyBar(); 
      const fn = instance[prop];                
      return typeof fn === 'function'
        ? fn.apply(instance, args)              
        : fn;                              
    };
  },
});


export const showToast = new Proxy({}, {
  get: (_, prop) => {
    return async (...args) => {
      const instance = await axueAPI.showToast(); 
      const fn = instance[prop];                
      return typeof fn === 'function'
        ? fn.apply(instance, args)              
        : fn;                              
    };
  },
});

export const showEdit = new Proxy({}, {
  get: (_, prop) => {
    return async (...args) => {
      const instance = await axueAPI.showEdit(); 
      const fn = instance[prop];                
      return typeof fn === 'function'
        ? fn.apply(instance, args)              
        : fn;                              
    };
  }

});

export const showModule = new Proxy({}, {
  get: (_, prop) => {
    return async (...args) => {
      const instance = await axueAPI.showModule(); 
      const fn = instance[prop];                
      return typeof fn === 'function'
        ? fn.apply(instance, args)              
        : fn;                              
    };
  },
});




/**
    * 使用示例
    import { showTip } from 'axue';
    await showTip.send('xxx');  或者  showTip.send('xxx'); 
 */