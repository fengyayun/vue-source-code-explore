const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g //找到{{abc}}这样的
function genProps(attrs){
  if (!attrs || attrs.length == 0) return 'undefined'
  let obj = {}
  for (let index = 0; index < attrs.length; index++) {
    const { name, value } = attrs[index];
    if (name == 'style'){
      let styleObj = {}
      value.split(';').forEach(item =>{
          let [key,value] = item.split(':')
          styleObj[key] = value
      })
      obj[name] = styleObj
    }else {
      obj[name] = value
    }
  }
  return JSON.stringify(obj)
}

function genChildren(children){
  if (!children || children.length == 0) return ''
  return children.map(item => gen(item)).join(',')
}

function gen(node){
  if (node.type == 1){
    return generate(node)
  }
  let text = node.text
  if (!defaultTagRE.test(text)){
    //普通文本
    return `_v(${JSON.stringify(text)})`
  }
  let tokens = [] //存放每一段代码
  let lastIndex = defaultTagRE.lastIndex = 0
  let match,index;
  while (match = defaultTagRE.exec(text)){
      index = match.index
      if (index > lastIndex){
          tokens.push(JSON.stringify(text.slice(lastIndex,index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index+match[0].length
  }
  if (lastIndex < text.length){
      tokens.push(JSON.stringify(text.slice(lastIndex)))
  }
  return  `_v(${tokens.join('+')})`
}

/**
 * 入参是ast语法树
 * @param {*} ast 
 * @return _c('div',{id:"app"},_c('div',undefined,_v('hello'+_s(name)))....)
 */
export const generate = function(ast){
  let code = `_c('${ast.tag}',${genProps(ast.attrs)}),${genChildren(ast.children)}`
  return code
}