/**
   min-version:1.0，更多版本如有差异，请下载版本框架代码的docs文档中找对应集合
   以下是本版本的变量集和默认值
*/



//定义几个基准变量
const baseHtmlRem = "13px";     //基准文字大小，将作为参照系，var()支持计算字符串
const basePadding = "10px";      //基准内边距，主要适用于容器组件和容器标签，实际上body和document之间默认有8px的间隔，因此没有使用20px


/**
 * 定义时，无需--前者，框架会自行添加
 */
export default {
  /**
   * 基准大小、基准字体等，都会在head里内联注入
   */
  baseHtmlRem: baseHtmlRem,   //会统一影响所有以rem定义宽高、大小的图标、文字
  baseFontFamily: "PingFangSC-Regular, PingFang SC",     //默认字体
  mainPadding:basePadding,     //容器内边距，正常不会被子元素继承
  
  //图标尺寸
  minIconSize: "20px",    //小图标
  iconSize: "2rem",       //中等大小的图标
  avatarSize: "3rem",     //头像更大一点


  //行级尺寸
  lineHeight:"2rem",       //默认行容器高度，或最低高度，应该跟input齐平
  inputHeight: "2rem",     //input的默认高度
  labelFontSize: "1rem",    //label文本的默认大小  
  captionFontSize: "15px",  //表格标题的默认大小
  markingFontSize: "10px",  //上下标的文本大小


  /** 
      品牌色、也就是全局前景色,
      一般跟黑白都是正交的，比如橙色、蓝色，用于塑造统一风格
  */
  brandColor: "#ff8822",    //品牌主色
  assistColor: "#cc8855",   //辅助色


  //常规黑白灰
  baseColor: "black", // 基本文本颜色，一般是黑色
  greyColor: "#999",  // 辅助色，一般都是灰色，好记
  placeHolderColor: "#bbb",  //占位色


  // 常规背景色
  bgOpacityColor: "##dddddd88", // 主要用于顶条渐变，从带一点点灰度又能半透明到背景的颜色，过渡到白底背景
  bgColor: "#fefefe", // 白背景
  modalBgColor: "#00000099", // 模态遮罩背景，注意，应该带透明度

  // 常规边框
  borderColor: "#dddddd",    //通用边框颜色
  borderRadius: "4px",       //圆角可能不好统一,4px一般用于窗口，对输入框、菜单等，但显然不适合button
  borderWidth: "1px",        //统一边框厚度
 
  // 禁用样式
  disabledColor: "#bbb",   // 禁用色
  disabledOpacity: "0.5",  // 方便切换透明度


  //按钮
  buttonColor:"#fefefe",
  buttonHeight:"2rem",    //应该跟inputHeight保持一致
};