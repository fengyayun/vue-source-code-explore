import { observe } from "./observe"
import { nextTick, proxy } from "./utils"
export function initState(vm){
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
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

export function stateMixin(Vue){
  Vue.prototype.$nextTick = nextTick
}