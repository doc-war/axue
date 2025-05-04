console.info("调用Axue接口实现...");
//相关内置组件应该在前面的环节被注册，这里不再关心

import * as util  from "../frame/util.js"
/**
    定义一个通用的name
    1. 用户可能不会传入data-key，因此，使用了允许重名的name
    2. 主要用于支持disable属性的多input场景，在没有id、data-key的情况下更精准的定位到标签
 */
export const axueComponentCommonName = "axueDefaultTagName"  


/**
 * 替代静态导入
    import { render,html} from 'lit';
    import { unsafeHTML } from 'lit/directives/unsafe-html.js';
 */
import { getLit,getUnsafeHTML,getAxueTip} from "./dynamicModules.js";

/**
    render方法有一些不太好控制的特点：
        1. 对于内部结构一致的，会替换，主要针对模版字符串
        2. 对于不同标签的，也可能会替代，主要针对模版字符串
        3. 如果一个是div这类原生标签包装，一个是模版字符串，会追加
        4. 但如果继续对3的情况重复渲染同一个自定义标签的模版字符串，会看到原生标签留下来了，里面的自定义组件被替换了，这很诡异
    所以，我们封装追加元素，而非替换渲染，用于明确区分
*/
export async function appendChild(container, childHtml){
    if(!container || !container instanceof Node){
        console.warn("傲雪框架 > 要追加的container类型非法：",container)
        return
    }

    // 在这里动态导入 lit，因为它被使用了
    const { render, html } = await getLit();

    //节点元素
    if (childHtml instanceof Node){
        // console.warn("追加htmlNode：",childHtml)
        container.appendChild(childHtml);
        return
    }
    //如果是web标准模版字符串
    if (typeof childHtml === 'string' && childHtml.includes('<div>')) {
        // console.warn("追加web标准模版字符串：",childHtml)
        const newElement = document.createElement('div');
        newElement.innerHTML = childHtml;
        container.appendChild(newElement);
        return
    }
    //如果是lit封装的模版字符串
    if (childHtml && childHtml?.["_$litType$"] === 1) {
        const newElement = document.createElement('div');
        render(childHtml, newElement);   //渲染到未渲染的div里
        /**
         * newElement.firstChild可能取值到的是注释
         * newElement.firstElementChild代表第一个有效子节点
         * newElement.childNodes代表全部节点，需要使用nodeType==1来判定是否有效
         * newElement.children代表全部有效子节点，但会丢失display:none的节点
         */
        // 获取B节点的所有子节点
        let  childElements = getChildElementNodes(newElement)
        for (let element of childElements){
            container.appendChild(element);
        }
        // // 创建一个文档片段
        // const fragment = document.createDocumentFragment();      //lit并没有支持到文档片段

        // // 将B节点的所有子节点添加到文档片段中
        // for (let i = 0; i < childNodes.length; i++) {
        // fragment.appendChild(childNodes[i].cloneNode(true)); // 使用cloneNode方法来克隆节点并添加到文档片段中
        // }
        // // 将文档片段一次性追加到A组件上
        // container.appendChild(fragment);
        return
    }
    console.warn("傲雪框架 > 要追加的childHtml类型非法或暂未支持：",childHtml)
};
/**注意和框架API模块同步 */


/**
 * 获取子节点里有几个有效元素节点，用于支持精准appendChild
 */
function getChildElementNodes(ele){
    const childNodes = ele.childNodes;
    let elements=[]
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType === 1) { // 1 表示元素节点
            // console.log(childNodes[i])
            elements.push(childNodes[i])
        }
    }
    return elements
}

// /**主要用于检查slot合法性 */
// export function checkSlotType(slot){
//     if(!slot) return "null"
//     if(typeof slot === 'string' && /^`.*`$/.test(slot)) return "webContent"    //原生模板字符串，但可能不标准
//     if(typeof slot === 'string' && /^`.*`$/.test(slot) && slot.includes('<div>') ) return "webString"    //原生模板字符串
//     if(slot?.["_$litType$"] === 1) return "litString"   //lit模版字符串
//     if(container instanceof Node) return "node"        //节点实例
//     return "other"    //其他
// }


/**
 * 跟随鼠标位置弹出面板
 * 由于slot内嵌的可能是原生dom标签，也可能是lit自定义组件，还可能是vue组件，关闭后清空可能存在问题。
 * 已知不能使用innerHTML、textContent、removeChild、replaceWith等原生方法来清除内部的lit元素，会导致破坏内部结构，只能重新渲染空注释
 * 但如果不清除，display：block会存在内容闪烁，又不能改成none，否则会尺寸计算错误
 */
