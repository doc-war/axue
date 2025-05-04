/**
 * （2）（可选）导出共享资源: 默认图标、共享样式
 */
// export { axueDefaultIcon } from "./frame/icon.js"
// export { shareStyles } from './default/share.css.js';


/**
 * （3）导出 Axue 核心 API：注册、自定义标签名、样式变量、图标等
 */
import { AxueElement } from './frame/loadtime.js';
import { initAxueNodeAndFrameFunc } from './frame/util.js' 
import { AxueCustomConfig } from './frame/customConfig.js';


/**
 * （4）（可选）导出工具方法，注意，这里也有副作用，内部需要用动态导入
 */
import { 
    showTip, showPage, showSlot, showPropertyBar, showToast, showEdit, showModule 
} from "./default/api.js";



/**
 * 重新封装AxueElement，不暴露其他方法
 * 所有副作用在这里调度，返回promise，方便外围await可以等到处理完成
 */
async function init() {
    console.info("Axue init start...");
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        return Promise.all([
            // 原子域组件
            import("./elements/atom/Switch.js"),
          
            // 内置域组件
            import("./elements/builtin/Tip.js"),
            import("./elements/builtin/Slot.js"),
            import("./elements/builtin/ToastSlot.js"),
            import("./elements/builtin/PropertyBar.js"),
            import("./elements/builtin/Page.js"),
            import("./elements/builtin/Edit.js"),
            import("./elements/builtin/Module.js"),
            import("./elements/builtin/MenuY.js"),
          
            // base 域组件
            import("./elements/base/Hello.js"),
            import("./elements/base/ButtonS.js"),
            import("./elements/base/LogoClose.js"),
            import("./elements/base/LabelInput.js"),
            import("./elements/base/LabelSelect.js"),
            import("./elements/base/LabelButton2.js"),
            import("./elements/base/LabelContent.js"),
            import("./elements/base/LabelContentEdit.js"),
            import("./elements/base/MenuY2.js"),
            import("./elements/base/TabX.js"),
            import("./elements/base/HighLight.js"),
            import("./elements/base/MinMenu.js"),
          
            // container 域组件
            import("./elements/container/Between.js"),
            import("./elements/container/Left.js"),
            import("./elements/container/Right.js"),
            import("./elements/container/DataListManager.js"),
          
            // 业务域组件
            import("./elements/business/ButtonMenuY2.js"),
            import("./elements/business/AvatarMenuY2.js"),
          ]).then(() => {
            /*
              注册底层节点以及借助全局变量提供底层节点方法
              这也是API依赖的，纯粹导入API那边也会进行注册
            */
            initAxueNodeAndFrameFunc()
            // 向浏览器正式注册所有组件
            AxueElement.domRegister()
            // 挂载 API 到 window 对象上
            window.axueAPI = {
                showTip,
                showPage,
                showSlot,
                showPropertyBar,
                showToast,
                showEdit,
                showModule,
            };
            console.info("axueAPI：", window.axueAPI);
          });
    }else {
        return Promise.resolve()
    }
}

// 导出初始化函数和 API，这是使用axue组件和API的前提
export {
    init,
    showTip, showPage, showSlot, showPropertyBar, showToast, showEdit, showModule,
    AxueCustomConfig
};

export default init