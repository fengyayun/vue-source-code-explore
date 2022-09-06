import { nextTick } from "../utils"
import Dep from "./dep"

let id = 0
class Watcher {
  constructor(vm,fn,options){
    this.id = id++
    this.vm = vm
    this.fn = fn
    this.renderWatcher = options && options.renderWatcher
    this.deps = []
    this.depIds = new Set()
    this.get()
  }
  get(){
    Dep.target = this
    // 开始走用户的render方法以及update方法 
    this.fn()
    // 执行了render之后置空 防止没有在模版中使用的属性 但是取值也被依赖收集了
    Dep.target = null
  }
  addDep(dep){
    // 去重
    if (!this.depIds.has(dep.id)){
      this.deps.push(dep)
      this.depIds.add(dep.id)
      dep.addSub(this)
    }
  }
  update(){
    // 要实现异步更新队列 就不能每次都去走get方法
    queueWatcher(this)
    // this.get()
  }
  run() {
    this.get()
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