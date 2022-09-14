import { forEachValue } from "../util";
import Module from "./module";
export default class ModuleCollection {
  constructor(options) {
    this.registerModule([], options);
  }
  registerModule(path, module) {
    /**
     {
      _rawModule:'原始数据',
      _children:{},//子元素
      state:'原始的状态'
     }
    */
    let newModule = new Module(module);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current);
      }, this.root);
      parent.addChild(path[path.length - 1], newModule);
      // parent._children[path[path.length - 1]] = newModule
    }
    forEachValue(module.modules, (key, value) => {
      this.registerModule(path.concat(key), value);
    });
  }
  getNamespace = (path) => {
    let root = this.root;
    return path.reduce((memo, current) => {
      root = root.getChild(current);
      memo = memo + (root.namespaced ? `${current}/` : "");
      return memo;
    }, "");
  };
}
