const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;//匹配标签
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配<myLxx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是 标签名 <div></div>  <br/>    >  />
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的  </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+| ([^\s"'=<>`]+)))?/; // 匹配属性的 class='bb' "bb"  bb
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g //找到{{abc}}这样的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  > 

export function parseHtml(html){
  function createASTElement(tagName,attrs){
    return {
      tag:tagName,
      type:1,
      children:[],
      attrs,
      parent:null
    }
  }
  let root;
  let currentParent;
  let stack = [];
  function start(tagName,attr){
    let element = createASTElement(tagName,attr)
    if (!root){
      root = element
    }
    currentParent = element
    stack.push(element)
  }
  function end(endTag){
    let element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent){
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }
  function chars(text){
    text = text.replace(/\s/g,'')
    if (text){
      currentParent.children.push({
        type:3,
        text
      })
    }
  }
  while(html){
    let textEnd = html.indexOf('<')
    // textEnd = 0 是代表开始标签和结束标签 如果大于0就是文本内容
    if (textEnd == 0){
      /*
        * v-bind  v-on
        * <!DOCTYPE
        * <!----->
        * slot
        * ...
        * 未处理
        * */
      const startMatch = parseStartTag()
      if (startMatch){
        start(startMatch.tagName,startMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch){
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text;
    if (textEnd > 0){
      text = html.substring(0,textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  function parseStartTag(){
    const start = html.match(startTagOpen)
    if (start){
      const match = {
        tagName:start[1],//正则的第一个分组匹配的内容
        attrs:[]
      }
      advance(start[0].length)
      // 开始遍历匹配属性
      let end,attr;
      //不是开始标签的结束闭合并且属性依然匹配到了
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
        match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5] || true})
        advance(attr[0].length)
      }
      if (end){
        advance(end[0].length)
        return match
      }
      return false
    }
  }
  function advance(n){
    html = html.substring(n)
  }
  return root
}