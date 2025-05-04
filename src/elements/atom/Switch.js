import { defaultTagName } from  "../../default/tag.define.js"
import { html, css, LitElement} from 'lit';
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
//如果组件内部结构里用到，就导入
class Switch extends LitElement {

  static styles = css`
    .switch {
      position: relative;
      display: inline-block;
      width: 42px;
      height: 22px;
    }

    .switch input {
      display: none;
    }

    .slider {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      border-radius: 20px;
      cursor: pointer;
      transition: .2s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 1px;
      bottom: 1px;
      background-color: white;
      border-radius: 50%;
      transition: .2s;  /**过渡转换时间 */
    }

    /**+是下一个兄弟节点的快捷写法 */
    input:checked + .slider {
      background-color: var(--brandColor,#2196F3);
    }

    /**下一个兄弟元素，转移24像素 */
    input:checked + .slider:before {    
      transform: translateX(20px); 
    }
  `;

  render() {
    return html`
      <label class="switch">
        <input type="checkbox" @change=${this._toggleSwitch}>
        <span class="slider"></span>
      </label>
    `;
  }

  _toggleSwitch(e) {
    e.stopImmediatePropagation();   //阻止事件继续冒泡，避免上层回调2次
    let switchNode=e.target
    const event = new CustomEvent('toggle-switch', {
      composed: true,
      bubbles:false,
      detail:{
        checked:switchNode.checked
      }
    });
    this.dispatchEvent(event);
  }
}

AxueElement.preDefine(defaultTagName.Switch, Switch);

