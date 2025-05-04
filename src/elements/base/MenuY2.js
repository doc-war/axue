import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing,render } from 'lit';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import "../builtin/MenuY.js"
import  {axueFrameGloballyUniqueMainSlot,axueFrameGloballyUniqueCache,axueFrameZIndex}  from "../../frame/util.js"  

export class MenuY2 extends LitElement {
  static properties = {
    args: { type: Object },
  }

  static styles = [
    ...shareStyles,  
  ]


 

  constructor() {
    super();
    let  example = [
      {
           label:"主页",   //长度自己控制
           hover:"<div>hover字符串<2>",
          //  icon:logo,
           onClick:function (){
               //...
               console.log("MenuY2内部测试onClick事件，无回参。")
           }
      },{
        label:"——分隔符——",
      },
      {
           label:"订阅",
           menus: [
            {
              label:"不订阅",   //长度自己控制
              onClick:function (){
                console.log("MenuY2内部测试onClick事件，无回参。")
              }
            },
            {
              key:"123",
              label:"订阅作者",
              enable:false,
              switch:false,
              // menus: [{
              //   key:"123",
              //   label:"订阅作者",
              //   enable:false,
              //   switch:false,
              // }]
            },{
                key:"234",
                label:"订阅傲雪",
                tag:"new",
                switch:true,
                onSwitch:function (e){
                  console.log("MenuY2内部测试OnSwitch事件：",e)
                }
            }]
       }
   ]
    
    if(!this.args){
        this.args=example
    }
  }

  render() {
    return html`
        <axue-menu-y .args=${this.args??[]} @open-childmenu=${this._openChildMenu} level=1></axue-menu-y>
    `;
  }

  //在某个位置打开子菜单
  _openChildMenu(e) {
    if(!this._renderChildMenu){console.warn("[axue] 体验设计理念不支持2级以上的菜单");return}
    let {childMenu,clickedMenuItem} =e.detail
    const childMenuContent = this._renderChildMenu(childMenu);    //如果是子菜单继续点，this指针偏向，会报undefined错误自然拦截
    //先写进新的div，绕过索引bug，否则每次渲染到同一个cache上，会被忽略
    const div = document.createElement("div")
    render(childMenuContent, div); //模板转节点，但不渲染
    /**先渲染进缓存，计算尺寸 */
    const cache = document.getElementById(axueFrameGloballyUniqueCache)
    render(div, cache); //模板转节点
    setTimeout(()=>{
      const slotSize = axueFrameFunc.getPositionAndSize(cache)

      /**转移渲染进插槽，缓存会自动清空 */
      const ShowSlot=document.getElementById(axueFrameGloballyUniqueMainSlot)
      render(cache.firstElementChild,ShowSlot)    //转移进插槽
    
      //弹出
      axueFrameFunc.showChildMenuInSlot({
        mouseNode: clickedMenuItem,
        slotSize,
        slotContainer: ShowSlot,
        zIndex:axueFrameZIndex.mainSlot, 
        positionPreference: undefined
      })
    },4)
    
  }
  _listener(){
    //内外基于unCloseEvent协议
    document.addEventListener('mousedown', function(event) {
      // console.log("callback")
      const slot=document.getElementById(axueFrameGloballyUniqueMainSlot)
      if (slot === event.target || slot.contains(event.target)) {
          //漏洞是先点击开关，再点击外围会被忽略，需要unCloseClick来补位
          return 
      }else{
          // console.log("menu-y2将二级面板移出")
          axueFrameFunc.hiddenNode(slot)
      }
    },{once:true});
  }
  //构建lit模版字符串，传入子菜单对象
  _renderChildMenu(menus) {
    /**核心体验，单机、双击、右击都可将二级面板快捷移出 */
    this._listener()
    return html`
        <axue-menu-y .args=${menus} @open-childmenu=${this._openChildMenu} level=2  @un-closeevent=${this._listener}></axue-menu-y>
    `;
  }
}

AxueElement.preDefine(defaultTagName.MenuY2,MenuY2)