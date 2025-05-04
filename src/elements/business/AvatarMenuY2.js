//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, render, nothing} from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { defaultIcons,getCustomIcons } from "../../default/icon.define.js"          //统一维护默认图标
import "../base/MenuY2.js"
import { showSlot } from "../../default/apiImplementation.js"
export class AvatarMenuY2 extends LitElement { 
    static properties = {
        args:{type: Object} ,
    } 

    static styles = [
        ...shareStyles,          //注入样式
    ]
    
    constructor() {
        super();
        let example={
            avatar:{
                hoverText:"头像菜单",
            },
            menus:[{
                label:"主页",   //长度自己控制
                hover:"<div>hover字符串<2>",
               //  icon:logo,
                onClick:function (){
                    //...
                    console.log("MenuY2内部测试onClick事件，无回参。")
                }
           },{
            label:"——分隔符——",
          }]
        }
        if(!this.args){
            this.args=example
        }
    }
    
    render() {
        return html`
            <img
                class="avatar cursor"
                src=${this.args?.avatar?.image??getCustomIcons().avatar??defaultIcons.avatar}
                alt="avatar"
                @click=${this._openMenu}
                title=${this.args?.avatar?.hoverText??nothing}
            />
        `;
    }
    _openMenu(){
        let  litNode = html`<axue-menu-y2 .args=${this.args?.menus}></axue-menu-y2>`
        const container = document.createElement('div');   //创建,但不直接渲染，只用于挂载
        render(litNode, container);  //把lit模板渲染进容器，此时容器依然不渲染
        let example={
            slot:container,
            isHiddenBorder:true
        }
        showSlot.send(example)
    }

} 
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.AvatarMenuY2, AvatarMenuY2);
