//一定要在最顶层导入tag.define.js，触发loadtime注册
import { defaultTagName } from  "../../default/tag.define.js"
import {AxueElement} from "../../frame/loadtime.js" //导入注册器
import { html, css, LitElement, nothing} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
//如果组件内部结构里用到，就导入
import { shareStyles } from "../../default/share.css.js"          //统一维护共享样式 
import { showSlot, showToast,showPage } from "../../default/apiImplementation.js"
import {axueFrameGloballyUniquePageModal}from "../../frame/util"
import { v4 as uuidv4 } from 'uuid';  

import "../base/MinMenu.js"
import "../base/LabelButton2.js"
import "../base/LabelInput.js"
import "../base/LabelSelect.js"
import "../base/LabelContent.js"
import "../builtin/Page.js"
import { defaultIcons } from "../../default/icon.define.js";


export class DataListManager extends LitElement { 
    static properties = {
        args: { type: Object },
        data: { type: Object },
        _customThreePoint:{type:String},
    } 
    static state = {
        _hover: {     //用于支持悬停效果
            type: Boolean,
            value:false
        },
    } 

    static styles = [
        ...shareStyles,          //注入样式
        css`
            .rowdata .rowfield{
                margin:2px;
            }
            .rowdata:hover{
                background-color:#eee;
                margin-top: -1px;
            }
            .fieldInList{
                padding:6px 20px 6px 0px;
                background-color:inherit;
                min-width:25%;
                // max-width:40%;   //8em
            }
            .fields{
                width:70%;
            }
            .showAdd{
                color:var(--brandColor,cornflowerblue)
            }
            .hiddenAdd{
                color:#9993;
            }
        `
    ]

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('axueWebComponentsConfigChanged', (event) => this.handleAxueWebComponentsConfigChanged(event));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('axueWebComponentsConfigChanged', (event) => this.handleAxueWebComponentsConfigChanged(event));
    }

    handleAxueWebComponentsConfigChanged(event) {
        //自定义修正
        const customIcon = event.detail.customIcon;
        this._customThreePoint=customIcon.threePoint
        // 手动触发组件重新渲染
        this.requestUpdate();
    }
    
    constructor() {
        super();
        let data =[
            {
                prdId:1,
                title:"傲雪项目",
                corp:"傲雪公司",
                owner:"傲雪",
                tel:"17788889999",
                createTime:"1700364852738",
            },{
                prdId:2,
                title:"青松项目",
                corp:"青松公司",
                owner:"青松",
                tel:"14455556666",
                createTime:"1700364852738",
                axueMarking:{            //组件支持的特殊条级标记
                    notDelete:true,      //表示该行不能删除
                    status:"正常",         //状态名
                    statusType:"nomal"    //正常
                }
            }
        ]
        let args={
            caption:"我的项目",
            addText:"添加项目",
            dataType:{    //定义特殊的字段类型，对应有处理机制
                "prdId":"number",
                "tel":"telephone",
            },
            idField:"prdId",    //指明索引字段，必须有
            showFieldInList:["title","corp","corp","owner","tel"],                 //列表中要显示的字段范围
            showFieldInAdd:["corp","owner","tel"],            //新增页要显示的可输入字段范围，如果包含索引字段，则表示允许用户填
            showFieldInUpdate:["corp","owner","tel"],         //编辑页要显示的可修改字段范围，如果包含索引字段，则表示用户可修改
            showFieldInDetail:["corp","owner","tel"],         //详情页要显示的字段范围，默认全部，id传不传都会显示

            onAddRow(rowdata, dataListManager){
                console.log("onAddRow回调：",rowdata, dataListManager)
                //接下来处理数据同步和修正的正异常逻辑
            },
            // onClickRow(rowdata, dataListManager){
            //     console.log("onClickRow回调：",rowdata, dataListManager)
            //     //接下来处理数据同步和修正的正异常逻辑
            // }
        }
        
        // let extendFunc=[
        //     {
        //         label:"访问文件夹",
        //         // onClick:function (rowdata){console.log("自定义菜单对应的rowdata:",rowdata)}
        //     }
        // ]
        if(!this.args || !this.data){
            console.warn("[axue] DataListManager数据属性data和结构类属性args不全,启用演示数据")
            this.args=args
            this.data=data
            // this.extendFunc=extendFunc    //不能加，否则默认就带上了
        }
    }
    
    //列表显示字段，传入显示字段数组，和行数据
    showDataInList(showFields,rowdata){
        //换算数据
        let fieldValues=[]
        for (let field of showFields){
            fieldValues.push(rowdata[field]??'')   //不过滤，防止错位   
        }

        //不允许超出4个
        let showValues=[]
        let moreValues=[]
        if(fieldValues.length>4){
            showValues = showValues.concat(fieldValues.slice(0, 3));
            moreValues = moreValues.concat(fieldValues.slice(3));
        }else{
            showValues=fieldValues
        }
        let moreStr = moreValues.join(",")
        return html`
            <div class="flex-left fields">
                ${showValues.map(
                    item => html`
                        <div class="fieldInList list-field" title=${item}>${item??''}</div>   
                    `
                )}
                ${ moreStr?
                    html`<div class="fieldInList unselect" style="color:#eca" title=${moreStr} >更多信息..</div> `
                    :nothing
                }
            </div> 
        ` 
    }
    //列表显示字段，传入显示字段数组，和行数据
    showFieldInList(showFields){
        //不允许超出4个
        let showValues=[]
        let moreValues=[]
        if(showFields.length>4){
            showValues = showValues.concat(showFields.slice(0, 3));
            moreValues = moreValues.concat(showFields.slice(3));
        }else{
            showValues=showFields
        }
        let moreStr = moreValues.join(",")
        return html`
            <div class="flex-left fields">
                ${showValues.map(
                    item => html`
                        <div class="fieldInList" title=${item}>${item}</div>   
                    ` 
                )}
                ${ moreStr?
                    html`<div class="fieldInList unselect" style="color:#ddd" title=${moreStr} >更多字段..</div> `
                    :nothing
                }      
            </div> 
        ` 
    }

    //列表字段行
    dataField(){
        return html`
           <div class="flex-between main rowfield"  style='background-color:#f1f8ff;color:#357;'} >
                ${this.showFieldInList(this.args?.showFieldInList??[])}           
            </div>
        `
    }

    //一行数据,传入datarow和在data数组中的位置索引
    dataItem(item){
        return html`
            <div class="flex-between main rowdata"  style=${this._hover? 'border-top:1px solid #eee;':nothing} 
                @click=${()=>this._clickRow(item)} 
                @mouseover=${()=>this.handleMouseOverItem(item)}
                @mouseout=${()=>this.handleMouseOutItem(item)}
            >
                ${this.showDataInList(this.args?.showFieldInList??[],item)}           
                <div style=${item._axueRuntimeMarkingHoverItem? nothing:"display:none;"} >
                    <!-- <div class="margin-right-20 unselect" @click=${(e) => {e.stopPropagation();this.showActions(item)}}>...</div> -->
                    <img src=${this._customThreePoint??defaultIcons.threePoint}  class="icon unselect"  @click=${(e) => {e.stopPropagation();this.showActions(item)}} />
                </div>
            </div>
        `
    }

    //处理整体悬停、移出
    handleMouseOver() {
        this._hover=true;
        this.requestUpdate()
    }
    handleMouseOut() {
        this._hover=false;
        this.requestUpdate()
    }
    //处理单条悬停、移出
    handleMouseOverItem(item) {
        item._axueRuntimeMarkingHoverItem = true;
    }
    handleMouseOutItem(item) {
        item._axueRuntimeMarkingHoverItem = false;
    }

    //处理菜单
    showActions(rowdata){
        let that =this   //把组件作为上下文传进去
        let defaultMenus= [
            {
                label:"编辑",
                onClick:function (){
                  that._clickEnterUpdate(rowdata)
                }
            },
            {
                label:"删除",
                onClick:function (){
                    showToast.send({
                        title: "是否真要删除？",
                        confirmText:"确认",
                        onConfirm:function (){
                            showToast.close()
                            that.data=that.data.filter( item=> item !== rowdata )
                            that.requestUpdate()
                            that._deleteRow(rowdata)
                        } ,    
                        isShowCancel:true, 
                        cancelText:"取消",
                        onCancel:function (){
                            showToast.close()
                        } ,     
                    })
                }
            }
        ]
        
        let extendMenus=[]
        if(this.extendFunc??[].length>0){
            for (let func of this.extendFunc ){
                let menu={
                    label:func.label??"自定义功能",
                    onClick:function(){
                        console.warn("[axue] dataListManager扩展功能没有注册回调")
                    }
                }
                //如果注册了，就覆盖掉默认回调
                if (func.onClick && typeof func.onClick === 'function') { 
                    menu.onClick= () => { // 确保onClick方法接收rowData作为参数
                        func.onClick(rowdata); // 调用原始的onClick方法并传入rowData参数
                    }
                }
                extendMenus.push(menu)
            }
        }

        let menus=defaultMenus.concat(extendMenus)
        let node = html`
            <axue-min-menu .args=${menus}></axue-min-menu>
        `;

        let  args = {
            slot: node,
            isHiddenBorder:true
        }
        showSlot.send(args)
    }

    
    render() {
        let dataField= this.dataField()
        let datalist = repeat(
            this.data,
            (item) => item.id,
            (item, index) => html`
                ${this.dataItem(item)}
            `
        )

        let dataTable=html`
            ${dataField}
            ${datalist}
        `
        return html`
            <div class="main" @mouseover=${this.handleMouseOver} @mouseout=${this.handleMouseOut}>
                <div class="flex-between main">
                    <div class="bold">${this.args?.caption??"我的数据"}</div>
                    <div @click=${this._clickEnterAdd} class=${this._hover?"showAdd":"hiddenAdd"}>${this.args?.addText??"+新增"}</div>
                </div>
                <div class="list-table ${this._hover? 'lightborder':''} ">
                    ${(this.data&&this.data.length>0) ? dataTable :html`
                            <div class="center main grey">无数据</div>
                        ` 
                    }
                </div>
            </div>
        `;
    }

    //内部受理打开新增页
    _clickEnterAdd(){
        enterAddPage(this.args.showFieldInAdd,this.args.idField,this)
    }

    //内部受理打开编辑页
    _clickEnterUpdate(rowdata){
        enterUpdatePage(this.args.showFieldInUpdate,rowdata,this.args.idField,this)
    }

    //内部受理打开详情页
    _clickEnterDetail(rowdata){
        let showFieldInDetail = this.args.showFieldInDetail
        if(!showFieldInDetail){
            let fields=[]
            for (let key in rowdata){
                if(key=="axueMarking" || key=="_axueRuntimeMarkingHoverItem"){    //剔除组件定义时和运行时标记
                    continue
                }
                if(key==this.args.idField){
                    fields.unshift(key)
                }else{
                    fields.push(key)
                }
            }
            showFieldInDetail=fields
        }
        enterDetailPage(showFieldInDetail,rowdata,this.args.idField,this)
    }

    

    /**
     * 处理各类开发者回调
     *  */

    //触发显示更多的事件
    _pulldown(){
        //如果有回调，就传参
        if( this.args.onPulldown &&  typeof this.args.onPulldown === 'function' ){
            this.args.onPulldown(this)
        }
    }

    //添加回调
    _addRow(rowdata){
        //先处理id问题,如果没有要补齐
        if(!rowdata[this.args.idField]){
            rowdata[this.args.idField]=uuidv4();
        }
        this.data.push(rowdata)   //更新数据，并刷新
        this.requestUpdate()
        showPage.close()    //关闭页面
        //如果有回调，就传参
        if( this.args.onAddRow &&  typeof this.args.onAddRow === 'function' ){
            this.args.onAddRow(this,rowdata)
        }
    }

    //触发显示更多的事件
    _updateRow(rowdata){
        //精准更新数据，并刷新
        let idField=this.args.idField
        var idToUpdate = rowdata[idField]; // 要删除的对象的id
        var index = this.data.findIndex(item => item[idField] === idToUpdate); // 查找要删除的对象的索引
        if (index !== -1) {
            this.data[index]=rowdata; // 使用splice方法删除特定索引的对象
        }
        
        this.requestUpdate()
        showPage.close()    //关闭页面
        //如果有回调，就传参
        if( this.args.onUpdateRow &&  typeof this.args.onUpdateRow === 'function' ){
            this.args.onUpdateRow(this,rowdata)
        }
    }

    //触发显示更多的事件
    _deleteRow(rowdata){
        let idField=this.args.idField
        var idToDelete = rowdata[idField]; // 要删除的对象的id
        var index = this.data.findIndex(item => item[idField] === idToDelete); // 查找要删除的对象的索引
        if (index !== -1) {
            this.data.splice(index, 1); // 使用splice方法删除特定索引的对象
        }
        //精准剔除数据，并刷新
        // this.data.push(rowdata)
        


        this.requestUpdate()
        showPage.close()    //关闭页面
        //如果有回调，就传参
        if( this.args.onDeleteRow &&  typeof this.args.onDeleteRow === 'function' ){
            this.args.onDeleteRow(this,rowdata)
        }
    }

    //触发显示更多的事件
    _clickRow(rowdata){
        //如果有回调，就传参
        if( this.args.onClickRow &&  typeof this.args.onClickRow === 'function' ){
            this.args.onClickRow(this,rowdata)
        }else{
            this._clickEnterDetail(rowdata)
        }
    }

} 




