(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  var pending$1 = false;
  var callBacks = [];
  var timerFunc;

  function flushCallbacks() {
    callBacks.forEach(function (callback) {
      return callback();
    });
    callBacks = [];
    pending$1 = false; // //????????????????????????nextTick?????????????????????
    // while(callBacks.length){
    //   let cb = callBacks.pop()
    //   cb()
    //   pending = false
    // }
  }

  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    var observe$1 = new MutationObserver(flushCallBacks);
    var textNode = document.createTextNode(1);
    observe$1.observe(textNode, {
      characterData: true
    });

    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick(cb) {
    callBacks.push(cb);

    if (!pending$1) {
      //????????????????????????????????????????????????
      timerFunc(); // setTimeout(flushCallbacks, 0);

      pending$1 = true;
    }
  }

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++; //?????????watcher

      this.subs = [];
    } //????????????


    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // this.subs.push(Dep.target)
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, options, cb) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.vm = vm;
      this.renderWatcher = options && options.renderWatcher;
      this.lazy = options && options.lazy;
      this.user = options && options.user;
      this.dirty = this.lazy; //????????????????????????????????????

      this.cb = cb;
      this.deps = [];
      this.depIds = new Set();

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        this.getter = function () {
          // exprOrFn ???????????????????????????????????????a
          //?????????????????????????????????????????????????????????
          var path = exprOrFn.split('.');
          var obj = vm;

          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }

          return obj;
        };
      }

      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this); // ??????????????????render????????????update?????? || ?????????????????????get

        var result = this.getter.call(this.vm); // ?????????render???????????? ??????????????????????????????????????? ?????????????????????????????????

        popTarget();
        return result;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        // ??????
        if (!this.depIds.has(dep.id)) {
          this.deps.push(dep);
          this.depIds.add(dep.id);
          dep.addSub(this);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          // ?????????lazyWatcher??????????????? ??????????????????????????????watcher
          this.dirty = true;
        } else {
          queueWatcher(this);
        } // ??????????????????????????? ????????????????????????get??????
        // queueWatcher(this)
        // this.get()

      }
    }, {
      key: "run",
      value: function run() {
        var newValue = this.get();
        var oldValue = this.value;
        this.value = newValue;

        if (this.user) {
          // ???????????????????????????
          if (newValue !== oldValue || _typeof(oldValue) === 'object') {
            this.cb.call(this.vm, newValue, oldValue);
          }
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        // ???????????????????????????dep ????????????watcher
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }]);

    return Watcher;
  }();

  function flushScheduleQueue() {
    queue.forEach(function (watcher) {
      watcher.run();
    });
    pending = false;
    has = {};
  }

  var queue = [];
  var pending = false;
  var has = {};

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      has[id] = true;
      queue.push(watcher);

      if (!pending) {
        // ??????????????????????????????????????????
        nextTick(flushScheduleQueue);
        pending = true;
      }
    }
  }

  var oldArrayProto = Array.prototype;
  var arrayMethods = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var ob = this.__ob__;
      var inserted; //????????????????????????????????? ????????????????????????????????????

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      } //????????????????????????????????????????????????????????????observe.observeArray


      if (inserted && inserted.length > 0) ob.observeArray(inserted);
      var result = oldArrayProto[method].apply(this, args);
      ob.dep && ob.dep.notify();
      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      this.dep = new Dep(); //?????????????????????????????????__ob__??????????????????????????????

      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false,
        configurable: false
      }); //???????????????????????????????????? ?????????????????????????????? ????????????????????????????????????????????????????????? ??????????????????????????????????????????
      //??????????????????????????????????????????????????????

      if (Array.isArray(data)) {
        //???????????????????????????????????????
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        if (!Array.isArray(data)) return;
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observe;
  }();

  function dependArray(value) {
    for (var index = 0; index < value.length; index++) {
      var current = value[index];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(target, key, value) {
    // ??????????????????????????? 
    var childDep = observe(value);
    var dep = new Dep();
    Object.defineProperty(target, key, {
      set: function set(newValue) {
        if (value === newValue) return; //????????????????????????????????????????????????

        observe(newValue);
        value = newValue;
        dep.notify();
      },
      get: function get() {
        if (Dep.target) {
          dep.depend(); //??????????????????????????????

          if (childDep && childDep.dep) {
            childDep.dep.depend(); //?????????????????????????????????????????????

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      }
    });
  }

  function observe(data) {
    //????????????????????? 
    if (!(data && _typeof(data) === 'object')) return;

    if (data.__ob__) {
      return data;
    }

    return new Observe(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.methods) {
      initMethods(vm);
    }

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }
  }

  function initMethods(vm) {
    var methods = vm.$options.methods || {};

    for (var key in methods) {
      if (Object.hasOwnProperty.call(methods, key)) {
        vm[key] = methods[key].bind(vm);
      }
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data() : data;
    vm._data = data; //???????????????????????????????????????????????? ??????????????????vm.name  ?????????????????????vm._data.name

    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        proxy(vm, '_data', key);
      }
    } // ????????????????????????????????? ?????????????????????????????????????????????(??????vue?????????$set,$delete??????)


    observe(data);
  }

  function initWatch(vm) {
    var watcher = vm.$options.watch || {};

    var _loop = function _loop(key) {
      if (Object.hasOwnProperty.call(watcher, key)) {
        var handler = watcher[key];

        if (Array.isArray(handler)) {
          handler.forEach(function (handle) {
            createWatcher(vm, key, handle);
          });
        } else {
          createWatcher(vm, key, handler);
        }
      }
    };

    for (var key in watcher) {
      _loop(key);
    }
  }

  function createWatcher(vm, exprOrFn, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (_typeof(handler) === 'object') {
      options = handler;
      handler = handler.handler;
    }

    if (typeof handler === 'string') {
      handler = vm[handler];
    }

    vm.$watch(exprOrFn, handler, options);
  }

  function initComputed(vm) {
    var computed = vm.$options.computed || {};
    var watchers = vm._computedWatchers = {}; //????????????????????????watcher

    for (var key in computed) {
      if (Object.hasOwnProperty.call(computed, key)) {
        var useDef = computed[key];
        var getter = typeof useDef === 'function' ? useDef : useDef.get;
        watchers[key] = new Watcher(vm, getter, {
          lazy: true
        });
        defineProperty(vm, key, useDef);
      }
    }
  }

  function defineProperty(target, key, useDef) {
    var sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      set: function set() {},
      get: function get() {}
    };

    if (typeof useDef === 'function') {
      sharedPropertyDefinition.get = createComputedGetter(key); // sharedPropertyDefinition.get = useDef  ????????????????????????????????????
    } else {
      sharedPropertyDefinition.get = useDef.get;
      sharedPropertyDefinition.set = useDef.set;
    }

    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWatchers[key];

      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }

        if (Dep.target) {
          watcher.depend();
        }

        return watcher.value;
      }
    };
  }

  function stateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;

    Vue.prototype.$watch = function (exprOrFn, cb) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var vm = this;
      new Watcher(vm, exprOrFn, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }), cb);

      if (options.immediate) {
        var newValue = '';

        if (vm[exprOrFn] && _typeof(vm[exprOrFn]) === 'object') {
          newValue = vm[exprOrFn];
        }

        cb.call(vm, newValue, vm[exprOrFn]);
      } // TODO ???????????????deep ???????????????????????????????????????

    };
  }

  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g; //??????{{abc}}?????????

  function genProps(attrs) {
    if (!attrs || attrs.length == 0) return 'undefined';
    var obj = {};

    for (var index = 0; index < attrs.length; index++) {
      var _attrs$index = attrs[index],
          name = _attrs$index.name,
          value = _attrs$index.value;

      if (name == 'style') {
        (function () {
          var styleObj = {};
          value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            styleObj[key] = value;
          });
          obj[name] = styleObj;
        })();
      } else {
        obj[name] = value;
      }
    }

    return JSON.stringify(obj);
  }

  function genChildren(children) {
    if (!children || children.length == 0) return '';
    return children.map(function (item) {
      return gen(item);
    }).join(',');
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node);
    }

    var text = node.text;

    if (!defaultTagRE.test(text)) {
      //????????????
      return "_v(".concat(JSON.stringify(text), ")");
    }

    var tokens = []; //?????????????????????

    var lastIndex = defaultTagRE.lastIndex = 0;
    var match, index;

    while (match = defaultTagRE.exec(text)) {
      index = match.index;

      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }

      tokens.push("_s(".concat(match[1].trim(), ")"));
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return "_v(".concat(tokens.join('+'), ")");
  }
  /**
   * ?????????ast?????????
   * @param {*} ast 
   * @return _c('div',{id:"app"},_c('div',undefined,_v('hello'+_s(name)))....)
   */


  var generate = function generate(ast) {
    var code = "_c('".concat(ast.tag, "',").concat(genProps(ast.attrs), ",").concat(genChildren(ast.children), ")");
    return code;
  };

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //????????????

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //??????<myLxx>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // ????????????????????? ?????????????????? ????????? <div></div>  <br/>    >  />

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // ?????????????????????  </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+| ([^\s"'=<>`]+)))?/; // ??????????????? class='bb' "bb"  bb

  var startTagClose = /^\s*(\/?)>/; // ?????????????????????  > 

  function parseHtml(html) {
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    var root;
    var currentParent;
    var stack = [];

    function start(tagName, attr) {
      var element = createASTElement(tagName, attr);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }

    function end(endTag) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    while (html) {
      var textEnd = html.indexOf('<'); // textEnd = 0 ???????????????????????????????????? ????????????0??????????????????

      if (textEnd == 0) {
        /*
          * v-bind  v-on
          * <!DOCTYPE
          * <!----->
          * slot
          * ...
          * ?????????
          * */
        var startMatch = parseStartTag();

        if (startMatch) {
          start(startMatch.tagName, startMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          //???????????????????????????????????????
          attrs: []
        };
        advance(start[0].length); // ????????????????????????

        var _end, attr; //???????????????????????????????????????????????????????????????


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }

        return false;
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    return root;
  }

  function compilerToFunctions(html) {
    // <div id="app">
    //   <div style="color:red">{{name}}</div>
    //   <span>{{age}}</span>
    // </div>

    /**
     * ????????????????????????????????????????????? 
     * 1.???html?????????????????????ast????????????????????????
     */
    var ast = parseHtml(html); // 2.?????????????????? ?????????????????????????????????

    /**
     * 3.??????ast??????????????? ??????????????????????????????render????????????
     * ?????? _c('div',{id:"app"},_c('div',undefined,_v('hello'+_s(name)))....)
     * _c ?????????????????? _v ?????????????????? _s??????data??????????????????????????????
     *
    */

    var code = generate(ast); //4.????????????????????????  ??????with?????????

    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  function patch(oldVNode, newVNode) {
    if (oldVNode.nodeType) {
      //????????????
      var oldElm = oldVNode;
      var parentElm = oldElm.parentNode;
      var el = createElm(newVNode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
      return el;
    }
  }

  function createElm(vNode) {
    var tag = vNode.tag,
        children = vNode.children,
        text = vNode.text;

    if (typeof tag === 'string') {
      vNode.el = document.createElement(tag); //????????????

      updateProperties(vNode); //?????????????????????

      children.forEach(function (child) {
        return vNode.el.appendChild(createElm(child));
      });
    } else {
      vNode.el = document.createTextNode(text);
    }

    return vNode.el;
  }

  function updateProperties(vNode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vNode.data || {};
    var el = vNode.el; //????????????????????????????????????

    for (var key in oldProps) {
      if (!newProps[key]) {
        el.removeAttribute(key);
      }
    }

    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    for (var _key in oldStyle) {
      if (!newStyle[_key]) {
        el.style[_key] = '';
      }
    } //?????????  ???????????????


    for (var _key2 in newProps) {
      if (_key2 == 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 == 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vNode) {
      var vm = this;
      vm.$el = patch(vm.$el, vNode);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el; // //1.???render??????vNode
    // let vNode = vm._render()
    // //2.???vNode????????????dom?????????
    // vm._update(vNode)

    var updateComponent = function updateComponent() {
      console.log('update');

      vm._update(vm._render());
    };

    debugger;
    new Watcher(vm, updateComponent, {
      renderWatcher: true
    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // vue???????????????????????????$??????????????????????????????

      vm.$options = options; //???????????????

      initState(vm);

      if (vm.$options.el) {
        //????????????????????????$mount??? ?????????????????????????????????el??????????????????$mount
        this.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options; //????????????????????? render => options??????template => ????????????template

      el = document.querySelector(el);

      if (!options.render) {
        var template = options.template;

        if (!template) {
          //???????????????????????????
          template = el.outerHTML;
        }

        var render = compilerToFunctions(template);
        options.render = render;
      }

      mountComponent(vm, el);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._render = function () {
      var vm = this;
      return vm.$options.render.call(vm);
    };

    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      return createTextVNode(text);
    };

    Vue.prototype._s = function (value) {
      return !value ? '' : _typeof(value) === 'object' ? JSON.stringify(value) : value;
    };
  }

  function createElementVNode(vm, tag, data) {
    if (!data) data = {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vNode(tag, data, data.key, children, undefined);
  }

  function createTextVNode(text) {
    return vNode(undefined, undefined, undefined, undefined, text);
  }

  function vNode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    this._init(options);
  } //??????????????????????????????


  initMixin(Vue); // ?????????????????? _init ?????? $mount ??????

  lifecycleMixin(Vue); //?????????????????? _update ??????

  renderMixin(Vue); // ?????????????????? _render _c _v _s ?????????

  stateMixin(Vue);

  return Vue;

}));
