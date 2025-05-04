import { defaultTagName } from  "../../default/tag.define.js"
import { html, css, LitElement, nothing } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { axueComponentCommonName } from "../../default/util.js"
import { axueIcons } from "../../default/icon.define.js"          //统一维护默认图标
import {AxueElement} from "../../frame/loadtime.js" //导入注册器

export class SelectY extends LitElement {
  static properties = {
    args: { type: Object },
  }

  static styles = [
    css`
      .select-wrapper {  
        position: relative;  
        height: 30px; /* 设置下拉框的高度 */  
        overflow: hidden;  
      }  
        
      .select-wrapper select {  
        width: 100%;  
        height: 100%;  
        border: none; /* 移除默认边框 */  
        outline: none; /* 移除默认的轮廓线 */  
        -webkit-appearance: none; /* 移除默认的外观 */  
        -moz-appearance: none; /* Firefox 浏览器 */  
        appearance: none; /* 其他浏览器 */  
      }
    ` 
  ]

  //初始化
  constructor() {
    super();   //执行全生命周期
    let example={
      defaultIndex:1,   //默认选择值，负数代表默认无选项
      close:axueIcons.close,
      options:[
        {
          key:"name1",
          value:"傲雪",  
        },
        {
          key:"name2",
          value:"青松"
        },
      ]
    }
    if(!this.args){
      this.args=example
    }
  }


  //渲染
  render() {
    return html`
      <div class="select-wrapper">  
        <select>  
          <option>选项一</option>  
          <option>选项二</option>  
          <option>选项三</option>  
        </select>  
      </div>
    `;
  }

  // _resetSelected(){
  //   let selector=`option[name='${this.selected}']`
  //   // console.log({selector})
  //   let node=this.shadowRoot.querySelector(selector)
  //   if(!!node){node.selected=true}
  // }

  _change(e){
    //特别处理，失去焦点
    let selector=nameAttributeSelector("select")
    this.shadowRoot.querySelector(selector).blur()
    //转发
    let type="element"
    let eventName="select-change"
    // console.log("target测试：",e.target,e.target.name)
    relayEvent.call(this,e,type,eventName)  //调用事件中转，传入this环境
  }
}


AxueElement.define(defaultTagName.SelectY,SelectY)

