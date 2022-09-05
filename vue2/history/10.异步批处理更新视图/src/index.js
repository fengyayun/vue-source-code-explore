import { initMixin } from "./init"
import { lifecycleMixin } from "./lifeCycle"
import { renderMixin } from "./vdom"

function Vue(options){
  this._init(options)
}
//向原型上注入实例方法
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
export default Vue