/**
tag.define.js
* 负责导入loadtime,完成对封装的customElement.define方法的注册
* 负责统一维护枚举&向组件开放默认的标签名
*/
AxueElement.preDefine( defaultTagName.DataListManager, DataListManager);














function  enterAddPage(editFields,idField,that){
    showPage.send({
        slot:  renderAddPage(editFields,idField,that),
        isHiddenBorder:true   
    })
}


//构建新增页
function renderAddPage(editFields,idField,that) {
    let buttonArgs={
        confirmText:"确认",
        cancelText:"取消",
        onConfirm:function(){
            const pageContainer =document.getElementById(axueFrameGloballyUniquePageModal)
            const axuePage = pageContainer.querySelector('axue-page')    /**slot要在light dom中取值*/
            const inputValues = {};
            const labelInputs = axuePage.querySelectorAll('axue-label-input'); //获取所有的input标签
            labelInputs.forEach((labelInput) => {
                const  labelInputRoot= labelInput.shadowRoot
                const inputs = labelInputRoot.querySelectorAll('input[data-key]'); // 通过 data-key 属性选择所有 input 元素
                inputs.forEach((input)=>{
                    const key = input.getAttribute('data-key'); // 读取 data-key 属性的值作为 key
                    const value = input.value;
                    inputValues[key] = value;
                })
            });
            that._addRow(inputValues)   //触发回调
        },
        onCancel:function(){
            showPage.close()
        },
    }

    //构建新增页显示字段，传入显示字段数组，和行数据
    //先换算数据
    let fieldArgs=[]
    let isIdCanAdd=false
    for (let field of editFields){
        let kv={
            key:field,
            asName:null
        }
        let args={
            labelText:kv.asName??kv.key,    //优先使用别名
            input:{
                value:"",
                key:kv.key,
                placeHolder:"请输入",
            }
        }
        if(field==idField){
            isIdCanAdd=true     //检查是否包含索引字段
            fieldArgs.unshift(args)
        }else{
            fieldArgs.push(args) 
        } 
    }

    let showFieldInAdd = html`
        <div class="main">
            ${fieldArgs.map(
                item => html`
                    <axue-label-input .args=${item} ></axue-label-input>    
                ` 
            )}       
        </div> 
    `
    return html`
        <div>
            <axue-logo-close @click-close=${()=>{showPage.close()}}></axue-logo-close>
            ${showFieldInAdd}
            <axue-label-button-2 .args=${buttonArgs}></axue-label-button-2>
        </div>
    `;
}


