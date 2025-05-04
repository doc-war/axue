//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { defaultIcons } from "../../default/icon.define.js"          //统一维护默认图标
export class HighLight extends LitElement { 
    static properties = {
        args:{type: Object} ,
        _icon:{type: String} ,  
        _type:{type: String} ,
    } 
    static styles = [
        ...shareStyles,  //注入样式
        css` 
            :host{
                display:block;
            }   
            .content{
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                word-wrap: break-word;
                overflow-wrap: break-word;
            }
            .info{
                background-color:#dff;
            }
            .warning{
                background-color:#ffd;
            }
            .success{
                background-color:#dfd;
            }
            .error{
                background-color:#fdd;
            }

        `
    ]
    
    constructor() {
        super();
        let example = {
            type:"info",
            // type:"error",
            // type:"warning",
            // type:"success",
            title:"info提示范例",      
            content:"你正在这样做，巴拉巴拉......",
            hasClose:true
        }
        if(!this.args){
            this.args=example
        }
    }
    
    render() {
        this._icon=defaultIcons.typeInfo
        this._type="info"
        if(this.args?.type=="error") {
            this._icon=defaultIcons.typeError
            this._type="error"
        }
        if(this.args?.type=="warning"){
            this._icon=defaultIcons.typeWarning
            this._type="warning"
        } 
        if(this.args?.type=="success") {
            this._icon=defaultIcons.typeSuccess
            this._type="success"
        }

        let close =nothing
        if(this.args?.hasClose) { 
            close =html`
                <div class="minIcon margin-right-10" @click=${this._close}>
                    <img alt="icon" class="minIcon nodrag" src=${defaultIcons.close} />
                </div>
            `;
        }
        
        return html`
            <div class ="border main content ${this._type??'info'}">
                <div class="flex-between">     
                    <div class="flex-left container ${this._type??'info'}">
                        <img alt="icon" class="minIcon nodrag" src=${this._icon} />
                        <div  class="margin-left-20 bold">${this.args?.title??this._type??"info"}</div>
                    </div>
                    ${close}
                </div>
                <div class="margin-left-50">     
                    ${this.args?.content}
                </div>
            </div>
        `
    }

    _close(e){
        this.remove()
    }
}
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.HighLight, HighLight);