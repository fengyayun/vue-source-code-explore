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
      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      //被观测过的对象上加一个__ob__属性并且不让被遍历到
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
          return observe(item);
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
        return value;
      }
    });
  }

  function observe(data) {
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
     * 将html模版树转化成‘ast’语法树进行描述
     */
    var ast = parseHtml(html);
    console.log(ast);
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
    };
  }

  function Vue(options) {
    this._init(options);
  } //向原型上注入实例方法


  initMixin(Vue);

  return Vue;

}));
