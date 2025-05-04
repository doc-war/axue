/**
统一输出默认标签名的枚举值，挂载到全局上，等待tag.define面向内部组件开发侧重新注册
注意跟loadtime配置侧不同，以类名为索引
注意，此时value也不需要添加前缀，相当于是底层定义
每一个需要开放的组件，都需要在此注册
*/
export  const  axueDefaultTagName = {
  //原子域
  SelectY:"select-y", 
  Switch:"switch",


  //内置域
  Tip:"tip",
  ToastSlot:"toast-slot",
  Slot:"slot",
  PropertyBar:"property-bar",
  MenuY:"menu-y",
  Page:"page",
  Edit:"edit",
  Module:"module",

  //基础域
  Hello: "hello",

  ButtonS:"button-s",
  LogoClose:"logo-close",   
  HighLight:"high-light",

  MenuY2:"menu-y2",
  MinMenu:"min-menu",
  TabX:"tab-x",

  LabelInput:"label-input",
  LabelSelect:"label-select",
  LabelContent:"label-content",
  LabelContentEdit:"label-content-edit",
  LabelButton2:"label-button-2",
 

  //容器域
  Between:"between",
  Left:"left",
  Right:"right",
  DataListManager:"data-list-manager",

  //业务域
  ButtonMenuY2:"button-menu-y2",
  AvatarMenuY2:"avatar-menu-y2"

}

Object.freeze(axueDefaultTagName);   //冻结，避免运行时修改