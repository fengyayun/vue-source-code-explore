import { nextTick } from "../utils"
import Dep, { popTarget, pushTarget } from "./dep"

let id = 0
class Watcher {
  constructor(vm,exprOrFn,options,cb){
    this.id = id++
    this.vm = vm
    this.renderWatcher = options && options.renderWatcher
    this.lazy = options && options.lazy
    this.user = options && options.user
    this.dirty = this.lazy; //取值时是否执行用户的方法
    this.cb = cb
    this.deps = []
    this.depIds = new Set()
    if (typeof exprOrFn === 'function'){
      this.getter = exprOrFn
    }else {
      this.getter = function (){
        // exprOrFn 可能传递过来的是一个字符串a
        //当去当前实例取值的时候才会触发依赖收集
        let path = exprOrFn.split('.');
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
            obj = obj[path[i]];
        }
        return obj;
      }
    }
    this.isFirst = true
    this.value = this.lazy?undefined:this.get()
  }
  get(){
    pushTarget(this)
    // 开始走用户的render方法以及update方法 || 用户取值走到了get
    let result =  this.getter.call(this.vm)
    // 执行了render之后置空 防止没有在模版中使用的属性 但是取值也被依赖收集了
    popTarget()
    return result
  }
  addDep(dep){
    // 去重
    if (!this.depIds.has(dep.id)){
      this.deps.push(dep)
      this.depIds.add(dep.id)
      dep.addSub(this)
    }
  }
  evaluate(){
    this.value = this.get()
    this.dirty = false
  }
  update(){
    if (this.lazy){
      // 用于是lazyWatcher就不渲染了 那么属性还的收集渲染watcher
      this.dirty = true
    }else {
      queueWatcher(this)
    }
    // 要实现异步更新队列 就不能每次都去走get方法
    // queueWatcher(this)
    // this.get()
  }
  run() {
    let newValue = this.get()
    let oldValue = this.value
    this.value = newValue
    if (this.user){
      // 要判断是否相等才走
      if (newValue !== oldValue || typeof oldValue === 'object'){
        this.cb.call(this.vm,newValue,oldValue)
      }
    }
    if (this.renderWatcher) {
      this.cb()
    }
  }
  depend(){
    // 让计算属性中的依赖dep 收集渲染watcher
    let i = this.deps.length
    while(i--){
      this.deps[i].depend()
    }
  }
}

function flushScheduleQueue(){
  queue.forEach(watcher =>{
    watcher.run()
  })
  pending = false
  has = {}
}

let queue = []
let pending = false
let has = {}
function queueWatcher(watcher){
  const id = watcher.id
  if (!has[id]){
    has[id] = true
    queue.push(watcher)
    if (!pending){
      // 实现异步并且达到批处理的效果
      nextTick(flushScheduleQueue)
      pending = true
    }
  }
}
export default Watcher