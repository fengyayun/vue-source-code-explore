import { initState } from "./state"

export function initMixin(Vue){
  Vue.prototype._init = function(options){
    const vm = this
    // vue实例属性都会加一个$开头来区分用户的变量
    vm.$options = options

    //初始化状态
    initState(vm)

  }
}