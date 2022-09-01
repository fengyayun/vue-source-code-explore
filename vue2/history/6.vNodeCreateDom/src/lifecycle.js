import { patch } from "./vdom/patch"

export  function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    const vm = this
    vm.$el = patch(vm.$el,vNode)
  }
}
export function mountComponent(vm,el){
  vm.$el = el
  //1.把render转成vNode
  let vNode = vm._render()

  //2.把vNode转成真实dom并挂载
  vm._update(vNode)
}