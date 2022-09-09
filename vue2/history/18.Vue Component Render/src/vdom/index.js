import { isObject, isReservedTag } from "../utils"

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
  //生成vNode 要判断是否是原始标签还是自定义组件
  if (isReservedTag(tag)){
    return vNode(tag,data,data.key,children,undefined)
  }
  let Ctor = vm.$options.components[tag]
  return createComponent(vm,tag,data,data.key,children,undefined,Ctor)
}
function createComponent(vm,tag,data,key,children,text,Ctor){
  const baseCtor = vm.$options._base
  if (isObject(Ctor)){
    Ctor = baseCtor.extend(Ctor)
  }
  data.hook = {
    init(vNode){
      let child = vNode.componentInstance = new Ctor({})
      child.$mount()
    }
  }
  let component = vNode(tag,data,key,children,text,{Ctor})
  return component
}
function createTextVNode(text){
  return vNode(undefined,undefined,undefined,undefined,text)
}

function vNode(tag,data,key,children,text,componentOptions){
  return {
    tag,
    data,
    key,
    children,
    text
  }
}