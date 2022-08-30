(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      this.walk(data);
    }

    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observe;
  }();

  function defineReactive(target, key, value) {
    // 递归的重新定义属性 
    observe(value);
    Object.defineProperty(target, key, {
      set: function set(newValue) {
        if (value === newValue) return; //处理用户设置成新对象还需要去观测

        observe(newValue);
        value = newValue;
      },
      get: function get() {
        console.log('获取值');
        return value;
      }
    });
  }

  function observe(data) {
    //只监测对象类型 
    if (!(data && _typeof(data) === 'object')) return;
    return new Observe(data);
  }

  var proxy = function proxy(target, data, key) {
    Object.defineProperty(target, key, {
      set: function set(newValue) {
        target[data][key] = newValue;
      },
      get: function get() {
        return target[data][key];
      }
    });
  };

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data() : data;
    vm._data = data; //代理是让用户设置值以及取值更方便 例如用户使用vm.name  实际上是代理到vm._data.name

    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        proxy(vm, '_data', key);
      }
    } // 递归重新定义对象的属性 但是监听不到新增以及删除的属性(所以vue提供了$set,$delete方法)


    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // vue实例属性都会加一个$开头来区分用户的变量

      vm.$options = options; //初始化状态

      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  } //向原型上注入实例方法


  initMixin(Vue);

  return Vue;

}));
