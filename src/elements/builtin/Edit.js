//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import { html, css, LitElement } from 'lit';
//如果组件内部结构里用到，就导入
import { mainStyles,commonStyles,scrollbarStyles } from "../../default/share.css.js"          //统一维护共享样式 
import {axueFrameZIndex} from "../../frame/util.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
export class Edit extends LitElement { 
    static properties = {
        isHiddenBorder:{
            type: Boolean,
            value:false
        }   
    } 
    static styles = [
        mainStyles,  //注入样式
        commonStyles,
        scrollbarStyles,
        css`        
            :host {
                display: block;
                position: fixed;   /**相对window窗口固定，不随稳当流 */
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.1);
                z-index: ${axueFrameZIndex.editModal};    /** 遵循层级规范，比page高一点，label-content-edit专用，防止层级占用 */
            }
            .content{
                background-color: #fff;
                min-width:300px;
                min-height:30px;
            }
            
        `
    ]
    
    constructor() {
        super();
    }
    
    /**
     * slot的一大问题是对内部结构的第一层子元素使用max-height:百分比值造成屏蔽。因为他已经是自适应了
     * 
     */
    render() {
        return html`
            <div class="container middle width-80-percent max-height-80 ${this.isHiddenBorder ? '' : 'border'}">
                <slot name="slot"></slot>    
            </div>
        `
        
    }

} 
AxueElement.preDefine( defaultTagName.Edit, Edit);