export class showSlot {
    static async send(args){
        // console.error("傲雪框架 > ")
        if(typeof args != 'object'){ // 修正类型检查
            console.warn("傲雪框架 > showSlot参数类型不是对象")
            return
        }

        const slot = args.slot
        delete args.slot

        // 动态导入 Lit 和所需的组件
        const { render, html } = await getLit();
        const { unsafeHTML } = await getUnsafeHTML();

        let litNode
        if(!slot){
            litNode= html`<axue-slot .isHiddenBorder=${args.isHiddenBorder}></axue-slot>`;
        }else if(slot instanceof Node || 1 === slot?.["_$litType$"]){
            litNode= html`<axue-slot .isHiddenBorder=${args.isHiddenBorder}><div slot="slot">${slot}</div></axue-slot>`;
        }else if( typeof slot === 'string'){
             /**处理普通字符串，无论是不是模板 */
            litNode= html`<axue-slot .isHiddenBorder=${args.isHiddenBorder}><div slot="slot">${unsafeHTML(slot)}</div></axue-slot>`;
        }else{
            /**未知类型原封不动传入*/
            litNode= html`<axue-slot .isHiddenBorder=${args.isHiddenBorder}><div slot="slot">${slot}</div></axue-slot>`;
        }

        //绕过索引bug，否则每次渲染到同一个cache上，会被忽略
        const div = document.createElement("div")
        render(litNode, div); //模板转节点，但不渲染
        /**先渲染进缓存，计算尺寸 */
        const cache = document.getElementById(util.axueFrameGloballyUniqueCache)
        render(div, cache); //模板转节点
        // 使用 setTimeout 以便在计算尺寸和追加之前完成渲染
        setTimeout(()=>{
            const slotSize = axueFrameFunc.getPositionAndSize(cache.firstElementChild)
            const slotContainer =document.getElementById(util.axueFrameGloballyUniqueUnderSlot)
            render(cache.firstElementChild,slotContainer)   //渲染进dom
            axueFrameFunc.showSlotByMouse({
                slotContainer: slotContainer,
                slotSize,
                zIndex:util.axueFrameZIndex.underSlot,
            })
            this._listener()
        },4)
    }

    static _listener(){
        const slotContainer =document.getElementById(util.axueFrameGloballyUniqueUnderSlot)
        let that=this
        document.addEventListener('mousedown', function(event) {    //全局监听，也可借助主动延迟注册来避免up延迟事件的误导。
            // console.log("点击标签：",event)
            if (slotContainer === event.target || slotContainer.contains(event.target)) {
                that._listener()   //确保外围能继续监听
                return
            }else{
                that.close()
            }
        },{once:true});
    }

    // 因为使用了 lit 所以标记为 async
    static async close(){
        const slotContainer =document.getElementById(util.axueFrameGloballyUniqueUnderSlot)
        axueFrameFunc.hiddenNode(slotContainer)
        // 需要 lit 来渲染空注释
        const { render, html } = await getLit();
        const emptyComment = html``
        render(emptyComment,slotContainer)
    }
}

//弹出菜单的能力
export class showToast {
    static async send(args){
        if(typeof args != 'object'){ // 修正类型检查
            console.warn("傲雪框架 > showToast参数类型不是对象")
            return
        }
        const slot = args.slot
        delete args.slot

        // 动态导入 Lit 和所需的组件
        const { render, html } = await getLit();
        const { unsafeHTML } = await getUnsafeHTML();

        let litNode
        if(!slot){
            litNode= html`<axue-toast-slot .args=${args}></axue-toast-slot>`;
        }else if(slot instanceof Node || 1 === slot?.["_$litType$"]){
            litNode= html`<axue-toast-slot .args=${args}><div slot="slot">${slot}</div></axue-toast-slot>`;
        }else if( typeof slot === 'string'){
             /**处理普通字符串，无论是不是模板 */
            litNode= html`<axue-toast-slot .args=${args}><div slot="slot">${unsafeHTML(slot)}</div></axue-toast-slot>`;
        }else{
            /**未知类型原封不动传入*/
            litNode= html`<axue-toast-slot .args=${args}><div slot="slot">${slot}</div></axue-toast-slot>`;
        }

        const toast =document.getElementById(util.axueFrameGloballyUniqueToastModal)
        render(litNode,toast)   //渲染进dom
        axueFrameFunc.showNode(toast)  //需要重置上一次的关闭效果
        this._listener()
    }

