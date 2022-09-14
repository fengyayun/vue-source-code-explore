import { forEachValue } from "../util";
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
    if (path.length === 0) {
      this.root = {
        _rawModule: module,
        _children: {},
        state: module.state,
      };
    } else {
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo._children[current];
      }, this.root);
      parent._children[path[path.length - 1]] = {
        _rawModule: module,
        _children: {},
        state: module.state,
      };
    }
    forEachValue(module.modules, (key, value) => {
      this.registerModule(path.concat(key), value);
    });
  }
}
