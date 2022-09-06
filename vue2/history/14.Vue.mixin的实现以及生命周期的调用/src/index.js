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
export default Vue