//进入编辑页，要特别处理id问题
function  enterUpdatePage(editFields,rowdata,idField,that){
    showPage.send({
        slot:  renderUpdatePage(editFields,rowdata,idField,that),
        isHiddenBorder:true   
    })
}


//构建新增页
function renderUpdatePage(editFields,rowdata,idField,that) {

    let buttonArgs={
        confirmText:"更新",
        cancelText:"取消",
        onConfirm:function(){
            const pageContainer =document.getElementById(axueFrameGloballyUniquePageModal)
            const axuePage = pageContainer.querySelector('axue-page')    /**slot要在light dom中取值*/
            const inputValues = {};
            const labelInputs = axuePage.querySelectorAll('axue-label-input'); //获取所有的input标签
            // console.log(labelInputs)
            labelInputs.forEach((labelInput) => {
                const  labelInputRoot= labelInput.shadowRoot
                const inputs = labelInputRoot.querySelectorAll('input[data-key]'); // 通过 data-key 属性选择所有 input 元素
                inputs.forEach((input)=>{
                    const key = input.getAttribute('data-key'); // 读取 data-key 属性的值作为 key
                    const value = input.value;
                    inputValues[key] = value;
                })
            });
            that._updateRow(inputValues)  //触发回调
        },
        onCancel:function(){
            showPage.close()
        },
    }

    //构建编辑页显示字段，传入显示字段数组，和行数据
    //先换算数据
    let fieldArgs=[]
    let isIdCanEditor=false
    for (let field of editFields){
        let kv={
            key:field,
            asName:null,
            value:rowdata[field]??''   //不过滤，防止错位   
        }
        let args={
            labelText:kv.asName??kv.key,    //优先使用别名
            input:{
                value:kv.value,
                key:kv.key,
                placeHolder:"请输入",
            }
        }
        if(field==idField){
            isIdCanEditor=true     //检查是否包含索引字段
            fieldArgs.unshift(args)
        }else{
            fieldArgs.push(args) 
        }  
    }

    /**
     * 特别处理id参数
     * 如果可编辑，归入常规列表
     * 如果不包含可编辑，需要单独提取出来，显示，但不可编辑
    */
    let idArgs
    let showIdFieldInUpdate=nothing
    if (!isIdCanEditor){
        let kv={
            key:idField,
            asName:null,
            value:rowdata[idField]??''   //不过滤，防止错位   
        }
        idArgs={
            labelText:kv.asName??kv.key,    //优先使用别名
            input:{
                value:kv.value,
                key:kv.key,
                placeHolder:"无id是不正确的",
                disabled:true,
            }
        }
        showIdFieldInUpdate= html`
        <div class="main">
            <axue-label-input .args=${idArgs} ></axue-label-input>       
        </div> 
    `
    }
    
    let showFieldInUpdate = html`
        <div class="main">
            ${fieldArgs.map(
                item => html`
                    <axue-label-input .args=${item} ></axue-label-input>    
                ` 
            )}       
        </div> 
    `
    return html`
        <div>
            <axue-logo-close @click-close=${()=>{showPage.close()}}></axue-logo-close>
            ${showIdFieldInUpdate} 
            ${showFieldInUpdate}
            <axue-label-button-2 .args=${buttonArgs}></axue-label-button-2>
        </div>
    `;
}

