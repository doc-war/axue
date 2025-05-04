//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { defaultIcons,getCustomIcons } from "../../default/icon.define.js"          //统一维护默认图标

class LogoClose extends LitElement { 
    static properties = {
        args:{type: Object} ,
    } 

    static styles = [
        ...shareStyles,          //注入样式
    ]
    
    constructor() {
        super();
        // let example={
        //   logo:null,
        //   title:"标题",
        //   close:null,
        //   labelMarker:"备注"
        // }
        // if(!this.args){
        //     this.args=example
        // }
    }
    
    
    render() {
        return html`
        <div class="main">
            <div class="drag flex-between ">
                <div class="flex-left">
                    <img alt="logo" class="minLogo nodrag" src=${this.args?.logo??getCustomIcons().logo??defaultIcons.logo}  @dblclick=${this._dbclickLogo}/>
                    <div class="label-title margin-left-5">${this.args?.name}</div> 
                </div>
                <div class="flex-right ">
                    <div class="label-marker margin-right-5">${this.args?.marker}</div> 
                    <img alt="close" class="minIcon nodrag cursor" src=${this.args?.close??getCustomIcons().close??defaultIcons.close} @click="${this._clickClose}" />
                </div>
            </div>
        <div>
    `;
    }
    _clickClose(e){
        const event = new Event('click-close', {composed: true});
        this.dispatchEvent(event);
    }
    _dbclickLogo(e){
        const event = new Event('dbclick-logo', {composed: true});
        this.dispatchEvent(event);
    }
} 
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.LogoClose, LogoClose);
