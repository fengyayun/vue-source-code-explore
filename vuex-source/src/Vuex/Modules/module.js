import { forEachValue } from "../util";
export default class Module {
  get namespaced() {
    return !!this._rawModule.namespaced;
  }
  constructor(module) {
    this._rawModule = module;
    this._children = {};
    this.state = module.state;
  }
  getChild = (key) => {
    return this._children[key];
  };
  addChild = (key, module) => {
    this._children[key] = module;
  };
  forEachMutations = (fn) => {
    forEachValue(this._rawModule.mutations, fn);
  };
  forEachActions = (fn) => {
    forEachValue(this._rawModule.actions, fn);
  };
  forEachGetters = (fn) => {
    forEachValue(this._rawModule.getters, fn);
  };
  forEachChildren = (fn) => {
    forEachValue(this._children, fn);
  };
}
