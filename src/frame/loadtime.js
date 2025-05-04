import "./util.js"    //导入底层工具方法+注册常量，但是不需要导入default的API，因为后者是按需
import "./tagName.js" //导入默认标签


//读取配置
import { AxueCustomConfig } from "./customConfig.js" 

/**
* 注册标签define方法
*/


// 组件注册器（统一管理所有自定义组件：缓存、拷贝、防重、dom注册）
export class AxueElement {
    // 缓存所有待注册的组件
    static _axueWebComponents = {};
    static _isRegister = false;

    /**
     * 防止重复定义，避免因重复注册导致异常
     */
    static preventRepeatDefine(customTagName, Widget) {
        if (!customElements.get(customTagName)) {
            customElements.define(customTagName, Widget);
        } else {
            //已经拦截过重复dom注册了，还重复就是冲突了
            console.warn("[axue] 遭遇相同标签名的重复注册，建议排查是否存在命名污染！");
        }
    }

    /**
     * 框架标准预注册接口（缓存）
     * 允许延迟注册组件
     */
    static async preDefine(customTagName, Widget) {
        this._axueWebComponents[customTagName] = Widget;
    }

    /**
     * 初始化所有组件
     * 统一注册到浏览器自定义元素注册表
     */
    static domRegister() {
        console.info("axueDomRegister...");
        if(this._isRegister) {
            console.warn("[axue] 自定义标签已经注册过了，不建议重复调用初始化！");
            return;
        }
        this._isRegister = true; //标记注册完成
        for (const customTagName in this._axueWebComponents) {
            this.defineTag(customTagName, this._axueWebComponents[customTagName]);
        }
    }

    /**
     * 注册单个组件（支持标签名自定义）
     */
    static  defineTag(customTagName, Widget) {
        // 获取配置
        const _axueWebComponentsConfig =  AxueCustomConfig.getConfig();

        // 默认标签名前缀axue-
        let finalCustomTagName = "axue-" + customTagName;

        // 防止重复定义
        this.preventRepeatDefine(finalCustomTagName, Widget);

        if (!_axueWebComponentsConfig || !_axueWebComponentsConfig instanceof Object) {
            console.warn("[axue] 自定义配置格式非法，被忽略，请仔细阅读文档！");
            return;
        }

        // 优先支持自定义标签名映射
        if (
            _axueWebComponentsConfig.customTag &&  //存在
            _axueWebComponentsConfig.customTag instanceof Object &&     //对象类型
            _axueWebComponentsConfig.customTag[customTagName]       //有同名key
        ) {
            let customTagValue = _axueWebComponentsConfig.customTag[customTagName];
            if (customTagValue !== finalCustomTagName) {    //不完全相同
                this.clone(customTagValue, Widget);   //完成自定义注册，不再检查前缀
                // console.error("临时测试自定义标签：", customTagValue, Widget);
                return;
            }
        }

        // 其次支持自定义前缀
        if (
            _axueWebComponentsConfig.customTagPrefix &&                 //存在      
            _axueWebComponentsConfig.customTagPrefix !== "axue"       //不是默认前缀
        ) {
            let customTagValue = _axueWebComponentsConfig.customTagPrefix + "-" + customTagName;
            this.clone(customTagValue, Widget);
            // console.error("临时测试自定义前缀：", customTagValue, Widget);
        }
    }

    /**
     * 克隆注册，防止和默认名冲突，解决自定义标签名需求
     */
    static clone(customTagName, Widget) {
        // 继承原组件逻辑，保持组件内部不变
        let CustomElementClass = class extends Widget {
            constructor() {
                super();
            }
        };
        // 【新增】设置 class 名字，提升调试体验
        Object.defineProperty(CustomElementClass, 'name', { value: `${customTagName}Class` });
        this.preventRepeatDefine(customTagName, CustomElementClass);
    }
}

