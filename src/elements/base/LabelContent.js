import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { axueComponentCommonName } from "../../default/apiImplementation.js"
export class LabelContent extends LitElement {
  static properties = {
    args: { type: Object },
  }

  static styles = [
    ...shareStyles, 
    // css`
    //   :host {
    //     width: inherit; /* 继承全部宽度 */
    //     display:flex;
    //   }
    // ` 
  ]

  constructor() {
    super();
    let example={
      labelText:"姓名：",
      content:{
          key:"xxxx-name",
          value:"傲雪",
          type:"text"   //业务类型，默认为text
      }
    }
    
    if(!this.args){
        this.args=example
    }
  }

  render() {
    /**
     * 第一层width-90-percent，确保最大宽度和container的margin居中
     * 第二层用来锁定内容和左对齐的同时，让input的flex-grow填满尺寸
     */
    return html`
        <div class="label-container width-90-percent">  
          <div class="flex-left width-90-percent">
            <div  class="label-text">${this.args?.labelText}</div>
            <div data-key=${this.args?.content?.key??nothing} name=${axueComponentCommonName} class="label-frame">
                ${this.args?.content?.value}
            </div>
          </div>
        </div>
    `;
  }
}

AxueElement.preDefine(defaultTagName.LabelContent,LabelContent)