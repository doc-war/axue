//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { axueIcons } from "../../default/icon.define.js"          //统一维护默认图标
export class DataClassifyTabX extends LitElement { 
    static properties = {
        args:{type: Object} ,
        activeIndex:{ 
            type: Number,
            value:0
        }
    } 
    static styles = [
        ...shareStyles,          //注入样式
        css`
            :host {
                display: inline-block;    /**阻止外围block的全屏宽度 */
            }
        
            .tab {
                display: inline-block;
                user-select: none;  
                padding:6px 12px;          
                cursor: pointer;      /**悬停时光标变手指 */
                text-decoration: none;
                color: #333;
                border-bottom: 2px solid transparent;
                transition: border-bottom-color 0.3s ease-in-out;
            }
        
            .tab:hover {
                background-color: #f0f0f0;
            }
        
            .tab.active {
                border-bottom-color: var(--brandColor,cornflowerblue); /* 设置选中时的下划线颜色 */
            }
        `
    ]
    
    constructor() {
        super();
        let example=[
            { 
                label: '首页', 
                // content: 'Content for Tab 1',
                onClick:function(){ console.log("测试tab导航，点击1")}
            },
            {
                label: '关于', 
                onClick:function(){}
            }
        ]
        if(!this.args){
            this.args=example
        }
        this.activeIndex = 0;   //确保默认选中
    }


    handleTabClick(index) {
        this.activeIndex = index;
        if(this.args[this.activeIndex]?.onClick  && typeof this.args[this.activeIndex].onClick ==="function" ){
            this.args[this.activeIndex].onClick();
        }
    }
    
    renderTabs() {
        const tabs = [];
        for (const [index, tab] of this.args?.entries()) {
          tabs.push(html`
            <div
              class="tab ${index === this.activeIndex ? 'active' : ''}"
              @click=${() => this.handleTabClick(index)}
            >
              ${tab.label}
            </div>
          `);
        }
        return tabs;
    }
    
    render(){
        return html`
            <div>
                ${this.renderTabs()}
            </div>
            <div class="main border">
                ${this.args?.[this.activeIndex]?.content}
            </div>
        `;
    }
} 
/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.define( defaultTagName.DataClassifyTabX, DataClassifyTabX);