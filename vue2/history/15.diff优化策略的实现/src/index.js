import { initGlobalApi } from "./global-api"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifeCycle"
import { stateMixin } from "./state"
import { renderMixin } from "./vdom"


function Vue(options){
  this._init(options)
}
//向原型上注入实例方法
initMixin(Vue) // 向原型上注入 _init 以及 $mount 方法
lifecycleMixin(Vue) //向原型上注入 _update 方法
renderMixin(Vue) // 向原型上注入 _render _c _v _s 等方法
stateMixin(Vue) // 注入 $nextTick 和 $watch
initGlobalApi(Vue) //注入到构造函数的方法 如mixin


import { compilerToFunctions } from "./compiler"
import { patch,createElm } from "./vdom/patch"
const vm1 = new Vue({
  data(){
    return {
      name:'yyfeng'
    }
  }
})
let render1 = compilerToFunctions(`<ul>
  <li key="A">A</li>
  <li key ="B">B</li>
  <li key ="C">C</li>
</ul>`)
let vNode1 = render1.call(vm1)
document.body.appendChild(createElm(vNode1))

const vm2 = new Vue({
  data(){
    return {
      name:'yyfeng2'
    }
  }
})
let render2 = compilerToFunctions(`<ul>
  <li key="C">C</li>
  <li key="B">B</li>
  <li key="A">A</li>
</ul>`)
let vNode2 = render2.call(vm2)

setTimeout(() => {
  patch(vNode1,vNode2)
}, 3000);

export default Vue