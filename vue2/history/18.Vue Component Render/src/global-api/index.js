import { isObject, mergeOptions } from "../utils"
import { nextTick } from "../utils"
import { defineReactive } from "../observe"

export const initGlobalApi = (Vue) =>{
  Vue.options = {}
  Vue.options._base = Vue
  Vue.mixin = function (mixin) {
    Vue.options = mergeOptions(this.options,mixin)
    return this //保障链式调用
  }

  Vue.use = function(...args){
    const plugin = args[0]
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      // 如果安装过这个插件直接返回
      return this;
    }
    args = args.slice(1)// 获取参数
    args.unshift(this); //在参数中增加Vue构造函数
    if (typeof plugin.install === "function") {
      plugin.install.apply(plugin, args); // 执行install方法
    } else if (typeof plugin === "function") {
      plugin.apply(null, args); // 没有install方法直接把传入的插件执行
    }
    // 记录安装的插件
    installedPlugins.push(plugin);
    return this;
  }

  Vue.nextTick = nextTick

  Vue.set = function(target,key,value){
    if (Array.isArray(target)){
      // 如果是数组直接调用重写的splice 方法 来达到更新
      target.length = Math.max(target.length,key)
      target.splice(key,1,value)
      return value
    }
    //如果是对象本身的属性 说明已经添加过的依赖 就直接赋值即可
    if (key in target && !(key in Object.prototype)){
      target[key] = value
      return value
    }
    const ob = target.__ob__
    if (!ob){
      // 说明这个对象都不是响应式的 那直接赋值就行了
      target[key] = value
      return value
    }
    //利用defineReactive 将新增的属性定义成响应式
    defineReactive(ob.value,key,value)
    ob.dep.notify()
    return value
  }
  Vue.del = function(target,key){
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    const ob = target.__ob__;
    // 如果对象本身就没有这个属性 什么都不做
    if (!hasOwn(target, key)) {
      return;
    }
    // 直接使用delete  删除这个属性
    delete target[key];
    //   如果对象本身就不是响应式 直接返回
    if (!ob) {
      return;
    }
    ob.dep.notify(); //通知视图更新
  }
  Vue.extend = function (options){
    function Sub(){
      this._init(options)
    }
    Sub.prototype = Object.create(Vue.prototype)
    Sub.prototype.constructor = Sub
    //组件的options 挂到构造函数属性上去
    Sub.options = options
    return Sub
  }
  // 组件、指令、过滤器
  let ASSET_TYPES = ["component", "directive", "filter"];
  ASSET_TYPES.forEach((type) =>{
    Vue[type] = function (id,definition){
      if (!definition){
        return this.options[type+'s'][id]
      }
      if (type === 'component' && isObject(definition)){
        definition.name = definition.name || id
        definition = this.options._base.extend(definition)
      }
      if (type === 'directive' && typeof definition === 'function'){
        definition = {bind:definition,update:definition}
      }
      this.options[type+'s'][id] = definition
      return definition
    }
  })
}