    static _listener(){
        let that=this
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            that.close()
        },{once:true});
    }

    // 因为使用了 lit 所以标记为 async
    static async close(){
        const toast =document.getElementById(util.axueFrameGloballyUniqueToastModal)
        axueFrameFunc.hiddenNode(toast)
        // 需要 lit 来渲染空注释
        const { render, html } = await getLit();
        const emptyComment = html``
        render(emptyComment,toast)
    }
}

//弹出tip的能力
export class showTip {
    static _config={}
    // 因为使用了 lit 和组件，所以标记为 async
    static async _send(message,type){
        if(typeof message != 'string'){ // 修正类型检查
            console.warn("傲雪框架 > showTip参数类型不是字符串")
            return
        }
        //构建组件参数
        let args={}
        args.icon=type    //使用类型图标
        args.backgroundColor=this._config.backgroundColor    //使用配置的背景色
        args.message=message

        // 动态导入 Lit 和所需的组件
        const { render, html } = await getLit();

        let  litNode= html`<axue-tip .args=${args}></axue-tip>`;
        const tip =document.getElementById(util.axueFrameGloballyUniqueTip)
        render(litNode,tip)   //渲染进dom
        axueFrameFunc.showNode(tip)   //需要重置上一次的关闭效果
        setTimeout(() => {
           this.close()
        }, this._config.duration ?? 1500 );
    }

    static config(config){
        //过滤配置
        this._config.duration=config.duration
        this._config.backgroundColor=config.backgroundColor
    }

    //实际允许传入多参数
    static send(...args){
        let message
        if (arguments.length === 0) {
            message='[axue] 没有传入参数呢';
        } else {
            message= args.map(arg => {
                if (typeof arg === 'object' && arg !== null) { // 添加 null 检查
                    try {
                        return JSON.stringify(arg);
                    } catch (e) {
                         return String(arg); // 备用处理循环引用或复杂对象
                    }
                } else {
                    return String(arg);
                }
            }).join("");
        }

        if(message.length>100){
            message=message.substring(0, 100)+"...";
        }
        // 调用异步的 _send 方法
        this._send(message,null);
    }

    static info(message){
        this._send(message,"info")
    }

    static success(message){
        this._send(message,"success")
    }

    static warning(message){
        this._send(message,"warning")
    }

    static error(message){
        this._send(message,"error")
    }

    // 因为使用了 lit 所以标记为 async
    static async close(){
        const tip =document.getElementById(util.axueFrameGloballyUniqueTip)
        axueFrameFunc.hiddenNode(tip)
        // 需要 lit 来清除内容（可选，但使用 render 是个好习惯）
        const { render, html } = await getLit();
         const emptyComment = html``;
         render(emptyComment, tip);
    }
}

//弹出属性栏的能力
export class showPropertyBar {
    static async send(args){
        if(typeof args != 'object'){ // 修正类型检查
            console.warn("傲雪框架 > showPropertyBar参数类型不是对象")
            return
        }

        const slot = args.slot
        delete args.slot

        // 动态导入 Lit 和所需的组件
        const { render, html } = await getLit();
        const { unsafeHTML } = await getUnsafeHTML();

        let litNode
        if(!slot){
            litNode= html`<axue-property-bar .args=${args} .close=${this.close}></axue-property-bar>`;
        }else if(slot instanceof Node || 1 === slot?.["_$litType$"]){
            litNode= html`<axue-property-bar .args=${args} .close=${this.close}><div slot="slot">${slot}</div></axue-property-bar>`;
        }else if( typeof slot === 'string'){
             /**处理普通字符串，无论是不是模板 */
            litNode= html`<axue-property-bar .args=${args} .close=${this.close}><div slot="slot">${unsafeHTML(slot)}</div></axue-property-bar>`;
        }else{
            /**未知类型原封不动传入*/
            litNode= html`<axue-property-bar .args=${args} .close=${this.close}><div slot="slot">${slot}</div></axue-property-bar>`;
        }

        //先写进新的div，绕过索引bug，否则每次渲染到同一个cache上，会被忽略
        const div = document.createElement("div")
        render(litNode, div); //模板转节点，但不渲染
        const propertyBar =document.getElementById(util.axueFrameGloballyUniqueProperBar)
        // 原来的代码在这里渲染了 `div` 而不是 `div.firstElementChild`，这可能是一个潜在的 bug
        // 将 div 的内容渲染到 propertyBar 容器中
        if (div.firstElementChild) {
             render(div.firstElementChild, propertyBar);   //渲染进dom
        } else {
             // 处理渲染结果可能是注释或空 div 的情况
             render(div.childNodes, propertyBar); // 渲染所有子节点
        }

        axueFrameFunc.showNode(propertyBar)
        this._listener()
    }

