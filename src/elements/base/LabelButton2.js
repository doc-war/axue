import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { axueComponentCommonName } from "../../default/apiImplementation.js"

export class LabelButton2 extends LitElement {
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
      
    //   :host > div {
    //     width: 100%; /* 设置内部div的最小宽度为父元素宽度的80% */
    //   }
    // ` 
  ]

  constructor() {
    super();
    let example={
      confirmText:"确认",
      cancelText:"cancel",
      // isShowCancel:false, 
      onConfirm:function(){},
      onCancel:function(){},
    }
    if(!this.args){
        this.args=example
    }
  }

  firstUpdated(){
    if(this.args?.input?.disabled){
      let selector=`input[name=${axueComponentCommonName}]`
      let node=this.shadowRoot.querySelector(selector)
      node.setAttribute("disabled","")    //xml字符串不能表示bool，空表示true
    }  
  }

  render() {
    //console.log("renderLableInput",this.args) 
    return html`
        <div class="label-container width-90-percent">
          <div class="flex-left width-90-percent">
            <div  class="label-text"></div>
              <div class="flex-right main label-frame">
                  ${typeof this.args?.isShowCancel === 'undefined' || this.args.isShowCancel ? html`<button class="button-cancel" @click="${this._cancel}">${this.args?.cancelText??"取消"}</button>` :nothing}
                  <div>
                    <button class="button-main margin-left-20" @click="${this._confirm}">${this.args?.confirmText??"确定"}</button>
                  </div>
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


AxueElement.preDefine(defaultTagName.LabelButton2,LabelButton2)