import { initState } from "./state"
import { compilerToFunctions } from "./compiler"

export function initMixin(Vue){
  Vue.prototype._init = function(options){
    const vm = this
    // vue实例属性都会加一个$开头来区分用户的变量
    vm.$options = options

    //初始化状态
    initState(vm)

    if (vm.$options.el){
      //挂载逻辑都聚合在$mount中 因为有时候用户可以不传el而是直接调用$mount
      this.$mount(vm.$options.el)
    }

  }
  Vue.prototype.$mount = function(el){
    const vm = this
    const options = vm.$options
    //执行的优先级是 render => options中的template => 模版中的template
    el = document.querySelector(el)
    if (!options.render){
      let template = options.template
      if (!template){
        //有兼容问题暂不考虑
        template = el.outerHTML
      }
      const render = compilerToFunctions(template)
      options.render = render
    }
  }
}