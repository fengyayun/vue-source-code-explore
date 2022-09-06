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

  var oldArrayProto = Array.prototype;
  var arrayMethods = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var ob = this.__ob__;
      var inserted; //有些新增会增加一些对象 要对这些对象重新定义属性

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
      } //对于新增的数据要想实现重新定义属性必须拿observe.observeArray


      if (inserted && inserted.length > 0) ob.observeArray(inserted);
      var result = oldArrayProto[method].apply(this, args);
      ob.dep && ob.dep.notify();
      return result;
    };
  });

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++; //存放的watcher

      this.subs = [];
    } //收集依赖


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

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      this.dep = new Dep(); //被观测过的对象上加一个__ob__属性并且不让被遍历到

      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false,
        configurable: false
      }); //对于数组默认观测的是索引 数组较大会非常耗性能 而且开发过程该数组索引的场景也是非常低 需要对数组常用的方法进行拦截
      //对于数组的长度以及索引改变没有被监测

      if (Array.isArray(data)) {
        //考虑兼容性的话可以遍历赋值
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
          return observe$1(item);
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
    // 递归的重新定义属性 
    var childDep = observe$1(value);
    var dep = new Dep();
    Object.defineProperty(target, key, {
      set: function set(newValue) {
        if (value === newValue) return; //处理用户设置成新对象还需要去观测

        observe$1(newValue);
        value = newValue;
        dep.notify();
      },
      get: function get() {
        if (Dep.target) {
          dep.depend(); //针对数组也要收集依赖

          if (childDep && childDep.dep) {
            childDep.dep.depend(); //处理数组中嵌套的数组的依赖收集

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      }
    });
  }

  function observe$1(data) {
    //只监测对象类型 
    if (!(data && _typeof(data) === 'object')) return;

    if (data.__ob__) {
      return data;
    }

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
  var pending$1 = false;
  var callBacks = [];
  var timerFunc;

  function flushCallbacks() {
    callBacks.forEach(function (callback) {
      return callback();
    });
    callBacks = [];
    pending$1 = false; // //这种写法后放入的nextTick的回调先执行了
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
    var observe = new MutationObserver(flushCallBacks);
    var textNode = document.createTextNode(1);
    observe.observe(textNode, {
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
      //出于性能考虑可以不优先使用定时器
      timerFunc(); // setTimeout(flushCallbacks, 0);

      pending$1 = true;
    }
  }

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


    observe$1(data);
  }

  function stateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;
  }

  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g; //找到{{abc}}这样的

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
      //普通文本
      return "_v(".concat(JSON.stringify(text), ")");
    }

    var tokens = []; //存放每一段代码

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
   * 入参是ast语法树
   * @param {*} ast 
   * @return _c('div',{id:"app"},_c('div',undefined,_v('hello'+_s(name)))....)
   */


  var generate = function generate(ast) {
    var code = "_c('".concat(ast.tag, "',").concat(genProps(ast.attrs), ",").concat(genChildren(ast.children), ")");
    return code;
  };

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //匹配标签

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //匹配<myLxx>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是 标签名 <div></div>  <br/>    >  />

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的  </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+| ([^\s"'=<>`]+)))?/; // 匹配属性的 class='bb' "bb"  bb

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  > 

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
      var textEnd = html.indexOf('<'); // textEnd = 0 是代表开始标签和结束标签 如果大于0就是文本内容

      if (textEnd == 0) {
        /*
          * v-bind  v-on
          * <!DOCTYPE
          * <!----->
          * slot
          * ...
          * 未处理
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
          //正则的第一个分组匹配的内容
          attrs: []
        };
        advance(start[0].length); // 开始遍历匹配属性

        var _end, attr; //不是开始标签的结束闭合并且属性依然匹配到了


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
     * 一步一步正则匹配解析这个模版树 
     * 1.将html模版树转化成‘ast’语法树进行描述
     */
    var ast = parseHtml(html); // 2.优化静态节点 不影响核心功能暂不实现

    /**
     * 3.根据ast去生成代码 最后生成的代码需要和render函数一样
     * 类似 _c('div',{id:"app"},_c('div',undefined,_v('hello'+_s(name)))....)
     * _c 就是创建元素 _v 创建文本节点 _s是将data属性中的变量转成文字
     *
    */

    var code = generate(ast); //4.将字符串变成函数  增加with和函数

    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, options) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.vm = vm;
      this.fn = fn;
      this.renderWatcher = options && options.renderWatcher;
      this.deps = [];
      this.depIds = new Set();
      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        Dep.target = this; // 开始走用户的render方法以及update方法 

        this.fn(); // 执行了render之后置空 防止没有在模版中使用的属性 但是取值也被依赖收集了

        Dep.target = null;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        // 去重
        if (!this.depIds.has(dep.id)) {
          this.deps.push(dep);
          this.depIds.add(dep.id);
          dep.addSub(this);
        }
      }
    }, {
      key: "update",
      value: function update() {
        // 要实现异步更新队列 就不能每次都去走get方法
        queueWatcher(this); // this.get()
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
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
        // 实现异步并且达到批处理的效果
        nextTick(flushScheduleQueue);
        pending = true;
      }
    }
  }

  function patch(oldVNode, newVNode) {
    if (oldVNode.nodeType) {
      //初次渲染
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
      vNode.el = document.createElement(tag); //更新属性

      updateProperties(vNode); //字节点递归生成

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
    var el = vNode.el; //老的有新的没有，需要删除

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
    } //新的有  直接用新的


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
    vm.$el = el; // //1.把render转成vNode
    // let vNode = vm._render()
    // //2.把vNode转成真实dom并挂载
    // vm._update(vNode)

    var updateComponent = function updateComponent() {
      console.log('update');

      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, {
      renderWatcher: true
    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // vue实例属性都会加一个$开头来区分用户的变量

      vm.$options = options; //初始化状态

      initState(vm);

      if (vm.$options.el) {
        //挂载逻辑都聚合在$mount中 因为有时候用户可以不传el而是直接调用$mount
        this.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options; //执行的优先级是 render => options中的template => 模版中的template

      el = document.querySelector(el);

      if (!options.render) {
        var template = options.template;

        if (!template) {
          //有兼容问题暂不考虑
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
  } //向原型上注入实例方法


  initMixin(Vue); // 向原型上注入 _init 以及 $mount 方法

  lifecycleMixin(Vue); //向原型上注入 _update 方法

  renderMixin(Vue); // 向原型上注入 _render _c _v _s 等方法

  stateMixin(Vue);

  return Vue;

}));
