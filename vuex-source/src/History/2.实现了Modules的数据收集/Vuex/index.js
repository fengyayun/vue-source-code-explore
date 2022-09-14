let Vue;
import ModuleCollection from "./Modules";
import { forEachValue } from "./util";
class Store {
  constructor(options) {
    // const { state, mutations, actions } = options
    this.modules = new ModuleCollection(options);
    console.log(this.modules);
  }
  get state() {
    return this._vm.state;
  }
  commit = (method, data) => {
    this.mutations[method](this.state, data);
  };
  dispatch = (method, data) => {
    this.actions[method](this, data);
  };
}
function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      console.log("this.", this);
      const options = this.$options;
      //组件从根组件开始渲染的会一层层把$store加入到组件实例上去
      if (options.store) {
        this.$store = options.store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }
    },
  });
}
export default {
  Store,
  install,
};
