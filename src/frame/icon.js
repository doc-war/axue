/**
 * vite默认支持file-loader式的体验,在开发时会是 /img.png，在生产构建后会是 /assets/img.2d8efhg.png
 * 小图标直接编译成base64，不存在路径问题
 */
import avatar from '../../public/icons/avatar.svg'
import logo from '../../public/icons/logo.png'
import close from '../../public/icons/close.svg'
import unfold from '../../public/icons/unfold.svg'
import right from '../../public/icons/right.svg'
import at from '../../public/icons/at.svg'
import add from '../../public/icons/add.svg'
import fold from '../../public/icons/fold.svg'
import search from '../../public/icons/search.svg'
import threePoint from '../../public/icons/threePoint.svg'

import typeInfo from '../../public/icons/typeInfo.svg'
import typeSuccess from '../../public/icons/typeSuccess.svg'
import typeWarning from '../../public/icons/typeWarning.svg'
import typeError from '../../public/icons/typeError.svg'
import loading from '../../public/icons/loading.svg'


/**
 * 支持两种统一输出：
 * import xxx from "icons"
 * import {axueDefaultIcon} from "icons"
 */
export  const axueDefaultIcon =   {
    avatar,  //七夜头像

    logo,    //open-wc图标
    close,   //×
    unfold,  //向下展开，默认用
    fold,    //向上收缩，展开之后用
    right,   //右边，表示进入
    at,      //@形状
    add,     //加号
    search,  //搜索号
    threePoint,   //省略号

    typeError, //错误
    typeWarning,//警告
    typeSuccess, //成功
    typeInfo,  //普通提示
    loading,   //加载提示
    
    //......
}
// console.log(axueDefaultIcon)
export default axueDefaultIcon
Object.freeze(axueDefaultIcon);   //冻结，避免运行时修改

/**
 * 单独输出
 * 需要借助URL和import.meta.url来衔接编译前后，正确获取编译后的路径
 * 不要直接使用import logo from '../..public/icons/open-wc-logo.png' 字符串，否则会出现无.svg后缀过一段时间又好了等诡异情况,并且不能智能识别publicDir，最终把路径转向了assets那边去了
 */

//png图标
// const avatar = new URL('@icons/avatar.svg', import.meta.url).href;
// //常规图标
// const logo = new URL('@icons/open-wc-logo.svg', import.meta.url).href;
// const close = new URL('@icons/close.svg', import.meta.url).href;
// const unfold = new URL('@icons/unfold.svg', import.meta.url).href;
// const right = new URL('@icons/right.svg', import.meta.url).href;
// const at = new URL('@icons/at.svg', import.meta.url).href;
// const add = new URL('@icons/add.svg', import.meta.url).href;
// const fold = new URL('@icons/fold.svg', import.meta.url).href;
// const search = new URL('@icons/search.svg', import.meta.url).href;
// const threePoint = new URL('@icons/threePoint.svg', import.meta.url).href;
// //tip图标--带圆形
// const typeInfo = new URL('@icons/typeInfo.svg', import.meta.url).href;
// const typeSuccess = new URL('@icons/typeSuccess.svg', import.meta.url).href;
// const typeWarning = new URL('@icons/typeWarning.svg', import.meta.url).href;
// const typeError = new URL('@icons/typeError.svg', import.meta.url).href;


/**
 * 如果不借助关闭public，将图标转换成base64,在业务开发层localhost的根目录不是axue，导致路径偏移
 */
// const avatar = new URL('../../public/icons/avatar.svg', import.meta.url).href;
// //常规图标
// const logo = new URL('../../public/icons/open-wc-logo.svg', import.meta.url).href;
// const close = new URL('../../public/icons/close.svg', import.meta.url).href;
// const unfold = new URL('../../public/icons/unfold.svg', import.meta.url).href;
// const right = new URL('../../public/icons/right.svg', import.meta.url).href;
// const at = new URL('../../public/icons/at.svg', import.meta.url).href;
// const add = new URL('../../public/icons/add.svg', import.meta.url).href;
// const fold = new URL('../../public/icons/fold.svg', import.meta.url).href;
// const search = new URL('../../public/icons/search.svg', import.meta.url).href;
// const threePoint = new URL('../../public/icons/threePoint.svg', import.meta.url).href;
// //tip图标--带圆形
// const typeInfo = new URL('../../public/icons/typeInfo.svg', import.meta.url).href;
// const typeSuccess = new URL('../../public/icons/typeSuccess.svg', import.meta.url).href;
// const typeWarning = new URL('../../public/icons/typeWarning.svg', import.meta.url).href;
// const typeError = new URL('../../public/icons/typeError.svg', import.meta.url).href;