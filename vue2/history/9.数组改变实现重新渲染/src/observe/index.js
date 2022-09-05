import { arrayMethods } from './array'
import Dep from './dep'
class Observe{
  constructor(data){
    this.dep = new Dep()
    //被观测过的对象上加一个__ob__属性并且不让被遍历到
    Object.defineProperty(data,'__ob__',{
      value:this,
      enumerable:false,
      configurable:false
    })
    //对于数组默认观测的是索引 数组较大会非常耗性能 而且开发过程该数组索引的场景也是非常低 需要对数组常用的方法进行拦截
    //对于数组的长度以及索引改变没有被监测
    if (Array.isArray(data)){
      //考虑兼容性的话可以遍历赋值
      data.__proto__ = arrayMethods
      this.observeArray(data)
    }else {
      this.walk(data)
    }
  }
  walk(data){
    Object.keys(data).forEach(key => defineReactive(data,key,data[key]))
  }
  observeArray(data){
    if (!Array.isArray(data)) return
    data.forEach(item => observe(item))
  }
}

function dependArray(value){
  for (let index = 0; index < value.length; index++) {
    const current = value[index];
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)){
      dependArray(current)
    }
  }
}

function defineReactive(target,key,value){
  // 递归的重新定义属性 
  let childDep = observe(value)
  let dep = new Dep()
  Object.defineProperty(target,key,{
    set(newValue){
      if (value === newValue) return
      //处理用户设置成新对象还需要去观测
      observe(newValue)
      value = newValue
      dep.notify()
    },
    get(){
      if (Dep.target){
        dep.depend()
        //针对数组也要收集依赖
        if (childDep && childDep.dep){
          childDep.dep.depend()
          //处理数组中嵌套的数组的依赖收集
          if (Array.isArray(value)){
            dependArray(value)
          }
        }
      }
      return value
    }
  })
}

export function observe(data){
  //只监测对象类型 
  if (!(data && typeof data === 'object')) return
  if (data.__ob__){
    return data
  }
  return new Observe(data)
}