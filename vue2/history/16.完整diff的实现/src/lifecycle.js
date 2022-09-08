import Watcher from "./observe/watcher"
import { patch } from "./vdom/patch"

export  function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    const vm = this
    if (vm._vNode){
      vm.$el = patch(vm._vNode,vNode)
    }else {
      vm.$el = patch(vm.$el,vNode)
    }
    vm._vNode = vNode
  }
}
export const callHook = function(vm,hook){
  const handlers = vm.$options[hook] || []
  handlers.forEach(handler => handler());
}

export function mountComponent(vm,el){
  vm.$el = el
  // //1.把render转成vNode
  // let vNode = vm._render()

  // //2.把vNode转成真实dom并挂载
  // vm._update(vNode)
  callHook(vm,'beforeMount')
  let updateComponent = () =>{
    if (vm._vNode){
      callHook(vm,'beforeUpdate')
    }
    vm._update(vm._render())
  }
  let watcher = new Watcher(vm,updateComponent,{renderWatcher:true},() =>{
    // TODO 需要判断是否是首次渲染
    if (vm._vNode){
      callHook(vm,'updated')
    }
    
  })
  callHook(vm,'mounted')
}