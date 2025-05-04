import {AxueEventDispatcher}from "./event.js" //事件分发器
import defaultIcons from "./icon.js"  //默认图标
/**
* 导入样式变量备用
*/
import pcStyle from "./pc.style.js"
import mobileStyle from "./mobile.style.js"

/*
 配置管理器（用于管理运行时配置，确保初始化图标、样式等）
 1、不能走loadConfig，loadConfig是编译时的路径，运行时会报错
 2、不能走import()，因为编译时会报错，运行时也会报错
 3、只能走URL，编译时会报错，运行时不会报错
*/
export class AxueCustomConfig {
    // 首次获取配置一定是某个组件正式注册时触发的。
    static _firstGetConfig = true;
    // 缓存
    static _axueWebComponentsConfig;
    /**
     * 获取运行时配置
     * 注意，由于import()的异步特性，其他方法调用此包装方法，要增加await和async
     */
    static  getConfig() {
        let config = this._axueWebComponentsConfig;
        // 如果存在则返回缓存，否则检查全局变量
        if (this._axueWebComponentsConfig && this._axueWebComponentsConfig instanceof Object) {
            config =  this._axueWebComponentsConfig;
        } else {
            //如果没有，就从全局对象中获取配置，这是开发者可以直接运行时注入的。
            // 但注意，编译时可不行，import会先于赋值执行，得借助setConfig
            if (globalThis.axueWebComponentsConfig && globalThis.axueWebComponentsConfig instanceof Object) {
                config = this._axueWebComponentsConfig = globalThis.axueWebComponentsConfig;
            } else {
                config =this._axueWebComponentsConfig = {};
            }
        }
        if (this._firstGetConfig) {
            this._firstGetConfig = false; // 只执行一次
            console.log("[axue] 当前运行时配置：", this._axueWebComponentsConfig);
            // 重新处理图标和样式初始化
            AxueCustomStyle.initIConAndStyle()
        }
        // 返回配置
        return this._axueWebComponentsConfig;
    }
    static  setConfig(config) {
        // 检查配置合法性
        if (config && config instanceof Object) {
            this._axueWebComponentsConfig = config;
        } else {
            this._axueWebComponentsConfig = {};
        }
        // 触发配置变更事件，供组件监听
        AxueEventDispatcher.dispatchConfigEvent(this._axueWebComponentsConfig);
        // 重新处理图标和样式初始化
        AxueCustomStyle.initIConAndStyle()
    }
    
}

// 样式管理器（统一处理主题样式变量）
class AxueCustomStyle {
    static  initIConAndStyle() {
        AxueCustomIcon.initIcons();
        AxueCustomStyle.initCss();
    }
    /**
     * 导入时完成注册css
     * 没有采取import样式文件，因为css是vite等编译时支持，并非原生。
     * 如果是使用pc.css文件形式维护，则应该采用动态加载
     */
    static  initCss() {
        // 默认采用pc样式
        let themeStyleVar = Object.assign({}, pcStyle);

        // 获取运行时配置
        const _axueConfig = AxueCustomConfig.getConfig();

        // 先排除非法配置
        if (
            !_axueConfig ||
            !_axueConfig instanceof Object ||
            (
                !_axueConfig.styleMode &&
                !_axueConfig.customStyle
            )
        ) {
            console.warn("[axue] 当前未指定模式也未自定义样式，采用的是默认的pc样式主题");
        } else {
            // 检查是否是mobile模式
            if (_axueConfig.styleMode === 'mobile') {
                themeStyleVar = Object.assign({}, mobileStyle);
                console.warn("[axue] 当前指定了mobile样式主题。^^未经过测试，暂只支持pc呢");
            }

            // 检查是否有自定义样式变量
            if (_axueConfig.customStyle && _axueConfig.customStyle instanceof Object) {
                for (let varkey in _axueConfig.customStyle) {
                    let value = _axueConfig.customStyle[varkey];
                    // 处理变量名，剔除前缀--
                    if (varkey.startsWith("--")) {
                        varkey = varkey.substring(2);
                    }
                    // 检查变量是否存在于主题中
                    if (varkey in themeStyleVar) {
                        themeStyleVar[varkey] = value;
                    } else {
                        console.warn("[axue] 当前指定要覆盖的样式变量并不存在，请检查是否拼写错误：", varkey);
                    }
                }
            }
        }

        // 最后注入到页面中
        let styleString = ":root {";
        Object.keys(themeStyleVar).forEach((varKey) => {
            styleString += `--${varKey}: ${themeStyleVar[varKey]};`;
        });
        styleString += "}";

        // 先查找有没有已经存在的 style 标签
        const styleTagId = "axue-root-style"; // 给自己加一个固定id
        let styleTag = document.getElementById(styleTagId);

        if (!styleTag) {
            // 如果不存在，创建一个新的 style 标签
            styleTag = document.createElement("style");
            styleTag.id = styleTagId;
            document.head.appendChild(styleTag);
        }

        // 更新 style 内容
        styleTag.textContent = styleString;

    }
}

