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
if (Promise){
  timerFunc = () =>{
    Promise.resolve().then(flushCallbacks)
  }
}else if (MutationObserver){
  let observe = new MutationObserver(flushCallBacks)
  let textNode = document.createTextNode(1)
  observe.observe(textNode,{characterData:true})
  timerFunc = () =>{
      textNode.textContent = 2
  }
}else if(setImmediate) {
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