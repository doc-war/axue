//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement,unsafeCSS } from 'lit';
//如果组件内部结构里用到，就导入
// import { mainStyles,commonStyles,scrollbarStyles } from "../../default/share.css.js"          //统一维护共享样式 
// import {axueFrameZIndex} from "../../frame/util.js"
import { defaultIcons,getCustomIcons } from "../../default/icon.define.js"          //统一维护默认图标
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
let defaultBackgroundColor = "#eeee"
//实际是隐藏模块
export class HiddenModule extends LitElement { 
    static properties = {
        args:{type:Object}
    }
    static styles = [
        ...shareStyles,
        css`
            :host{
                -webkit-app-region: drag;  
            }      
            .content{
                background-color:${unsafeCSS(defaultBackgroundColor)};
                min-width:300px;
                min-height:120px;
            }
        
        `
    ]
    
    constructor() {
        super();
        let example={
            isHiddenBorder:false,
            name:"子模块", 
            onClose:null,
            backgroundColor:defaultBackgroundColor,
            width:"500px",
        }

        //实际上API一定会传参
        if(!this.args){
            this.args=example
        }
        
    }
    
    /**
     * slot的一大问题是对内部结构的第一层子元素使用max-height:百分比值造成屏蔽。因为他已经是自适应了
     * 与logo-close一致
     */
    render() {
        return html`
            <div class="drag main center ${this.args?.isHiddenBorder ? '' : 'border'}" style="width:${this.args?.width??'500px'};background-color:${this.args?.backgroundColor??defaultBackgroundColor}">
                <div class="drag flex-between margin-bottom-30">
                    <div class="flex-left">
                        <img alt="logo" class="minLogo nodrag" src=${getCustomIcons().logo??defaultIcons.logo} />
                        <div class="label-title margin-left-5">${ this.args?.name ?? "子模块"}</div> 
                    </div>
                    <div class="flex-right">
                        <img alt="close" class="minIcon nodrag cursor" src=${getCustomIcons().close??defaultIcons.close} @click="${this._clickClose}" />
                    </div>
                </div>
                <!--分界线-->
                <div class="container  width-90-percent  nodrag" style="background-color:${this.args?.backgroundColor??defaultBackgroundColor}">
                    <slot name="slot"></slot>    
                </div>
            </div>
        `
    }

    _clickClose(e){
        /** 
         * 存疑问题，是不是需要先回调解除一切事件监听器？
         */ 
        
        /**
         * 处理回调
         */
        if( this.args?.onClose &&  typeof this.args?.onClose === 'function' ){
            this.args.onClose()
        }
        /**
         * 触发组件销毁
         */
        this.remove();
    }

} 
AxueElement.preDefine( defaultTagName.Module, HiddenModule);