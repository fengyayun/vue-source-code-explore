import { generate } from "./generate"
import { parseHtml } from "./parse"

export function compilerToFunctions(html){
  // <div id="app">
  //   <div style="color:red">{{name}}</div>
  //   <span>{{age}}</span>
  // </div>
  /**
   * 一步一步正则匹配解析这个模版树 
   * 1.将html模版树转化成‘ast’语法树进行描述
   */
  let ast = parseHtml(html)
  // 2.优化静态节点 不影响核心功能暂不实现


  /**
   * 3.根据ast去生成代码 最后生成的代码需要和render函数一样
   * 类似 _c('div',{id:"app"},_c('div',undefined,_v('hello'+_s(name)))....)
   * _c 就是创建元素 _v 创建文本节点 _s是将data属性中的变量转成文字
   *
  */
  let code = generate(ast)
  let render = new Function(`with(this){return ${code}}`)
  console.log('render',render)
  return render
}