//进入详情页，页要特别处理id问题
function  enterDetailPage(showFields,rowdata,idField,that){
    showPage.send({
        slot:  renderDetailPage(showFields,rowdata,idField,that),
        isHiddenBorder:true   
    })
}


//构建详情页页
function renderDetailPage(showFields,rowdata,idField,that) {
    let buttonArgs={
        confirmText:"关闭",
        cancelText:"编辑",
        onConfirm:function(){
            showPage.close()
        },
        onCancel:function(){
            showPage.close()
            that._clickEnterUpdate(rowdata)   //重新触发子页面
        },
    }

    //构建编辑页显示字段，传入显示字段数组，和行数据
    //先换算数据
    let fieldArgs=[]
    let isIncludeId=false
    for (let field of showFields){
        if(field==idField){
            isIncludeId=true     //检查是否包含索引字段
        }
        let kv={
            key:field,
            asName:null,
            value:rowdata[field]??''   //不过滤，防止错位   
        }
        let args={
            labelText:kv.asName??kv.key,    //优先使用别名
            content:{
                value:kv.value,
                key:kv.key,
            }
        }
        if(field==idField){
            isIncludeId=true     //检查是否包含索引字段
            fieldArgs.unshift(args)
        }else{
            fieldArgs.push(args) 
        }  
    }
    /**
     * 特别处理id参数
     * 如果可编辑，归入常规列表
     * 如果不包含可编辑，需要单独提取出来，显示，但不可编辑
    */
    let idArgs
    let showIdFieldInDetail=nothing
    if (!isIncludeId){
        let kv={
            key:idField,
            asName:null,
            value:rowdata[idField]??''   //不过滤，防止错位   
        }
        idArgs={
            labelText:kv.asName??kv.key,    //优先使用别名
            content:{
                value:kv.value,
                key:kv.key,
            }
        }
        showIdFieldInDetail= html`
        <div class="main">
            <axue-label-content .args=${idArgs} ></axue-label-content>       
        </div> 
    `
    }
    
    let showFieldInUpdate = html`
        <div class="main">
            ${fieldArgs.map(
                item => html`
                    <axue-label-content .args=${item} ></axue-label-content>    
                ` 
            )}       
        </div> 
    `
    return html`
        <div>
            <axue-logo-close @click-close=${()=>{showPage.close()}}></axue-logo-close>
            ${showIdFieldInDetail} 
            ${showFieldInUpdate}
            <axue-label-button-2 .args=${buttonArgs}></axue-label-button-2>
        </div>
    `;
}

