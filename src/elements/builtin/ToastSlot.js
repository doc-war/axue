//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import {defaultIcons,getCustomIcons} from "../../default/icon.define.js"          //统一维护默认图标
import {axueFrameZIndex} from "../../frame/util.js"
export class ToastSlot extends LitElement { 
    static properties = {
        args:{type: Object} ,
        _icon:{type: String} ,
    } 
    static styles = [
        ...shareStyles,  //注入样式
        css`        
            :host {
                display: block;
                position: fixed;   /**相对window窗口固定，不随稳当流 */
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: ${axueFrameZIndex.underSlot};    /** 遵循层级规范 */
            }
            .content{
                background-color: #fff;
                min-width:300px;
                min-height:120px;
            }
        `
    ]
    
    constructor() {
        super();
        let example={
          title:"标题",
          message:"这是一串主体内容文本",
          onConfirm:()=>{}
        }
        if(!this.args){
            this.args=example
        }
    }
    
    render() {
        this._icon=getCustomIcons().logo??defaultIcons.logo
        return html`
        <div class="container border middle content">
            <div class="main">
                <div class="flex-left">
                    <img alt="icon" class="minIcon nodrag" src=${this._icon} />
                    <div class="label-title margin-left-5">${this.args?.title}</div>
                </div>
                <p>${this.args?.message}</p>
                <div class="slotDiv">
                    <slot name="slot" ></slot>
                </div>
                <div class="flex-right main">
                    ${this.args?.isShowCancel ? html`<button class="button-cancel" @click="${this._cancel}">${this.args?.cancelText??"取消"}</button>` :nothing}
                    <button class="button-main margin-left-20" @click="${this._confirm}">${this.args?.confirmText??"确定"}</button>
                </div>
            </div>
        </div>
    `;
    }

    _cancel(e){
        if (this.args?.onCancel && typeof this.args?.onCancel === 'function') {
            this.args.onCancel();
        }
    }
    _confirm(e){
        if (this.args?.onConfirm && typeof this.args?.onConfirm === 'function') {
            this.args.onConfirm();
        }
    }
} 
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.ToastSlot, ToastSlot);
