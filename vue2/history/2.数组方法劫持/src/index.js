import { initMixin } from "./init"

function Vue(options){
  this._init(options)
}
//向原型上注入实例方法
initMixin(Vue)
export default Vue