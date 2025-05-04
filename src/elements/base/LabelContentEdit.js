import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing,render } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { axueComponentCommonName,showEdit } from "../../default/apiImplementation.js"
import {axueFrameGloballyUniqueHoverSlot,axueFrameGloballyUniqueEditModal,axueFrameGloballyUniqueCache,axueFrameZIndex} from "../../frame/util.js"
export class LabelContentEdit extends LitElement {
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
          value:"傲雪可修改",
          type:"text",   //业务类型，默认为text
          hover:"<div>这应该是一个可以自定义的<span style='color:#ff8822;'>符合html结构规范</span>的字符串，否则可能会作为普通字符串处理</div>"
      },
      editorText:"编辑",
      // onClickEdit(that,newValue){
      //     console.error("点击编辑:",that,newValue)
      // }
      // onUpdate(that,newValue){
      //     console.error("数据更新:",that,newValue)
      // }
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
                <div class="label-content"  @mouseout=${this._handleItemMouseOut} 
                  @mouseover=${this.args?.content?.hover?this._handleItemMouseOver:nothing}  
                >
                  ${this.args?.content?.value}
                </div>
                <div class='cornflowerblue label-editText margin-left-20' @click=${this._clickEdit}>
                    ${this.args?.editorText}
                </div>
            </div>
          </div>
        </div>
    `;
  }

  /**
   * 传入事件上下文，菜单信息本身
   * 注意，传入的是模版字符串，还是字符串，还是lit字符串，还是node有巨大的差异。
   */
  _handleItemMouseOver(e){
    const hoverContent=this.args?.content.hover
    //先写进新的div，绕过索引bug，否则每次渲染到同一个cache上，会被忽略
    const div = document.createElement('div');    //创建不可见容器
    if(hoverContent instanceof Node ){
      div.appendChild(hoverContent);
    }else{
      div.innerHTML=hoverContent     //字符串
    }  
    div.style.padding = '10px';
    div.style.border = '1px solid #abc';
    div.style.borderRadius="4px"
    div.style.backgroundColor = '#f9fcff';
    /**先渲染进缓存，计算尺寸 */
    const cache = document.getElementById(axueFrameGloballyUniqueCache)
    render(div, cache); //模板转节点
    const mouseNode = e.currentTarget    //缓存起来，延迟后将获取的是延迟后的状态
    setTimeout(()=>{
      const slotSize = axueFrameFunc.getPositionAndSize(cache)

      /**跟showSlot、menuy2的click保持一致 */
      const ShowHoverSlot=document.getElementById(axueFrameGloballyUniqueHoverSlot)
      render(cache.firstElementChild,ShowHoverSlot)   //渲染进dom，在纯字符串时，使用innerHtml将没有firstElementChild
      axueFrameFunc.showChildMenuInSlot({
        mouseNode,
        slotSize,
        slotContainer: ShowHoverSlot,
        zIndex:axueFrameZIndex.hoverSlot,     //详见层级模型定义
        positionPreference: undefined
      })
    },4)
  }

  _handleItemMouseOut(event){
    //无论哪一级，都要隐藏悬停板
    const showHoverSlot=document.getElementById(axueFrameGloballyUniqueHoverSlot)
    axueFrameFunc.hiddenNode(showHoverSlot)
  
  }

  //处理点击编辑按钮的事件，可以是默认的内置弹层修改，也可以使用自定义的事件处理
  _clickEdit(e){
    //如果没有注册回调，则走默认逻辑弹框并修改原值，如果有回调，就不处理
    if( this.args.onClickEdit &&  typeof this.args.onClickEdit === 'function' ){
      this.args.onClickEdit(this)
      return 
    }

    //默认机制
    let  value = this.args.content.value
    let inputArgs={
      labelText:this.args?.labelText,
      input:{
          value:value,
          placeHolder:"请输入",
      },
    }
  
    let that = this
    let buttonArgs={
      confirmText:"修改",
      cancelText:"取消",
      // isShowCancel:false, 
      onConfirm:function(){
        const editContainer =document.getElementById(axueFrameGloballyUniqueEditModal)
        let showEditContent=editContainer.firstElementChild.childNodes[0].firstElementChild
        let inputNodeRoot = showEditContent.firstElementChild.shadowRoot
        let inputNode = inputNodeRoot.querySelectorAll('input')[0];
        // console.error("ceshi",showEditContent,inputNode)
        let newValue = inputNode.value
        that.args.content.value = newValue
        that.requestUpdate()
        if( that.args.onUpdate &&  typeof that.args.onUpdate === 'function' ){
          that.args.onUpdate(that,newValue)
          return 
        }
        showEdit.close()
      },
      onCancel:function(){
        showEdit.close()
      },
    }
    // console.error("ceshi",inputArgs,buttonArgs)
    let editNode = html`
      <axue-label-input .args=${inputArgs} ></axue-label-input>
      <axue-label-button-2 .args=${buttonArgs}></axue-label-button-2>
    `
     const container = document.createElement('div');   //创建,但不直接渲染，只用于挂载
     render(editNode, container);  //把lit模板渲染进容器，此时容器依然不渲染
     let showArgs ={
         slot:container
     }
    showEdit.send(showArgs)
  }
}

AxueElement.preDefine(defaultTagName.LabelContentEdit,LabelContentEdit)

function getPreviousSiblingNode(element){
  var previousSibling = element.previousSibling;

  // 检查是否为元素节点，而不是文本节点或其他类型的节点
  while (previousSibling && previousSibling.nodeType !== 1) {
      previousSibling = previousSibling.previousSibling;
  }

  if (previousSibling) {
      // 找到了上一个兄弟元素节点
      console.log(previousSibling);
  } else {
      // 没有上一个兄弟元素节点
      console.log('[axue] element没有上一个兄弟元素节点:',element);
  }
}