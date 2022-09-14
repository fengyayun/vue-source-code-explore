let Vue;

function forEachValue(obj, cb) {
  if (!obj) return;
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      cb(key, obj[key]);
    }
  }
}

class Store {
  constructor(options) {
    const { state, mutations, actions } = options;
    let computed = {};
    this.getters = {};
    // 下面的代码就具有缓存效果了
    forEachValue(options.getters, (key, value) => {
      computed[key] = () => {
        return value(this.state);
      };
      Object.defineProperty(this.getters, key, {
        get: () => {
          return this._vm[key];
        },
      });
    });
    // 下面的代码实现响应式了 但不具备缓存功能
    // forEachValue(options.getters,(key,value) =>{
    //   Object.defineProperty(this.getters,key,{
    //     get:() =>{
    //       return value(this.state)
    //     }
    //   })
    // })
    this._vm = new Vue({
      data: {
        state,
      },
      computed,
    });
    // 订阅mutations
    this.mutations = {};
    forEachValue(mutations, (key, method) => {
      this.mutations[key] = method;
    });

    // 订阅actions
    this.actions = {};
    forEachValue(actions, (key, method) => {
      this.actions[key] = method;
    });
  }
  get state() {
    return this._vm.state;
  }
  commit = (method, data) => {
    this.mutations[method](this.state, data);
    console.log(method, data);
  };
  dispatch = (method, data) => {
    this.actions[method](this, data);
  };
}
function install(_Vue) {
  Vue = _Vue;
  console.log(Vue);
  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
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
