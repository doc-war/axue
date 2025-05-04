import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement } from 'lit';
// //如果组件内部结构里用到，就导入
// import { shareStyles } from "../default/share.css.js"          //统一维护共享样式 
// import { axueIcons } from "../default/icon.define.js"          //统一维护默认图标
export class Hello extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--wc-notifier-text-color, #000);
    }
  `;

  static properties = {
    header: { type: String },
    counter: { type: Number },
  };

  constructor() {
    super();
    this.header = 'Hey there';
    this.counter = 5;
  }

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <slot></slot>
      <h2>${this.header} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>增加</button>
    `;
  }
}
AxueElement.preDefine( defaultTagName.Hello, Hello);
