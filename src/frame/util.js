/**
 * 底层工具：
 * 1、为Api注册几个全局唯一的实例id
 * 2、定义层级
 * 3、注册容器层
 * 4、定义一些常用的工具方法，挂载到全局对象上
 * 5、定义一些常用的UI显示计算方法，挂载到全局对象上
 */

//顶层
export const axueFrameGloballyUniqueTip = "axueFrameGloballyUniqueTip"        //tip专用

//上独占层
export const axueFrameGloballyUniqueToastModal = "axueFrameGloballyUniqueToastModal"       //菜单专用，方便和Slot正交组合，二级菜单只能使用slot
export const axueFrameGloballyUniqueEditModal = "axueFrameGloballyUniqueEditModal"       //透明模态页面专用，用于原子粒度的编辑更新，更page一样的功能，但层级很高

// 浮层
export const axueFrameGloballyUniqueHoverSlot = "axueFrameGloballyUniqueHoverSlot"   //上辅层，悬停时使用
export const axueFrameGloballyUniqueMainSlot = "axueFrameGloballyUniqueMainSlot"     //点击时使用、二级菜单专用
export const axueFrameGloballyUniqueUnderSlot = "axueFrameGloballyUniqueUnderSlot"   //下辅层，跟随模式下专用

//下独占层
export const axueFrameGloballyUniquePageModal = "axueFrameGloballyUniquePageModal"       //透明模态页面专用，比如编辑页、详情页，允许在该层插槽内使用菜单


// bar层
export const axueFrameGloballyUniqueProperBar = "axueFrameGloballyUniqueProperBar"    //边栏专用
// 缓存层
export const axueFrameGloballyUniqueCache = "axueFrameGloballyUniqueCache"    //计算尺寸专用

//父容器
export const axueFrameContainer = "axueFrameContainer" 

//模块父容器，不会被slot效果冲击整体隐藏，走kill逻辑
export const axueFrameModuleContainer = "axueFrameModuleContainer" 

//层级模型
export const axueFrameZIndex={
  tip:1000,         //顶层

  //隐藏模块层允许自定义层级，但有限制
  frameExtend_max:199,  
  frameExtend_min:100,  

  toastModal:500,   //上独占交互层，一定脱离document流，fixed
  editModal:400,    //上独占交互层，脱离document流

  //浮层
  hoverSlot:390,     //还在document流中
  mainSlot:350,      //还在document流中
  underSlot:300,     //脱离document流

  //下独占层层，脱离document流
  pageModal:200,    

  //隐藏模块层允许自定义层级，但有限制
  hiddenModule_max:199,  
  hiddenModule_min:100,  

  //显性业务层
  propertybar:10,  //主页面bar层，脱离document流
  //body为0
  cache:-10,
}




//把所有方法挂载到一个全局对象上,减少命名污染范围
var axueFrameFunc={}

/** 为无事件动态获取鼠标位置提供基础 */
var axueFrameMouseX = 0;
var axueFrameMouseY = 0;

var AxueNodeAndFrameFuncIsInit=false
//初始化用于show系列API的唯一容器节点
export function initAxueNodeAndFrameFunc(){
  console.info("AxueNodeAndFrameFunc init...");
  if(AxueNodeAndFrameFuncIsInit) return 

  
  // 检查是否已插入，避免重复执行
  if (document.getElementById(axueFrameContainer)) return;
  AxueNodeAndFrameFuncIsInit=true
  const axueNode = `
    <div id="${axueFrameContainer}">
      <div id="${axueFrameGloballyUniqueCache}" style="z-index:${axueFrameZIndex.cache};position:fixed;top:0;left:0;opacity:0;user-select:none;"></div>
      <div id="${axueFrameGloballyUniqueProperBar}"></div>

      <div id="${axueFrameGloballyUniquePageModal}"></div>

      <div id="${axueFrameGloballyUniqueUnderSlot}"></div>
      <div id="${axueFrameGloballyUniqueMainSlot}"></div>
      <div id="${axueFrameGloballyUniqueHoverSlot}"></div>

      <div id="${axueFrameGloballyUniqueEditModal}"></div>
      <div id="${axueFrameGloballyUniqueToastModal}"></div>

      <div id="${axueFrameGloballyUniqueTip}"></div>
    </div>
    <div id="${axueFrameModuleContainer}"></div>
  `;

  // 更安全地插入 HTML 到 body 末尾,替代document.body.innerHTML +=axueNode
  document.body.insertAdjacentHTML("beforeend", axueNode);

  //监听鼠标移动，后面的Func方法要取
  document.addEventListener('mousemove', function(event) {
    axueFrameMouseX = event.clientX;    //注意，相对window而非document
    axueFrameMouseY = event.clientY;
    // console.log('鼠标移动位置：', axueFrameMouseX, axueFrameMouseY);
  });


  // //监听右击
  // document.addEventListener('contextmenu', function(event) {
  //   axueFrameMouseX = event.clientX;
  //   axueFrameMouseY = event.clientY;
  //   // 在控制台打印鼠标位置
  //   console.log('右击鼠标位置：', axueFrameMouseX, axueFrameMouseY);
  // });

  //把所有方法挂载到一个全局对象上,减少命名污染范围。globalThis 与 window 是等价的（在浏览器中）
  globalThis.axueFrameFunc=axueFrameFunc
}

