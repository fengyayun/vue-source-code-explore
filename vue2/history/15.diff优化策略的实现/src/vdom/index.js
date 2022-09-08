export function renderMixin(Vue){
  Vue.prototype._render = function(){
    const vm = this
    return vm.$options.render.call(vm)
  }
  Vue.prototype._c = function (){
    return createElementVNode(this,...arguments)
  }
  Vue.prototype._v = function(text){
    return createTextVNode(text)
  }
  Vue.prototype._s = function(value){
    return !value?'':(typeof value === 'object')?JSON.stringify(value):value
  }
}


function createElementVNode(vm,tag,data,...children){
  if (!data) data = {}
  return vNode(tag,data,data.key,children,undefined)
}
function createTextVNode(text){
  return vNode(undefined,undefined,undefined,undefined,text)
}

function vNode(tag,data,key,children,text){
  return {
    tag,
    data,
    key,
    children,
    text
  }
}