// 事件派发器（提供公共事件分发方法）
export class AxueEventDispatcher {
    /**
     * 派发配置变更事件
     * 组件可以监听此事件以实现响应式更新
     */
    static dispatchConfigEvent(detail) {
        setTimeout(() => {
            const event = new CustomEvent('axueWebComponentsConfigChanged', { detail });
            document.dispatchEvent(event);
        }, 10); // 延迟10ms，解决异步时间差问题
    }
}
