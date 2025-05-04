//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { mainStyles,commonStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { defaultIcons } from "../../default/icon.define.js"          //统一维护默认图标

//鼠标悬停插槽
export class Slot extends LitElement { 
    static properties = {
        isHiddenBorder:{
            type: Boolean,
            value:false
        }   
    } 
    static styles = [
        mainStyles,  //注入样式
        commonStyles,
    ]
    
    constructor() {
        super();
    }
    
    render() {
        // console.log("isHiddenBorder：",this.isHiddenBorder)
        if(this.isHiddenBorder){     /**注意，是是否隐藏，而非是否显示，默认是false */
            return html`       
            <div>
                <slot name="slot"></slot>
            </div>
            `
        }else{
            return html`       
                <div class="container border" >
                    <slot name="slot"></slot>
                </div>
            `
        }
    }
}
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.Slot, Slot);