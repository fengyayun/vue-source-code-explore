import Watcher from "./observe/watcher"
import { observe } from "./observe"
import { nextTick, proxy } from "./utils"
import Dep from "./observe/dep"
export function initState(vm){
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed){
    initComputed(vm)
  }
}


function initData(vm){
  let data = vm.$options.data
  data = typeof data === 'function'?data():data
  vm._data = data
  //代理是让用户设置值以及取值更方便 例如用户使用vm.name  实际上是代理到vm._data.name
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      proxy(vm,'_data',key)
    }
  }
  // 递归重新定义对象的属性 但是监听不到新增以及删除的属性(所以vue提供了$set,$delete方法)
  observe(data)
}

function initComputed(vm){
  let computed = vm.$options.computed || {}
  const watchers = vm._computedWatchers = {} //用来存放计算属性watcher
  for (const key in computed) {
    if (Object.hasOwnProperty.call(computed, key)) {
      const useDef = computed[key]
      
      let getter =  typeof useDef === 'function'?useDef:useDef.get
      watchers[key] = new Watcher(vm,getter,{lazy:true})
      defineProperty(vm,key,useDef)
    }
  }
}
function defineProperty(target,key,useDef){
  let sharedPropertyDefinition = {
    enumerable:true,
    configurable:true,
    set:() =>{},
    get:() =>{}
  }
  if (typeof useDef === 'function'){
    sharedPropertyDefinition.get = createComputedGetter(key)
    // sharedPropertyDefinition.get = useDef  这种写法就是没有任何缓存
  }else {
    sharedPropertyDefinition.get = useDef.get
    sharedPropertyDefinition.set = useDef.set
  }
  Object.defineProperty(target,key,sharedPropertyDefinition)
}

function createComputedGetter(key){
  return function (){
    let watcher = this._computedWatchers[key]
    if (watcher){
      if (watcher.dirty){
        watcher.evaluate()
      }
      if (Dep.target){
        watcher.depend()
      }
      return watcher.value
    }
  }
}

export function stateMixin(Vue){
  Vue.prototype.$nextTick = nextTick
}