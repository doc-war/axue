import { css } from 'lit';


/**
 * 影子树的根
 */
export const hostStyles=css`
    :host{
        line-height: 1;   /**应用于包含图片的容器时，它会使得文本与图片垂直居中，即使图片本身的高度可能较小 */
    }
`
/**
 * 容器
 */
export const mainStyles=css`
    /**普通全宽度容器，可以当分隔区使用*/
    .main{
        flex-grow: 1;    /*能自动计算填满*/
        font-size: 13px;
        /**不要使用width：100%，避免main之间的嵌套加边框时溢出 */
        box-sizing:border-box;   /**可以往100%宽度适配父元素带内边距的情况 */  
        padding:var(--basePadding,10px);
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
        /**  background-color:var(--bgColor,white);   */
    }
    /**slot标签本身只是占位符，不能应用class,需要在其父元素上应用 */
    .slotDiv{
        padding-top:var(--basePadding,10px);   /*插槽只隔离上下间隔即可,不要影响宽度*/
        padding-bottom:var(--basePadding,10px);  
        background-color:var(--bgColor,white);   /*与main保持一致*/
    }
    /**带梯度渐变的全width主框，废弃，在有padding的容器里会很难看*/
    .main-gradient{
        flex-grow: 1;    /*能自动计算填满*/
        /**不要使用width：100%，避免main之间的嵌套加边框时溢出 */
        box-sizing:border-box;   /**可以往100%宽度适配父元素带内边距的情况 */  
        padding:var(--basePadding,10px);
        background:linear-gradient(
            to bottom , 
            var(--bgOpacityColor, #dddddd88) 0%, 
            var(--bgColor,white)  50%
        );  
    }
    /** 相对父元素居中，比如模态内容 */
    .middle{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    /** 内容居中 */
    .center{
        text-align:center;
    }
    /** 
     * 普通容器，子元素决定宽度，比如菜单
     * 这种情况下，不应该使用padding:var(--basePadding,10px);，避免造成父子菜单之间的动态位置计算偏差。
     * 可以把代码写在menu内部
     */
    .container{
        background-color:var(--bgColor,white);
        display: inline-block;   /**父元素的宽度由子元素决定，和flex-grow互斥 */  
        padding:var(--basePadding,6px);
    }
    
    /**禁用状态背景、文字都有效 */
    .disabled {  
        opacity:var(--disabledOpacity, 0.5);

    }
    /**子元素也有效，针对菜单等父子嵌套结构 */
    .disabled > *  {  
        opacity:var(--disabledOpacity, 0.5);
    }
`
export const commonStyles=css`
    .tag{
        font-size: 10px;   /**10比smaller更小 */ 
        padding:2px 3px;
        color:var(--brandColor,red);
        background-color:#f6ffed99;
        border-radius:4px;
    }
    .unselect{
        user-select: none;     /**不要放在父元素上？ */ 
    }
    .cursor{
        cursor: pointer;   /**悬停时光标显示为手指，增强引导性 */ 
    }
    /**单独的padding配置 */
    .padding{
        padding:var(--basePadding,10px);
    }
    /**统一边框 */
    .border{
        border:1px solid var(--greyColor,#999);
        border-radius:var(--borderRadius,4px);
    }
    .lightborder{
        border:1px solid var(--greyColor,#ddd);
        border-radius:var(--borderRadius,4px);
    }
    .bold{
        font-weight:700;
    }
    .width-100-percent{
        width:100%;
    }
    .width-90-percent{
        width:90%;
    }
    .width-80-percent{
        width:80%;
    }
    .width-70-percent{
        width:70%;
    }
    .max-height-80{
        max-height:80%;
        overflow: auto;    /**子节点超出自动出滚动条，一般搭配滚动条样式一起使用**/
    }
    
`

export const animationStyles=css`
    /**定义名为slideIn、out的动画帧 */
    @keyframes topIn {    
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    @keyframes topOut {    
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    @keyframes rightIn {    
        from {
            transform: translateX(100%) translateY(0);
            opacity: 1;
        }
        to {
            
            transform: translateX(0) translateY(0);
            opacity: 1;
        }
    }
    /**定义动画样式 */
    .topIn{
        /**渐变进入 */
        animation: topIn 0.3s ease-in-out;
    }
    .topout{
        /**渐变退出 */
        animation: topOut 0.3s ease-in-out;
    }  
    .rightIn{
        /**渐变退出 */
        animation: rightIn 0.3s ease-in-out;
    }  
` 

/**
 * 最常见的label系列，标题级、普通文本、辅助备注文本，已经宽高
 */
