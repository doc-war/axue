//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { defaultIcons,getCustomIcons } from "../../default/icon.define.js"          //统一维护默认图标
import {axueFrameZIndex} from "../../frame/util.js"
export class Tip extends LitElement { 
    static properties = {
        args:{type: Object} ,
        _icon:{type: String} ,
    } 

    static styles = [
        ...shareStyles,  //注入样式
        css`    
            .content{
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);    /**偏移到中间 */
                background-color: var(--bgColor,white);
                color: black;
                padding: 10px;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                z-index:${axueFrameZIndex.tip};     /** 层级模型的最高级 */

                /**启动topIn动画 */
                min-width:100px;
                max-width:400px;
                word-wrap: break-word;
                overflow-wrap: break-word;

                /**配置垂直靠上 */
                align-items: flex-start;
            }
        `
    ]
    
    constructor() {
        super();
    }
    
    render() {
        // console.error("tip测试",customIcon)
        this._icon=getCustomIcons().logo??defaultIcons.logo
        if(this.args.icon=="error") this._icon=getCustomIcons().typeError??defaultIcons.typeError
        if(this.args.icon=="warning") this._icon=getCustomIcons().typeWarning??defaultIcons.typeWarning
        if(this.args.icon=="success") this._icon=getCustomIcons().typeSuccess??defaultIcons.typeSuccess
        if(this.args.icon=="info") this._icon=getCustomIcons().typeInfo??defaultIcons.typeInfo

        return html`       
            <div class="flex-left container content topIn" style=${this.args?.backgroundColor ?'background-color:'+this.args.backgroundColor :''} >
                <img alt="icon" class="minIcon nodrag" src=${this._icon} />
                <div  class="margin-left-20">${this.args?.message}</div>
            </div>
        `
    }
}
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.Tip, Tip);