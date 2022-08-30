import { parseHtml } from "./parse"

export function compilerToFunctions(html){
  // <div id="app">
  //   <div style="color:red">{{name}}</div>
  //   <span>{{age}}</span>
  // </div>
  /**
   * 一步一步正则匹配解析这个模版树 
   * 将html模版树转化成‘ast’语法树进行描述
   */
  let ast = parseHtml(html)
  console.log(ast)
}