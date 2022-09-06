import { mergeOptions } from "../utils"

export const initGlobalApi = (Vue) =>{
  Vue.options = {}
  Vue.mixin = function (mixin) {
    Vue.options = mergeOptions(this.options,mixin)
    return this //保障链式调用
  }
}