export const labelStyles=css`
    .list-field{
        white-space: nowrap;    /* 不会换行 */
        overflow: hidden;    /* 超长隐藏 */
        text-overflow: ellipsis;    /* 超长省略 */
        max-width: 8em !important;     /* 10ch最大字符数为10对英文是20个，em则对中英文都适用 */
    }
    .label-title{  /*一般用于页面标题 */
        font-size:16px;
        font-weight:800;
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
    }
    .label-text{   /*主要的label样式*/
        font-size:13px;
        flex-shrink:1;
        width:160px;      /*需要特别设置下左边的宽度*/
        text-align:right;
        user-select: none;   /**禁止可选效果，和menu-text保持一致 */
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
    }
    .label-content{   /*主要的label样式*/
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
        flex-shrink:1;
        text-align:right;
        user-select: none;   /**禁止可选效果，和menu-text保持一致 */
    }
    .label-editText{   /*主要的label样式*/
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
        flex-shrink:1;
        max-width:160px;      /*需要特别设置下左边的宽度*/
        text-align:right;
        user-select: none;   /**禁止可选效果，和menu-text保持一致 */
    }
    .label-required{   /*必填样式*/
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
        text-align:right;
        color:lightcoral;            
    }
    .label-marker{  /*一般用于marker类场景*/
        font-size:12px;
        color:var(--assistColor,#999);
    }

    /**
     * 输入框、选择框等应该保持同样的宽高、垂直居中、最低宽度
     */
    .label-container{
        margin: 15px auto;   /**上下留白 */
        padding-left:10px;   /**不要太靠边 */
        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content:start;
        min-width:400px;
    }
    /**用label-frame代表各类输入选择框，节约记忆 */
    .label-frame{
        flex-grow: 1;    /*能自动计算填满*/
        box-sizing: border-box;    /**相比content-box,总的宽度，不存在外边距 */
        min-width:60%;
        height:var(--lineHeight,30px);  
        padding:4px 6px;
        margin-left:1rem;      /**；label和输入框、选项框之间，应该有一定间隔留白 */
        border-radius:var(--borderRadius,4px);
        border-width: 1px;   /**解决input受radio影响显示2px的bug */
        display: flex;
        align-items: center;  /* 垂直居中 */
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
    }
    .select {
        /* 隐藏默认的下拉箭头,分别是webkit、火狐、浏览器标准 */
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        /* 
            但是content属性配合::after来重写图标，会影响底层input,导致奇怪bug，因此不方便替换
            如果不需要去掉下拉图标，只用label-frame就够了
         */
    }
`

/**
 * 菜单
 */
export const menuStyles=css`
    .menu-container{
        flex-grow: 1;    /*能自动计算填满*/
        padding:var(--basePadding,10px);
        background-color:var(--bgColor,white); 
        width:200px     /*尽量与label略保持一致，接近640宽度的1/4的取值原则，但160确实小了点，menu+label基本等于填写区*/
    }
    .menu-container:hover{
        background-color:#eee;; 
    }
    .menu-container:active{
        background-color:#e9e9e9;
    }
    .menu-text{
        max-width:140px;  
        user-select: none;   /**禁止可选效果，和label-text保持一致 */
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
    }
`

//拖动性
export const dragStyles=css`
    .drag{   /*注意shadow会屏蔽*/
        -webkit-app-region: drag;       /* 注意，一拖拽允许会屏蔽点击事件，二，只适用于electronm，并且是以对整个窗口的拖动，而不是组件本身 */
    }
    .nodrag{
        -webkit-app-region: no-drag;  
    }
`

/**
 * 图标处理，包括icon和头像
 */
export const  iconStyles = css`
    .minLogo{
        animation: app-logo-spin infinite 20s linear;
        width:var(--minIconSize, 20px);
        height:var(--minIconSize, 20px);
        user-select: none; 
    }
    .minIcon {
        width:var(--minIconSize, 20px);
        height:var(--minIconSize, 20px);
        user-select: none; 
    }
    .logo{
        animation: app-logo-spin infinite 20s linear;
        width:var(--iconSize, 24px);
        height:var(--iconSize, 24px);
        user-select: none; 
    }
    .icon {
        width:var(--iconSize, 24px);
        height:var(--iconSize, 24px);
        user-select: none; 
    }
    .avatar{
        width:var(--iconSize, 24px);
        height:var(--iconSize, 24px);
        border-radius: 50%; /* 将图像剪裁为圆形 */  
        user-select: none; 
        /* 添加过渡效果，使光晕变化平滑 */
        transition: box-shadow 0.3s ease-in-out;
    }
    .avatar:hover {
        /* 悬停时样式，添加光晕效果 */
        box-shadow: 0 0 3px 3px rgba(200, 220, 255, 0.5);
      }
`;

/**
      原生按钮处理： 
 */
