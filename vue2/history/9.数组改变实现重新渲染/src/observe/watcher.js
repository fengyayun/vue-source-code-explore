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
    this.get()
  }
}
export default Watcher