/* *****************************显示节点类方法**************************** */

//通用隐藏节点
axueFrameFunc.hiddenNode =function (node){
    if(!(node instanceof Node)){
      console.log("[axue] 传入的参数不是html节点：",node); 
      return
    }
    node.style.display = 'none';
}
//通用隐藏节点
axueFrameFunc.showNode =function (node){
  if(!(node instanceof Node)){
    console.log("[axue] 传入的参数不是html节点：",node); 
    return
  }
  node.style.display = '';
}

//获取某个元素的位置宽高，一般指点击的前一级菜单
axueFrameFunc.getPositionAndSize=function(targetElement) {
    const rect = targetElement.getBoundingClientRect();   //display:none时都是0是一个边界问题
    let rectInfo ={
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    }  
    return rectInfo
}

// 在需要的时候获取鼠标当前的坐标
axueFrameFunc.getMouseCurrentPosition = function(){
    // console.log("当前鼠标位置：",axueFrameMouseX, axueFrameMouseY)
    return {mouseX:axueFrameMouseX, mouseY:axueFrameMouseY}
}
//获取屏幕宽高
axueFrameFunc.getWindowSize =function(){
  var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  // var documentWidth = document.documentElement.clientWidth || document.body.clientWidth;
  // var documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
  // console.log("窗口尺寸：",windowWidth, windowHeight,documentWidth,documentHeight)  //一样的
  return {windowWidth,windowHeight}
}




/**
 * 智能计算弹出位置,主要支持showSlot
 * 和弹出菜单算法略有区别，对于向下的方位，进行10像素偏移，更符合鼠标操作体验
 * 没有基于屏幕宽度采用Math.min算法，是因为我们不认为弹框应该具有超过半屏以上的宽度
 */
axueFrameFunc.calculateSlotPosition=function(mousePosition, slotContainerSize,positionPreference="auto") {  
  // //以左下为基石，并保证不跨窗口边界
  // const {windowWidth,windowHeight} =axueFrameFunc.getWindowSize()
  // //修正display:none状态影响
  // // if(slotContainerSize.width==0) slotContainerSize.width=100
  // // if(slotContainerSize.height==0) slotContainerSize.height=100
  

  // const left = Math.min(mousePosition.mouseX+10, windowWidth - slotContainerSize.width -10);
  // const top = Math.min(mousePosition.mouseY+10, windowHeight - slotContainerSize.height -10);
  // // console.log("计算slot位置：",
  // //     "\n鼠标+10：",mousePosition.mouseX+10,
  // //     "\n窗口宽度：",windowWidth,
  // //     "\nslot宽度：",slotContainerSize.width,
  // //     "\n窗口-slot+10：",windowWidth - slotContainerSize.width -10,
  // //     "\n最终计算记过:",left
  // // )
  // return {left,top} 

  let left, top;

  //智能判定
  if(positionPreference=="auto"){
    positionPreference = 'bottom-right'    //暂时不支持智能计算
    const {windowWidth,windowHeight} =axueFrameFunc.getWindowSize()
    if( (mousePosition.left < windowWidth / 2) &&  (mousePosition.top < windowHeight / 2)) positionPreference="bottom-right"
    if( (mousePosition.left < windowWidth / 2) &&  (mousePosition.top > windowHeight / 2)) positionPreference="top-right"
    if( (mousePosition.left > windowWidth / 2) &&  (mousePosition.top < windowHeight / 2)) positionPreference="bottom-left"
    if( (mousePosition.left > windowWidth / 2) &&  (mousePosition.top > windowHeight / 2)) positionPreference="top-left"
  }

  // 根据 positionPreference 计算菜单位置 
  switch (positionPreference) { 
      case 'top-left':  
        // 计算左上角位置，前者（slotContainerSize）右下角与后者（mouseNodePosition）左下角对齐  
        left = mousePosition.left - slotContainerSize.width; 
        top = mousePosition.top + mousePosition.height - slotContainerSize.height; 
        break;  
      case 'top-right':  
        // 计算右上角位置，前者（slotContainerSize）左下角与后者（mouseNodePosition）右下角对齐  
        left = mousePosition.left + mousePosition.width; 
        top = mousePosition.top + mousePosition.height - slotContainerSize.height;
        break;  
      case 'bottom-left':  
        // 计算左下角位置，前者（slotContainerSize）右上角与后者（mouseNodePosition）左上角对齐  
        left =  mousePosition.left - slotContainerSize.width-10; 
        top = mousePosition.top+10;  
        break;  
      case 'bottom-right':  
      default:  
        // 计算右下角位置（默认），前者（slotContainerSize）左上角与后者（mouseNodePosition）右上角对齐  
        left = mousePosition.left + mousePosition.width+10; 
        top = mousePosition.top+10; 
        break;  
  }  
  return { left, top };  
}

