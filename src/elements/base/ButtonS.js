//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { defaultIcons } from "../../default/icon.define.js"          //统一维护默认图标


//需求存疑，最多解决了间隔统一问题
export class ButtonS extends LitElement { 
    static properties = {
        args:{type: Object} 
    } 
    static styles = [
        ...shareStyles,          //注入样式
        // css`   
        //     .label-title{
        //         font-size:16px;
        //         font-weight:800;
        //     }
        //     .label-marker{
        //         font-size:12px;
        //         color:var(--assistColor,#999);
        //     }
        // `
    ]
    
    constructor() {
        super();
        let example=[
            {
                key:"1",
                value:"第一个按钮"
            },
            {
                key:"2",
                value:"第二个按钮"
            },
            {
                key:"3",
                value:"第三个按钮",
                type:"main",
                onClick:function(){}
            }
        ]
        if(!this.args){
            this.args=example
        }
    }
    
    render() {
        let buttons=[]
        for (const i of this.args) {
            /**与主题变量级是耦合的 */
            let typeClass="button"
            if(i.type=="main")typeClass="button-main"
            if(i.type=="cancel")typeClass="button-cancel"

            let button = html`
                <button class="cursor margin-left-20 ${typeClass}" data-key=${i.key??nothing}
                    @click=${i.onClick??nothing}>${i.value??"确定"}
                </button>
            `
            buttons.push(button)
        }
        return html`
            <div >
                ${buttons}
            </div>
        `;
    }
} 
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.ButtonS, ButtonS);