export const  buttonStyles = css`
    .button {      /*常规按钮，白色*/
        padding:6px 18px;
        border:1px solid rgba(150,150,150,0.5);
        border-radius:var(--borderRadius,4px);
        color:black;
        background-color: white;
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
    }
    .button-main {    /*主按钮，带前景色背景，没有指定的话，就采用浅蓝*/
        padding:6px 18px;
        border:1px solid rgba(150,150,150,0.5);
        border-radius:var(--borderRadius,4px);
        color: var(--baseColor, black);      /*白色，还是黑色，都是一个问题？*/
        background-color: var(--brandColor, lightblue);
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
    }
    .button-cancel {     /*副按钮，带灰色，没有指定的话，就采用白色*/
        padding:6px 18px;
        border:1px solid rgba(150,150,150,0.5);
        border-radius:var(--borderRadius,4px);
        color: var(--baseColor, black);  
        background-color: var(--greyColor, white);
        font-size: var(--baseHtmlRem,14px);
        font-family: var(--baseFontFamily);
    }
`;


/**
 * 布局处理
 */
export const  flexStyles = css`
    .flex-left{
        display:flex;
        justify-content:flex-start;
        align-items: center;         /**针对所有元素，不止文本，可以解决繁琐的line高度 */
    }
    .flex-right{
        display:flex;
        justify-content:flex-end;
        align-items: center; 
    }
    .flex-between{
        display:flex;
        justify-content:space-between;
        align-items: center; 
    }
    .flex-center{
        display:flex;
        justify-content:center;
        align-items: center; 
    }
`;

/**
 * 高度适应下的居中处理
 */
// export const  heightStyles = css`
//     .height20{
//         line-height:20px;
//         height:20px;
//     }
//     .height24{
//         line-height:24px;
//         height:24px;
//     }
//     .height36{
//         line-height:36px;
//         height:36px;
//     }
//     .height48{
//         line-height:48px;
//         height:48px;
//     }
// `;


/**
 * 间距，一般用于上下结构，可以特别支持行占位结构
 */
export const  spacingStyles = css`
    /**距离50 */
    .margin-top-50{     /**上边距50 */
        margin-top:50px;
    }
    .margin-bottom-50{   /**底边距50 */
        margin-bottom:50px;
    }
    .margin-left-50{     /**左边距50 */
        margin-left:50px;
    }
    .margin-right-50{    /**右边距50 */
        margin-right:50px;
    }

    /**距离30 */
    .margin-top-30{     /**上边距30 */
        margin-top:30px;
    }
    .margin-bottom-30{   /**底边距30 */
        margin-bottom:30px;
    }
    .margin-left-30{     /**左边距30 */
        margin-left:30px;
    }
    .margin-right-30{    /**右边距30 */
        margin-right:30px;
    }

    /**距离20 */
    .margin-top-20{     /**上边距20 */
        margin-top:20px;
    }
    .margin-bottom-20{   /**底边距20 */
        margin-bottom:20px;
    }
    .margin-left-20{     /**左边距20 */
        margin-left:20px;
    }
    .margin-right-20{    /**右边距20 */
        margin-right:20px;
    }

    /**距离10 */
    .margin-top-10{     /**上边距10 */
        margin-top:10px;
    }
    .margin-bottom-10{   /**底边距10 */
        margin-bottom:10px;
    }
    .margin-left-10{     /**左边距10 */
        margin-left:10px;
    }
    .margin-right-10{    /**右边距10 */
        margin-right:10px;
    }

    /**距离4，一般用于图标和文字的距离 */
    .margin-left-5{     /**左边距10 */
        margin-left:5px;
    }
    .margin-right-5{    /**右边距10 */
        margin-right:5px;
    }
`;


export const  colorStyles = css`
    .blue{
        color:red;        
    }
    .green{
        color:green;        
    }
    .blue{
        color:blue;        
    }
    .grey{
        color:grey;
    }
    .lightblue{
        color:lightblue;        
    }
    .cornflowerblue{
        color:cornflowerblue;       /**中蓝色，比较好 */
    }
    .chocolate{
        color:chocolate;          /**橙色，比较好 */
    }
`;


export const  scrollbarStyles = css`
    /* 设置滚动条的宽度和颜色 */
    ::-webkit-scrollbar {
        width: 4px; /* 设置滚动条的宽度 */
        height: 4px; /* 设置滚动条的高度 */
    }
    
    /* 设置滚动条轨道的颜色 */
    ::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
    }
    
    /* 设置滚动条滑块的样式 */
    ::-webkit-scrollbar-thumb {
        background-color: #e1e1e1; /* 设置滚动条滑块的背景颜色 */
        border-radius: 2px; /* 设置滚动条滑块的圆角 */
    }
    
    /* 设置滚动条滑块在hover状态下的样式 */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #abc; /* 设置滚动条滑块在hover状态下的背景颜色 */
    }
`;



//也可以导出所有
export const shareStyles = [
   hostStyles,
   mainStyles,     //带padding的容器
   commonStyles,   //常见样式
   menuStyles,     //菜单
   labelStyles,    //label系列组件的通用样式
   dragStyles,     //可拖动，和取消
   buttonStyles,   //按钮分类
   iconStyles,     //图标、头像
   flexStyles,     //行布局
   //heightStyles,   //高度和line-height一致
   spacingStyles,   //间距
   animationStyles,  //动画
   colorStyles,
   scrollbarStyles,
]
//默认导出所有
export default shareStyles 