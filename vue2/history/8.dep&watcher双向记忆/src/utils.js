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