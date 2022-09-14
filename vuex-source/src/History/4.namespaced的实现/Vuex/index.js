let Vue;
import ModuleCollection from "./Modules";
import { forEachValue } from "./util";
/**
 *
 * @param {*} store 容器
 * @param {*} rootState 根状态
 * @param {*} path 每次遍历的路径
 * @param {*} module 每次遍历的模块
 */
function installModule(store, rootState, path, module) {
  let namespaced = store.modules.getNamespace(path);

  // 收集mutations
  module.forEachMutations((key, mutation) => {
    let namespacedKey = namespaced + key;
    store._mutations[namespacedKey] = store._mutations[namespacedKey] || [];
    // 给mutation 包装一个函数
    store._mutations[namespacedKey].push((payload) => {
      //每次commit之前走这个方法修改对应module的state
      mutation.call(store, module.state, payload);
    });
  });

  // 收集actions
  module.forEachActions((key, action) => {
    let namespacedKey = namespaced + key;
    store._actions[namespacedKey] = store._actions[namespacedKey] || [];
    // 给mutation 包装一个函数
    store._actions[namespacedKey].push((payload) => {
      action.call(store, store, payload);
    });
  });

  // 收集getters
  module.forEachGetters((key, getter) => {
    store._wrapGetters[key] = () => {
      return getter(store.state);
    };
  });
  // 合并state
  if (path && path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo.getChild(current);
    }, store.modules.root);
    parent.state[path[path.length - 1]] = module.state;
  }

  // 递归遍历儿子
  module.forEachChildren((key, childModule) => {
    installModule(store, rootState, path.concat(key), childModule);
  });
}

/**
 *
 * @param {*} store 容器
 * @param {*} rootState 根状态
 */
function registerStoreVM(store, rootState) {
  let computed = {};
  store.getters = {};
  forEachValue(store._wrapGetters, (key, getter) => {
    computed[key] = () => {
      return getter();
    };
    Object.defineProperty(store.getters, key, {
      get: () => {
        return store._vm[key];
      },
    });
  });
  store._vm = new Vue({
    data() {
      return {
        state: rootState,
      };
    },
    computed,
  });
}
class Store {
  constructor(options) {
    // const { state, mutations, actions } = options
    const state = options.state;
    this._wrapGetters = {};
    this._actions = {};
    this._mutations = {};
    // 1. 模块的收集
    this.modules = new ModuleCollection(options);

    // 2.模块的安装
    installModule(this, state, [], this.modules.root);

    // 3.状态的处理
    registerStoreVM(this, state);
  }
  get state() {
    return this._vm.state;
    // return this._vm.state
  }
  commit = (method, data) => {
    let mutations = this._mutations[method];
    mutations.forEach((mutation) => mutation(data));
  };
  dispatch = (method, data) => {
    let actions = this._actions[method];
    actions.forEach((action) => action(data));
  };
}
function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
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
