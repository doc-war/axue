import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { axueComponentCommonName } from "../../default/apiImplementation.js"
export class LabelSelect extends LitElement {
  static properties = {
    args: { type: Object },
  }

  static styles = [
    ...shareStyles, 
  //   css`
  //     :host {
  //       width: inherit; /* 继承全部宽度 */
  //       display:flex;
  //     }
  // `  
  ]

  //初始化
  constructor() {
    super();   //执行全生命周期
    let example={
      labelText:"同学：",
      isShowFieldRequired:false,
      options:[
        {
          key:"xx-name1",
          value:"傲雪",  
        },
        {
          key:"yy-name2",
          value:"青松",
          disabled:true,
        },
        {
          value:"寒梅",
        },
      ]
    }
    if(!this.args){
      this.args=example
    }
  }

  //第一次渲染之后回调，检查默认值
  firstUpdated() {
    let options=this.args?.options??[]
    for (let index in options){
      if( typeof options[index] === 'object' &&options[index].disabled){
        // console.log({index})
        let counter = parseInt(index, 10)+1;   //index是string类型，js史上最大的坑
        let node = this.shadowRoot.querySelector(`option:nth-child(${counter})`)
        node.setAttribute("disabled","")       //xml字符串不能表示bool，空表示true
      }  
    }
  }

  //渲染
  render() {
    let options = []
    for (let  i of this.args?.options??[]) {
        let node =html`<option data-key=${i.key??nothing}>${i.value}</option>`  //options不允许定义内部样式，因此不能实现prefix
        options.push(node);
    }
    return html`
      <div class="label-container width-90-percent">
        <div class="flex-left width-90-percent">
          <div  class="label-text"><span class="label-required">${this.args?.isShowFieldRequired ?"※  ":""}</span>${this.args?.labelText}</div>
          <select data-key=${this.args?.input?.key??nothing} name=${axueComponentCommonName}   class="label-frame select" 
              title=${this.args?.labelText} @change=${this._change} >
              ${options}
          </select>
        </div>
      </div>
    `;
  }

  _change(e){
    const selectedValue = e.target.value;
    // 获取选中的 option 元素
    const selectedOption = e.target.options[e.target.selectedIndex];
    // 获取 data-key 属性值
    const dataKey = selectedOption.dataset.key;
    // console.log('Selected Value:', selectedValue,dataKey);

    //转发
    let detail
    if(dataKey){
      detail={
        key:dataKey,
        value:selectedValue
      }
    }
    const event = new Event('change', {
      composed: true,
      detail
    });
    this.dispatchEvent(event);
  }
}


AxueElement.preDefine(defaultTagName.LabelSelect,LabelSelect)
