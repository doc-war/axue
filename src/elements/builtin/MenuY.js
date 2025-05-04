import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing,render } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import "../../default/apiImplementation.js"  //这行代码不能去掉，配合console拦截api的别名化
import {defaultIcons,getCustomIcons} from "../../default/icon.define.js"
import {axueFrameGloballyUniqueHoverSlot,axueFrameGloballyUniqueMainSlot,axueFrameGloballyUniqueCache,axueFrameZIndex} from "../../frame/util.js"

//一层菜单
export class MenuY extends LitElement {
  static properties = {
    args: { type: Object },
    level: { type: Number, value: 2 }   //层级，跟框架的模型有关系，meny-y2会传入level属性
  }

  static styles = [
    ...shareStyles,
    css`
      .menu-container-low{
        flex-grow: 1;    /*能自动计算填满*/
        padding:0 var(--basePadding,10px);
        background-color:var(--bgColor,white); 
        width:170px     /*尽量与label保持一致，接近640宽度的1/4的取值原则，menu+label基本等于填写区*/
     }
    `
  ]


  constructor() {
    super();
    let  example =  [
    {
        label:"主页",
        hover:"<div>悬停显示内容</div>",
        onClick:function (){
          console.log("MenuY内部测试onClick事件，无回参。")
        }
    },
    {
      label:"menu-y不开放子菜单",
      menus:[{
        label:"子菜单",   //长度自己控制
          onClick:function (){
            console.log("MenuY2内部测试onClick事件，无回参。")
          }
      }],
    },
    // {
    //   label:"———分隔符———",
    // },
    {
        key:"1",
        label:"订阅作者",
        switch:false,
    },{
        key:"2",
        label:"订阅傲雪",
        tag:"new",
        switch:true,
        onSwitch:function (e){
            console.log("MenuY内部测试OnSwitch事件，状态：",e)
        }
    }]
    
    if(!this.args){
        this.args=example
    }
  }

  // firstUpdated(){
  // }

  /**
   * 构造某一级菜单
   * 禁止传非法数据，只能传数组
   */
  _menus(menus,level){
    // console.warn("[axue] _menus:",menus,level)
    let nodeList=[]
    for (let  i of menus) {
      if(typeof i === 'object' && i !== null){
        let node=this._menu(i,level)
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
  _menu(menu,level){
    let clicktype
    /**
        计算出click的类型，影响对应的回调处理:
        1————普通点击
        2————点击switch
        3————点击进入子菜单
     */ 
    if (menu.menus && level==1){    //不支持进子菜单
        clicktype=3
    }else if(menu.switch===true || menu.switch===false){
        clicktype=2
    }else if(menu.onClick){
        clicktype=1
    }else{
      clicktype=0      //单label，禁用形态
    }
    //如果指定了type，则使用指定类型
    if(menu.type=="switch") clicktype=2
    if(menu.type=="disabled") clicktype=0

    if(clicktype===0){
      return html`
      <div class=${"menu-container-low flex-between disabled"}  data-key=${menu.key?menu.key:nothing}
          @mouseover=${menu.hover?(e) => this._handleItemMouseOver(e,menu):nothing}  @mouseout=${this._handleItemMouseOut}  >
          <div class="flex-left">
              <div class="menu-text margin-left-5">${menu.label}</div>
          </div>
      </div>  
      `;
    }else{
      return html`
      <div class="menu-container flex-between" data-key=${menu.key?menu.key:nothing}  @click=${(e) =>this._handleItemClick(e,menu,clicktype)}  
          @mouseover=${menu.hover?(e) => this._handleItemMouseOver(e,menu):nothing}  @mouseout=${this._handleItemMouseOut}  >
          <div class="flex-left">
              ${clicktype===0?null:html`<img alt="icon" class="minLogo nodrag " src=${menu.icon??getCustomIcons().logo??defaultIcons.logo} />`}
              <div class="menu-text margin-left-5">${menu.label}</div>
              <div class="menu-text margin-left-5 tag">${menu.tag??nothing}</div> 
          </div>
          ${clicktype==1?nothing:this._menuRight(menu,clicktype)}
      </div>  
    `;
    }
    
  }

  /**
   *  基于优先级原则定义右侧：
   *  * 子菜单优先级最好,但只有一级菜单才有
   *  * 其次switch
   *  * 可以没有
   */ 
  _menuRight(menu,clicktype){
    //子菜单显示一个>
    if(clicktype==3){
      return html`
        <div class="flex-right">
            <img alt="icon" class="minIcon nodrag" src=${getCustomIcons().right??defaultIcons.right} />
        </div> 
      `
    }
    if(clicktype==2){
      return html`
          <div class="flex-right">
              <axue-switch @toggle-switch=${(e)=>{this._toggleSwitch(e,menu)}} ></axue-switch>
          </div> 
      `;
    }else{
      return nothing
    }
    //普通点击，不需要返回,前置nothing处理掉
  }

  render() {
    return html`
          <div class="container border"  >
              ${this._menus(this.args??[{}],this.level??2)}
          </div>
    `;
  }

  /**处理开关回调 */
  _toggleSwitch(e,menu){
    const checked=e.detail.checked
    if (menu.onSwitch && typeof menu.onSwitch === 'function') {
      menu.onSwitch(checked);
    }
  }

  //传入事件上下文，菜单信息本身，以及事件类型
  _handleItemClick(e,menu,clicktype){
    // console.log(e,menu,clicktype)
    /**
     * 发送unCloseEvent事件，表示该事件消耗了一次性注册监听器，需要重新监听
     * 防止一切边界
     */
    if((this.level??2)>1){
      const event = new Event('un-closeevent', {
        composed: true,
        bubbles:false
      });
      this.dispatchEvent(event);
    }
    /**业务处理 */
    if(clicktype==1){
      if (menu.onClick && typeof menu.onClick === 'function') { 
        menu.onClick();
      }
      this._close()
    }else if(clicktype==2){
      if (menu.onSwitch && typeof menu.onSwitch === 'function') {
        //忽略，留给switch组件处理
        e.stopPropagation(); 
      }
    }else if(clicktype==3){
      // console.log("弹出子菜单，被点击的菜单是:",menu.menus,e.currentTarget)
      const event = new CustomEvent('open-childmenu', {
        composed: true,
        detail:{  
          childMenu:menu.menus ,    //挂载回去的是信息对象
          clickedMenuItem: e.currentTarget    //挂载回去的是节点，用于提取宽高坐标
        }
      });
      this.dispatchEvent(event);
    }else{
      //禁用状态会屏蔽点击
      console.lon("[axue] 其他尚未适配的菜单clicktype:",clicktype)
    }
  }

  /**
   * 传入事件上下文，菜单信息本身
   * 注意，传入的是模版字符串，还是字符串，还是lit字符串，还是node有巨大的差异。
   */
  _handleItemMouseOver(e,menu){
    // console.dir(e,{menu})
    const hoverContent=menu.hover
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

  /**
   * 只针对二级菜单，这是对menu-y2的适配，对一级也无所谓
   * 核心体验设计：
   * 1. 普通点击，关闭slot菜单
   * 2. 开关，不关闭，发送unCloseClick事件给y2重新注册监听
   * 3. 外部点击，y2进行关闭
   */
  _close(){
    // console.log("从menu-y面板移出")
    const showSlot=document.getElementById(axueFrameGloballyUniqueMainSlot)
    axueFrameFunc.hiddenNode(showSlot)
  }

}

AxueElement.preDefine(defaultTagName.MenuY,MenuY)
