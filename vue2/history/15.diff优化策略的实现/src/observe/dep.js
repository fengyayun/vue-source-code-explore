
let id = 0
class Dep{
  constructor(){
    this.id = id++
    //存放的watcher
    this.subs = []
  }
  //收集依赖
  depend(){
    // this.subs.push(Dep.target)
    Dep.target.addDep(this)
  }
  addSub(watcher){
    this.subs.push(watcher)
  }
  notify(){
    this.subs.forEach(watcher => watcher.update())
  }
}
Dep.target = null

let stack = []
export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}

export function popTarget() {
    stack.pop()
    Dep.target =  stack[stack.length - 1]
}

export default Dep