import { nextTick } from "../utils"
import Dep, { popTarget, pushTarget } from "./dep"

let id = 0
class Watcher {
  constructor(vm,fn,options){
    this.id = id++
    this.vm = vm
    this.fn = fn
    this.renderWatcher = options && options.renderWatcher
    this.lazy = options && options.lazy
    this.dirty = this.lazy; //取值时是否执行用户的方法
    this.deps = []
    this.depIds = new Set()
    this.value = this.lazy?undefined:this.get()
  }
  get(){
    pushTarget(this)
    // 开始走用户的render方法以及update方法 
    let result =  this.fn.call(this.vm)
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
    this.get()
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