    static _listener(){
        let that=this
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            that.close()
        },{once:true});
    }

    // 因为使用了 lit 所以标记为 async
    static async close(){
        const propertyBar =document.getElementById(util.axueFrameGloballyUniqueProperBar)
        axueFrameFunc.hiddenNode(propertyBar)
        // 需要 lit 来渲染空注释
        const { render, html } = await getLit();
        const emptyComment = html``;
        render(emptyComment, propertyBar);
    }
}


/**
 * 弹出子页面的能力
 */
export class showPage {
    static async send(args){
        if(typeof args != 'object'){ // 修正类型检查
            console.warn("傲雪框架 > showPage参数类型不是对象")
            return
        }
        const slot = args.slot
        delete args.slot

        // 动态导入 Lit 和所需的组件
        const { render, html } = await getLit();
        const { unsafeHTML } = await getUnsafeHTML();

        let litNode
        if(!slot){
            litNode= html`<axue-page .args=${args}></axue-page>`;
        }else if(slot instanceof Node || 1 === slot?.["_$litType$"]){
            litNode= html`<axue-page .args=${args}><div slot="slot">${slot}</div></axue-page>`;
        }else if( typeof slot === 'string'){
            /**处理普通字符串，无论是不是模板 */
            litNode= html`<axue-page .args=${args}><div slot="slot">${unsafeHTML(slot)}</div></axue-page>`;
        }else{
            /**未知类型原封不动传入*/
            litNode= html`<axue-page .args=${args}><div slot="slot">${slot}</div></axue-page>`;
        }
        // console.log("测试showPage：",litNode)
        const pageContainer =document.getElementById(util.axueFrameGloballyUniquePageModal)
        render(litNode,pageContainer)   //渲染进dom
        axueFrameFunc.showNode(pageContainer)  //需要重置上一次的关闭效果
        this._listener()
    }

    static _listener(){
        let that=this
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            that.close()
        },{once:true});
    }

    // 因为使用了 lit 所以标记为 async
    static async close(){
        const pageContainer =document.getElementById(util.axueFrameGloballyUniquePageModal)
        axueFrameFunc.hiddenNode(pageContainer)
        // 需要 lit 来渲染空注释
        const { render, html } = await getLit();
        const emptyComment = html``
        render(emptyComment,pageContainer)
    }
}



/**
 * 弹出编辑页面的能力
 */
export class showEdit {
    static async send(args){
        if(typeof args != 'object'){ // 修正类型检查
            console.warn("傲雪框架 > showEdit参数类型不是对象")
            return
        }
        const slot = args.slot
        delete args.slot

        // 动态导入 Lit 和所需的组件
        const { render, html } = await getLit();
        const { unsafeHTML } = await getUnsafeHTML();

        let litNode
        if(!slot){
            litNode= html`<axue-edit .args=${args}></axue-edit>`;
        }else if(slot instanceof Node || 1 === slot?.["_$litType$"]){
            litNode= html`<axue-edit .args=${args}><div slot="slot">${slot}</div></axue-edit>`;
        }else if( typeof slot === 'string'){
             /**处理普通字符串，无论是不是模板 */
            litNode= html`<axue-edit .args=${args}><div slot="slot">${unsafeHTML(slot)}</div></axue-edit>`;
        }else{
            /**未知类型原封不动传入*/
            litNode= html`<axue-edit .args=${args}><div slot="slot">${slot}</div></axue-edit>`;
        }
        // console.log("测试showEdit：",litNode)
        const editContainer =document.getElementById(util.axueFrameGloballyUniqueEditModal)
        render(litNode,editContainer)   //渲染进dom
        axueFrameFunc.showNode(editContainer)  //需要重置上一次的关闭效果
        this._listener()
    }

    static _listener(){
        let that=this
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            that.close()
        },{once:true});
    }

    // 因为使用了 lit 所以标记为 async
    static async close(){
        const editContainer =document.getElementById(util.axueFrameGloballyUniqueEditModal)
        axueFrameFunc.hiddenNode(editContainer)
        // 需要 lit 来渲染空注释
        const { render, html } = await getLit();
        const emptyComment = html``
        render(emptyComment,editContainer)
    }
}