// 图标管理器（统一管理自定义图标）
class AxueCustomIcon {
    /**
     * 导入图片，并最终挂载到globalThis上
     * 在第一次调用时进行配置
     */
    static  initIcons() {
        // 初始化有效自定义图标列表
        let icons = {};

        // 获取运行时配置
        const _axueConfig =  AxueCustomConfig.getConfig();

        // 先排除非法配置
        if (
            !_axueConfig ||
            !_axueConfig instanceof Object ||
            (
                !_axueConfig.customIconStyle &&
                !_axueConfig.customIcon
            )
        ) {
            // 忽略，无需处理
        } else {
            // 检查自定义图标配置
            if (
                _axueConfig?.customIcon &&
                _axueConfig.customIcon instanceof Object
            ) {
                Object.keys(_axueConfig.customIcon).forEach((iconKey) => {
                    // 只有存在于默认图标库的才允许覆盖
                    if (defaultIcons[iconKey]) {
                        icons[iconKey] = _axueConfig.customIcon[iconKey];
                    } else {
                        console.error("[axue] 指定覆盖的图标名不存在，可能不符合预期：", iconKey);
                    }
                });
            }
        }

        // 最后统一挂载到全局对象上，供组件借助getCustomIcons间接使用
        globalThis.axueWebComponentsCustomIconsConfig = icons;
    }
}



/**
 * 处理自定义配置
 * 强行追加import面向编译前，import()可以绕开运行时不存在的问题，但不能绕开编译时不存在的问题
 * new URL可以拿到编译后的地址，但不解决编译过关问题
 * /能定位到根目录，但指向的是编译后的根目录，但文件没考过去，也没进public
 * ./又能定位编译前的目录实现拷贝，但不能定位到编译后的根目录，断档
 * 死锁
 */  
// import { fileURLToPath } from 'url';
// import { resolve } from 'path';

//加载配置
// async function loadConfig() {
//     //异步加载仍然可能带来空节点边界，最好是走配置库
//     // import customConfig from '../../axue.config'
//     // (async () => {
//     //     console.error('自定义配置：',customConfig)
//     //     await import('axue');
//     // })();



//     //先检查是否存在api注入
    
//     // try {
//     //     const ConfigAPIModulePath = './node_modules/axue/dist/axueConfig.js';
  
//     //     console.error("[axue] 自定义配置模块路径",currentFileURL,ConfigAPIModulePath);

//     //     // let ConfigAPIModulePath= '/axueConfig.js';    //项目根
//     //     const ConfigAPIModule =  await ( await import(ConfigAPIModulePath)); 
//     //     let getConfig = ConfigAPIModule.default; 
//     //     let internalConfig = getConfig()
//     //     if(internalConfig){
//     //         console.debug("[axue] 定义了自定义配置",internalConfig);
//     //         return internalConfig
//     //     }else{
//     //         console.debug("[axue] 未定义自定义配置：null");
//     //     }
//     // } catch (error) {
//     //     // 如果加载失败，仍然使用默认配置
//     //     console.error("[axue] 未读取到axueConfig.js",error);    //es语法正常捕捉不到错误，就是空
//     // }

//     //再补漏检查是否存在dist根文件
//     const configUrl = './axue.config.js'; 
//     var configFilePath = (function() {
//         var url = new URL(configUrl, window.location.href); //根目录文件，可惜被摇掉了
//         // console.error("loadurl",url,window.location)
//         return  url;
//     })();
//     try {
//         // 动态导入配置模块并使用 await 等待加载完成
//         //要以变量的形式传递，否则import()方法会在编译过程直接求值，导致崩溃

//        const configModule =  await ( await import(configFilePath)); 

//         globalThis.axueWebComponentsConfig = configModule.default; 
//         console.debug("[axue] 启用自定义配置",configModule.default);
//         return configModule.default
//     } catch (error) {
//         // 如果加载失败，仍然使用默认配置
//         console.debug("[axue] 未启用自定义配置",error);    //es语法正常捕捉不到错误，就是空
//         return null
//     }
// }
// export { loadConfig }