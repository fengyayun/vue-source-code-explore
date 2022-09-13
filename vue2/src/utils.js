export const proxy = (target,data,key) =>{
  Object.defineProperty(target,key,{
    set(newValue){
      target[data][key] = newValue
    },
    get(){
      return target[data][key]
    }
  })
}

export const isObject = (val) => val && typeof val === 'object'
let strategy = {}
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated'
]
function mergeHook(parent,children){
  if (children){
    if (parent){
      return [children].concat(parent)
    }
    return [children]
  }
  return parent
}
// 订阅模式
LIFECYCLE_HOOKS.forEach(hook => strategy[hook] = mergeHook)
strategy.components = function(parent={},child){
  const res = Object.create(parent)
  if (child){
    for (const key in child) {
      if (Object.hasOwnProperty.call(child, key)) {
        res[key] = child[key]
      }
    }
  }
  return res

}
export function mergeOptions(parent={},children={}){
  /**
   * 1. 老的有 儿子也有 要以儿子为准 {a:1} {a:2}
   * 2. 老的有值 儿子没有值 要以老的为准 {a:1} {}
   * 3. 自定义策略 比如说 生命周期以及组件的合并
  */
  let options = {}
  for (const key in parent) {
    if (Object.hasOwnProperty.call(parent, key)) {
      mergeField(key)
    }
  }
  for (const key in children) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key){
    const childValue = children[key]
    const parentValue = parent[key]
    // 策略模式简化了 if else 等等
    if (strategy[key]){
      return options[key] = strategy[key](parent[key],children[key])
    }
    if (isObject(parentValue) && isObject(childValue)){
      options[key] = {...parentValue,...childValue}
    }else {
      options[key] = childValue?childValue:parentValue
    }
  }
  return options
}


let pending = false
let callBacks = []
let timerFunc;
function flushCallbacks(){
  callBacks.forEach(callback => callback())
  callBacks = []
  pending = false
  // //这种写法后放入的nextTick的回调先执行了
  // while(callBacks.length){
  //   let cb = callBacks.pop()
  //   cb()
  //   pending = false
  // }
}
if (typeof Promise !== "undefined"){
  timerFunc = () =>{
    Promise.resolve().then(flushCallbacks)
  }
}else if (typeof MutationObserver !== "undefined"){
  let observe = new MutationObserver(flushCallBacks)
  let textNode = document.createTextNode(1)
  observe.observe(textNode,{characterData:true})
  timerFunc = () =>{
      textNode.textContent = 2
  }
}else if(typeof setImmediate !== "undefined") {
  timerFunc = () =>{
    setImmediate(flushCallbacks)
  }
}else {
  timerFunc = () =>{
    setTimeout(flushCallbacks, 0);
  }
}

export function nextTick(cb){
  callBacks.push(cb)
  if (!pending){
    //出于性能考虑可以不优先使用定时器
    timerFunc()
    // setTimeout(flushCallbacks, 0);
    pending = true
  }
}


export function isReservedTag(key) {
  let makeMap = 'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'+
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view'
  return (makeMap.indexOf(key) > -1)
}


