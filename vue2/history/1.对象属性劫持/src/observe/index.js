class Observe{
  constructor(data){
    this.walk(data)
  }
  walk(data){
    Object.keys(data).forEach(key => defineReactive(data,key,data[key]))
  }
}

function defineReactive(target,key,value){
  // 递归的重新定义属性 
  observe(value)
  Object.defineProperty(target,key,{
    set(newValue){
      if (value === newValue) return
      //处理用户设置成新对象还需要去观测
      observe(newValue)
      value = newValue
    },
    get(){
      console.log('获取值')
      return value
    }
  })
}

export function observe(data){
  //只监测对象类型 
  if (!(data && typeof data === 'object')) return
  return new Observe(data)
}