//智能计算弹出位置，一般也是针对菜单
//targetPosition, menuSize都可以使用getPositionAndSize进行获取
//绝对定位在内置的容器中，如showSlot,但这里我们依然允许调用层动态传入
axueFrameFunc.calculateMenuPosition=function(mouseNodePosition, slotContainerSize, positionPreference = 'auto') {
    let left, top;

    //智能判定
    if(positionPreference=="auto"){
      positionPreference = 'bottom-right'    //暂时不支持智能计算
      const {windowWidth,windowHeight} =axueFrameFunc.getWindowSize()
      if( (mouseNodePosition.left < windowWidth / 2) &&  (mouseNodePosition.top < windowHeight / 2)) positionPreference="bottom-right"
      if( (mouseNodePosition.left < windowWidth / 2) &&  (mouseNodePosition.top > windowHeight / 2)) positionPreference="top-right"
      if( (mouseNodePosition.left > windowWidth / 2) &&  (mouseNodePosition.top < windowHeight / 2)) positionPreference="bottom-left"
      if( (mouseNodePosition.left > windowWidth / 2) &&  (mouseNodePosition.top > windowHeight / 2)) positionPreference="top-left"
    }
    // console.log("菜单采用的方位：",positionPreference)

    // 根据 positionPreference 计算菜单位置  
    switch (positionPreference) { 
        case 'top-left':  
          // 计算左上角位置，前者（slotContainerSize）右下角与后者（mouseNodePosition）左下角对齐  
          left = mouseNodePosition.left - slotContainerSize.width; 
          top = mouseNodePosition.top + mouseNodePosition.height - slotContainerSize.height; 
          break;  
        case 'top-right':  
          // 计算右上角位置，前者（slotContainerSize）左下角与后者（mouseNodePosition）右下角对齐  
          left = mouseNodePosition.left + mouseNodePosition.width; 
          top = mouseNodePosition.top + mouseNodePosition.height - slotContainerSize.height;
          break;  
        case 'bottom-left':  
          // 计算左下角位置，前者（slotContainerSize）右上角与后者（mouseNodePosition）左上角对齐  
          left =  mouseNodePosition.left - slotContainerSize.width; 
          top = mouseNodePosition.top;  
          break;  
        case 'bottom-right':  
        default:  
          // 计算右下角位置（默认），前者（slotContainerSize）左上角与后者（mouseNodePosition）右上角对齐  
          left = mouseNodePosition.left + mouseNodePosition.width; 
          top = mouseNodePosition.top; 
          break;  
    }  

      // console.log({
      //       mouseNodePosition, 
      //       slotContainerSize,
      //       left, 
      //       top 
      // })
    return { left, top };  
      
}

/**
 * 在根节点下以一定高度弹出一个容器元素
 * 这个position需求，可能是鼠标位置，也可能是鼠标所对应的菜单项的位置，因此传入点击所对应的元素
 */