//默认最低层级
function checkModuleZIndex(zIndex) {
    // 将输入值转换为数值
    const parsedZIndex = parseFloat(zIndex);

    // 判断是否为合法的数值，且在指定范围内
    if (!isNaN(parsedZIndex) && parsedZIndex >= util.axueFrameZIndex.hiddenModule_min  && parsedZIndex <= util.axueFrameZIndex.hiddenModule_max ) {
        return Math.floor(parsedZIndex); // 返回整数形式的层级值
    } else {
        return util.axueFrameZIndex.hiddenModule_min; // 返回最小值
    }
}
// uuid 导入保持静态
import { v4 as uuidv4 } from 'uuid';

/**
 * 弹出隐藏模块的能力，需要自定义层级
 */
export class showModule {
    static async send(args){
        // console.error("傲雪框架 > ")
        if(typeof args != 'object'){ // 修正类型检查
            console.warn("傲雪框架 > showModule参数类型不是对象")
            return
        }
        args.zIndex=checkModuleZIndex(args.zIndex)
        const slot = args.slot
        delete args.slot
        let myCallback = () => {};
        args.onClose=args.onClose??myCallback
        let id=uuidv4()   //别浪费尺寸

        // 动态导入 Lit 和所需的组件
        const { render, html } = await getLit();
        const { unsafeHTML } = await getUnsafeHTML();


        let litNode

        if(!slot){
            litNode= html`<axue-module data-key=${id} .args=${args} ></axue-module>`;
        }else if(slot instanceof Node || 1 === slot?.["_$litType$"]){
            litNode= html`<axue-module data-key=${id} .args=${args} ><div slot="slot">${slot}</div></axue-module>`;
        }else if( typeof slot === 'string'){
             /**处理普通字符串，无论是不是模板 */
            litNode= html`<axue-module data-key=${id} .args=${args}><div slot="slot">${unsafeHTML(slot)}</div></axue-module>`;
        }else{
            /**未知类型原封不动传入*/
            litNode= html`<axue-module data-key=${id} .args=${args}><div slot="slot">${slot}</div></axue-module>`;
        }


        //绕过索引bug，否则每次渲染到同一个cache上，会被忽略
        const div = document.createElement("div")
        render(litNode, div); //模板转节点，但不渲染
        /**先渲染进缓存，计算尺寸 */
        const cache = document.getElementById(util.axueFrameGloballyUniqueCache)
        render(div, cache); //模板转节点
        // 使用 setTimeout 以便在计算尺寸和追加之前完成渲染
        setTimeout(()=>{
            // 检查 cache.firstElementChild 是否存在，然后再访问其子节点
            if (cache.firstElementChild && cache.firstElementChild.firstElementChild) {
                const slotSize = axueFrameFunc.getPositionAndSize(cache.firstElementChild.firstElementChild); // 实际模块元素的尺寸和位置
                 const moduleContainer =document.getElementById(util.axueFrameModuleContainer);
                // 将缓存 div 中的实际组件元素追加到 dom 中
                moduleContainer.appendChild(cache.firstElementChild.firstElementChild);   //渲染进dom
                let instance = moduleContainer.lastElementChild;
                axueFrameFunc.draggable(instance);   //可拖动
                axueFrameFunc.showSlotByMouse({
                    slotContainer: instance,
                    slotSize,
                    zIndex:args.zIndex,
                });
            } else {
                 console.warn("傲雪框架 > showModule: 渲染到缓存 div 后的元素结构不符合预期.");
            }

        },4)
        return id
    }

    static close(id){
        if(!id){
            console.warn("傲雪框架 > showModule关闭id参数未传递")
            return
        }
        // 使用 data-key 属性查找模块元素
        const moduleElement = document.querySelector(`axue-module[data-key="${id}"]`); // 根据组件标签和 data-key 选择
        // console.error("删除的moduleContainer",moduleElement)
        if(moduleElement){
            // 如果存在 onClose 回调，则在移除之前触发
             if (moduleElement.args && typeof moduleElement.args.onClose === 'function') {
                 moduleElement.args.onClose();
             }
            moduleElement.remove()
        } else {
            console.warn(`傲雪框架 > showModule未能找到id为 ${id} 的模块元素进行关闭`);
        }
    }
}