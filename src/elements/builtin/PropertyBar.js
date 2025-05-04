//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { defaultIcons,getCustomIcons } from "../../default/icon.define.js"         //统一维护默认图标

//鼠标悬停插槽
export class PropertyBar extends LitElement { 
    static properties = {
        close: { type: Function }, // close 方法作为属性，由API传入
        args: { type: Object }, // 传入的参数对象，主要是title、slot、paddingTop（用于设置距离顶部的距离）
    } 
    static state = {
        _customClose:{type:String}
    }
    static styles = [
        shareStyles,  //注入样式
        css`
            :host {
                position: fixed;
                top: 0; 
                right: 0;
                height: 100%;
                min-width: 200px;
                max-width:500px;
                width:25%;
                background-color: rgba(255, 255, 255, 0.9);
                box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);

                /**使用右侧进入 */
                animation: rightIn 0.1s ease-in-out;
            }

            @keyframes rightIn {    
                from {
                    transform: translateX(100%) translateY(0);
                    opacity: 1;
                }
                to {
                    
                    transform: translateX(0) translateY(0);
                    opacity: 1;
                }
            }
            @keyframes rightOut {    
                from {
                    
                    transform: translateX(0) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%) translateY(0);
                    opacity: 1;
                }
            }
            .color{
                color:var(--brandColor,cornflowerblue)
            }
        `
    ]
    
    constructor() {
        super();
    }

    // 计算 paddingTop 的函数
    getPaddingTop() {
        const paddingTop = this.args?.paddingTop;
        if (typeof paddingTop === 'number') {
            return `${paddingTop}px`;
        }
        if (typeof paddingTop === 'string' && !paddingTop.includes('px') && !paddingTop.includes('em') && !paddingTop.includes('%')) {
            return `${paddingTop}px`; // 如果是字符串但没有单位，默认加 px
        }
        return paddingTop || '0px'; // 其他情况直接使用传入的值或者默认值
    }

    // <!-- 外部用<div slot="slot">${slot}</div>来插入 -->
    render() {
        return html`
            <div class="main-gradient" style="width:100%;box-sizing:border-box;padding-top:${this.getPaddingTop()};">
                <div class="flex-between margin-bottom-20">
                    <div class="flex-left">
                        <div class="label-title color" title="右击可快捷关闭">${this.args?.title}</div> 
                    </div>
                    <div class="flex-right">
                        <img alt="close" class="minIcon nodrag" src=${this.args?.close??getCustomIcons().close??defaultIcons.close} @click="${this._clickClose}" title="右击可快捷关闭"/>
                    </div>
                </div>
                <slot name="slot"></slot>
            </div>
        `
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('axueWebComponentsConfigChanged', (event) => this.handleAxueWebComponentsConfigChanged(event));
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('axueWebComponentsConfigChanged', (event) => this.handleAxueWebComponentsConfigChanged(event));
    }
    
    handleAxueWebComponentsConfigChanged(event) {
        //自定义修正
        const customIcon = event.detail.customIcon;
        this._customClose=customIcon.close
        // 手动触发组件重新渲染
        this.requestUpdate();
    }
    _clickClose() {
        if (this.close) {
            this.close();  // 调用传入的 close 方法
        }
    }
}
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.PropertyBar, PropertyBar);