axueFrameFunc.showChildMenuInSlot = function ({mouseNode,slotSize,slotContainer,zIndex=axueFrameZIndex.mainSlot,positionPreference='auto'}){
    slotContainer.style.display = 'none';   //解决container0计算的问题
    setTimeout(()=>{
        // console.log({mouseNode,slotContainer})
        const mouseNodeRect = axueFrameFunc.getPositionAndSize(mouseNode);
        const slotContainerRect = slotSize;
        const slotContainerPosition = axueFrameFunc.calculateMenuPosition(mouseNodeRect, slotContainerRect, positionPreference);

        // 设置菜单的位置，可以有指定层级，覆盖之
        slotContainer.style.position="absolute"
        slotContainer.style.left = `${slotContainerPosition.left}px`;
        slotContainer.style.top = `${slotContainerPosition.top}px`;
        slotContainer.style["z-index"]=zIndex
        //防抖
        slotContainer.style.display = 'block';
    },4)  //dom不需要，但定时最低4毫秒
}

/**
 *  auto跟随模式下,支持插槽浮层和隐藏模块层
 */
axueFrameFunc.showSlotByMouse = function ({slotContainer,slotSize, zIndex=axueFrameZIndex.underSlot}){
  slotContainer.style.display = 'none';
  setTimeout(()=>{
      const mouseRect = axueFrameFunc.getMouseCurrentPosition()
      const slotContainerRect = slotSize;
      const mouseNodeRect={
        left: mouseRect.mouseX,
        top: mouseRect.mouseY,
        width: 0,
        height: 0
      }
      const slotContainerPosition = axueFrameFunc.calculateSlotPosition(mouseNodeRect, slotContainerRect);

      // 设置菜单的位置，可以有指定层级，覆盖之
      // slotContainer.style.position="absolute"    //保持文档流在高度超过全屏下拉半中的时候会有问题，因为计算鼠标位置是相对窗口的
      slotContainer.style.position="fixed"    //我们不支持用户滚动鼠标的行为，这是取舍
      slotContainer.style.left = `${slotContainerPosition.left}px`;
      slotContainer.style.top = `${slotContainerPosition.top}px`;
      slotContainer.style["z-index"]=zIndex
  
      //防抖
      slotContainer.style.display = 'block';
  },4)  //dom不需要，但定时最低4毫秒
}

/**分别传入A的事件环境，以及B节点元素
 * 注意，B元素的position应该是absolute
 */
axueFrameFunc.axueFuncClickAshowB = function (event,B){            
    // 获取鼠标点击位置
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    mouseX = mouseX+10;
    mouseY = mouseY+10;
    
    // 设置统计元素的位置,注意，应该设置z-index: 99，防屏蔽;
    B.style.position="absolute"
    B.style.left = mouseX + 'px';
    B.style.top = mouseY + 'px';
    
    // // 显示B元素
    B.style.display = 'block';
}


/* **************************渲染类、注册类方法****************************** */




/**
 * 将某个元素设置为可拖动
 * 前提是该元素具有absolute或者fixed的position
 * 并且也得自己去维护宽高，默认按内部实际需要的宽度自适应
 */
axueFrameFunc.draggable = function(containerNode) {
  // console.error('可移动!', containerNode);

  var isDragging = false;
  var startX, startY, offsetX, offsetY;
  // var clickThreshold = 5; // 设置点击阈值

  containerNode.style.cursor = 'grab';  //手势

  containerNode.addEventListener('mousedown', function (e) {
    // console.error('按下!');
    isDragging = false;
    startX = containerNode.getBoundingClientRect().left;
    startY = containerNode.getBoundingClientRect().top;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;

    containerNode.addEventListener('mousemove', handleDrag);
    containerNode.addEventListener('mouseup', function () {
      // console.error('松开!');
      containerNode.removeEventListener('mousemove', handleDrag);
      // if (!isDragging) {
      //   // 如果没有拖动，则视为点击事件
      //   if (Math.abs(e.clientX - startX) < clickThreshold && Math.abs(e.clientY - startY) < clickThreshold) {
      //     handleClick();
      //   }
      // }
    });
  });

  //坐标随鼠标变动
  function handleDrag(e) {
    isDragging = true;
    var newX = e.clientX - offsetX;
    var newY = e.clientY - offsetY;

    containerNode.style.left = newX + 'px';
    containerNode.style.top = newY + 'px';
  }

  function handleClick() {
    // 处理点击事件的逻辑
    // console.error('Clicked dragable!');
  }

  // 在拖动结束时手动触发mouseup事件
  function handleMouseUp() {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleMouseUp);

    if (isDragging) {
      // 如果拖动中，手动触发mouseup事件
      var event = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.dispatchEvent(event);
    }
  }

  document.addEventListener('mouseup', handleMouseUp);
}
