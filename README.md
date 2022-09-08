# react-source-code-explore
vue 源码探索 参考文章  https://juejin.cn/post/6935344605424517128

# vue2 History

## rollup 环境搭建

## Vue响应式原理实现，对象属性劫持

## 实现对数组方法对劫持

## 模版编译原理 将模版转化成AST语法树

## 代码生成 

## 虚拟dom 生成

## 通过虚拟dom生成真实dom

## 渲染更新=> 依赖收集&派发更新  dep 收集watcher 以及watcher 更新

## 渲染更新 => 让watcher也记忆dep 这样如果组件卸载了 就可以把组件的依赖也删除了 包括后续的computer Watcher也能用到

## 渲染更新 => 数组的改变也要触发渲染更新

## nextTick的实现

## computed 的实现

## watch 的实现  在init创建的时候就已经创建watcher  watcher中的getter对应的就是取值函数 这个时候执行的就会执行对应属性的收集依赖 这个时候依赖已经被收集在dep中了

## Vue.mixin 以及生命周期的实现

## diff 优化策略的实现

## 完整diff的实现

## Vue的全局API的实现 如：Vue.use Vue.component Vue.extend Vue.set Vue.mixin
