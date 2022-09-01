
export  function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    console.log('update')
  }
}
export function mountComponent(vm,el){
  vm.$el = el
  //1.把render转成vNode
  let vNode = vm._render()
  console.log('vNode',vNode)

  //2.把vNode转成真实dom并挂载
  // vm._update(vNode)
}