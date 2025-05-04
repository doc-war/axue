# 傲雪
面向pc端、跨框架的浏览器原生组件库，开箱即用、带各类弹框API。支持自定义标签、图标、样式，开创loadtime范式先河。

## 文档

[https://axue.doc-war.com/](https://axue.doc-war.com/)

## 安装组件库
在已有项目中引入axue
```cli
npm i axue@latest
```

## 全量注册组件
无需单个组件导入，带图片也不到200kb（es版本和umd版本各200kb）
```js
import {init} from "axue"
init()
```

## 使用组件

像div一样使用组件。
```
<div>
	<axue-logo-close></axue-logo-close>
    <p>一行代码+一个json配置，管理数据列表+增删改查</p>
    <axue-data-list-manager></axue-data-list-manager>
</div>
```

## 内置了基础弹框API
* tip，会自动关闭的小提示
* toast，人机交互对话框
* property，右侧进出的属性栏
* slot，跟随鼠标位置智能计算位置的插槽框
* page，居中呈现的子页面
* module，跟随鼠标位置智能计算、可拖拽的子模块，面向大型应用场景

```
import {showTip} from "axue";  //导入接口
showTip.send('Hello, axue!');       //不指定提示类型，左边默认显示logo图标
showTip.warning('Hello, axue!');       //指定info类型，左边默认显示warning图标
```



