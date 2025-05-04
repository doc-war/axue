import {axueDefaultIcon} from "../frame/icon"
export const defaultIcons= axueDefaultIcon??{}   //总共也没几个图标，这里统一导出
// Object.freeze(defaultIcons);   //冻结，避免运行时修改

//由事件挂载,组件会将该方法转成表达式监听，最终自动更新
export function getCustomIcons(){
    let customIcon = globalThis.axueWebComponentsCustomIconsConfig
    if( customIcon && customIcon instanceof Object) {
        return customIcon
    }else{
        return {}
    }
}