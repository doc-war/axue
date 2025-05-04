import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { axueComponentCommonName } from "../../default/apiImplementation.js"

export class LabelInput extends LitElement {
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

  ]

  constructor() {
    super();
    let example={
      labelText:"姓名：",
      isShowFieldRequired:true,   //显示字段必填，但不做逻辑校验
      input:{
          key:"xxxx-name",
          value:"傲雪",
          placeHolder:"请输入",
          disabled:false,
      }
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
    /**
     * 第一层width-90-percent，确保最大宽度和container的margin居中
     * 第二层用来锁定内容和左对齐的同时，让input的flex-grow填满尺寸
     */
    return html`
        <div class="label-container width-90-percent">  
          <div class="flex-left width-90-percent">
            <div  class="label-text"><span class="label-required">${this.args?.isShowFieldRequired ?"※  ":""}</span>${this.args?.labelText}</div>
            <input data-key=${this.args?.input?.key??nothing} name=${axueComponentCommonName} class="label-frame" value=${this.args?.input?.value}  
                placeHolder=${this.args?.input?.placeHolder ?? nothing } @change=${this._change} />
          </div>
        </div>
    `;
  }

  _change(e){
    // console.log("xxxx",e.target.value)
    let detail
    if(this.args?.input?.key){
      detail={
        key:this.args.input.key,
        value:e.target.value
      }
    }
    const event = new Event('change', {
      composed: true,
      detail
    });
    this.dispatchEvent(event);
  }
}

AxueElement.preDefine(defaultTagName.LabelInput,LabelInput)