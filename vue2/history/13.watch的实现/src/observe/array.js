let oldArrayProto = Array.prototype

export let arrayMethods = Object.create(oldArrayProto)

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
]
methods.forEach(method =>{
  arrayMethods[method] = function(...args){
    const ob = this.__ob__
    let inserted; //有些新增会增加一些对象 要对这些对象重新定义属性
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
          inserted = args.slice(2)
          break;
      default:
        break;
    }
    //对于新增的数据要想实现重新定义属性必须拿observe.observeArray
    if (inserted && inserted.length > 0) ob.observeArray(inserted)
    let result = oldArrayProto[method].apply(this,args)
    ob.dep && ob.dep.notify()
    return result
  }
})