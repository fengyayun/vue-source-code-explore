<template>
  <div>
    <h1>reactive</h1>
    <div>{{obj1}}</div>
    <button @click="reactiveChange">修改reactive值</button>
    <hr>
    <h1>数组</h1>
    <div>{{ arr }}</div>
    <button @click="arrChange">追加一项值</button>
    <hr>
    <h1>readonly</h1>
    <div>proxy:{{ person }}</div>
    <div>copy:{{ copy }}</div>
    <button @click="changeCopy">修改copy Count</button>
    <hr>
    <h1>shallowReactive</h1>
    <div>{{ shallowReactiveObj }}</div>
    <button  @click="shallowReactiveObjChange">修改shallowReactive</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, readonly, shallowReactive } from 'vue'
/**
 * reactive 用来绑定复杂的数据类型 例如 对象 数组
 * reactive 源码约束了我们的类型
*/
const obj1 = reactive({name:'小明'})
const reactiveChange = () =>{
  obj1.name = "大明"
}
/**
 * reactive 源码
 export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // target already has corresponding Proxy
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only specific value types can be observed.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
*/
/**
 * 数组异步赋值的问题
*/
let arr:string[] = reactive([])
const arrChange = () =>{
  let resData = ['A','B','C']
  // 方式1
  arr.push(...resData)
  // 方式2 声明一个对象去改其中某一个属性
}


/**
 * readonly 拷贝一份proxy对象将其设置为只读
*/

const person = reactive({count:1})
const copy = readonly(person)

const changeCopy = () =>{
  // copy.count++ 会报错
}

/**
 * readonly 的源码 最终也会走createReactiveObject 但是在这个方法中会被拦截到
 export const toReadonly = <T extends unknown>(value: T): T =>
  isObject(value) ? readonly(value as Record<any, any>) : value
 * 
 export function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>> {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  )
}
 * 
*/

/**
 * shallowReactive
 * 只能对浅层数据实现响应式，深层的修改只会值修改 但是视图不会修改
*/


const shallowReactiveObj:any = shallowReactive({
  a:{
    b:{
      c:10
    }
  }
})

const shallowReactiveObjChange = () =>{
  //以下这种方式就不会触发视图更新
  // shallowReactiveObj.a.b.c = 100
  // console.log(shallowReactiveObj);
  shallowReactiveObj.a = 100
}

/**
 * shallowReactive 也会走 createReactiveObject 方法 但是只是浅层依赖收集
 export function shallowReactive<T extends object>(
  target: T
): ShallowReactive<T> {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  )
}

*/

</script>

<style scoped></style>
