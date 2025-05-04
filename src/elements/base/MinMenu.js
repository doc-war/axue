import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing,render } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
// import { axueComponentCommonName } from "../../default/util.js"
// import {axueIcons} from "../../default/icon.define.js"
import {axueFrameGloballyUniqueUnderSlot} from "../../frame/util.js"
//增删改查专用，没有花里胡哨的支持
export class MinMenu extends LitElement {
  static properties = {
    args: { type: Object },
    level: { type: Number, value: 2 }   //层级，跟框架的模型有关系，meny-y2会传入level属性
  }

  static styles = [
    ...shareStyles,
    css`
      .menu-short{
        flex-grow: 1;    /*能自动计算填满*/
        padding:var(--basePadding,10px);
        background-color:var(--bgColor,white); 
        width:100px     /*尽量与label保持一致，接近640宽度的1/4的取值原则，menu+label基本等于填写区*/
     }
     .menu-short:hover{
      background-color:#eee;; 
  }
    `
  ]

  constructor() {
    super();
    let  example =  [
      {
          label:"编辑",
          onClick:function (){
            console.log("MinMenuY内部测试onClick事件，无回参。")
          }
      },
      {
        label:"删除",
      }
    ]
    
    if(!this.args){
        this.args=example
    }
  }


  /**
   * 构造某一级菜单
   * 禁止传非法数据，只能传数组
   */
  _menus(menus){
    // console.warn("[axue] _menus:",menus,level)
    let nodeList=[]
    for (let  i of menus) {
      if(typeof i === 'object' && i !== null){
        let node=this._menu(i)
        nodeList.push(node);
      }else{
        console.warn("[axue] 构造MenuY2的菜单项对象类型非法",i)
      }
    }
    return nodeList
  }

  /**
   * 构造一个菜单项组件，传入menu对象和所属的层级，如果是子菜单，就是2级
   *  */ 
  _menu(menu){
      return html`
        <div class="menu-short center"   @click=${(e) =>this._handleItemClick(e,menu)}  >
            <div class="menu-text margin-left-5">${menu.label}</div>
        </div>  
      `;    
  }


  render() {
    return html`
          <div class="container border"  >
              ${this._menus(this.args??[{}])}
          </div>
    `;
  }



  //传入事件上下文，菜单信息本身
  _handleItemClick(e,menu){
    if (menu.onClick && typeof menu.onClick === 'function') { 
      menu.onClick();
    }
    this._close()
  }


  _close(){
    // console.log("从min-menu-y面板移出")
    const showUnderSlot=document.getElementById(axueFrameGloballyUniqueUnderSlot)
    axueFrameFunc.hiddenNode(showUnderSlot)
  }
}

AxueElement.preDefine(defaultTagName.MinMenu,MinMenu)
