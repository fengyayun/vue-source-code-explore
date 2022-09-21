<template>
  <div>
    <h1>toRef</h1>
    <div>obj:{{ obj }}------like:{{ like }} --- name:{{ name }}</div>
    <button @click="change">修改</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, toRef, toRefs } from 'vue'

/**
 * toRef 只对响应式数据有作用, 针对非响应式数据视图无任何变化 下面的例子可以证明
 */
// const obj = { name: 'yyfeng', like: 'JK' }
// let like:any = toRef(obj,'like')
// const change = () =>{
//   like = 'AK'
//   console.log(like); // AK 但是视图无变化
// }

// const obj = reactive({ name: 'yyfeng', like: 'JK' })
// let like:any = toRef(obj,'like')
// const change = () =>{
//   like.value = 'AK'
//   console.log(like); //
// }


/**
 *toRef 源码 如果已经是ref对象了就直接返回  或者创建一个ObjectRefImpl 对象 但是这个对象内部没有依赖收集和更新 所以必须借助原始对象必须要是响应式数据才有效果
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K]
): ToRef<T[K]> {
  const val = object[key]
  return isRef(val)
    ? val
    : (new ObjectRefImpl(object, key, defaultValue) as any)
}
*/

/**
 * toRefs 就是针对多个进行解构使用 也需要是针对响应式数据
 */

// const obj = reactive({ name: 'yyfeng', like: 'JK' })
// let { like, name } = toRefs(obj)
// const change = () => {
//   like.value = 'AK'
//   console.log(name,like) //
// }

/**
 * toRefs 源码: 就是把对象循环的变成toRef对象 然后返回对象
 export type ToRefs<T = any> = {
  [K in keyof T]: ToRef<T[K]>
}
export function toRefs<T extends object>(object: T): ToRefs<T> {
  if (__DEV__ && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
*/


/**
 * toRaw 把一个响应式数据变成非响应式
 */
 const obj = reactive({ name: 'yyfeng', like: 'JK' })
const change = () => {
  const obj1 = toRaw(obj)
  console.log(obj,obj1);
  // Proxy {name: 'yyfeng', like: 'JK'} {name: 'yyfeng', like: 'JK'}
}

/**
 * toRaw源码解析:利用响应式对象上__v_raw这个属性 取得原始值然后返回出去
export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}
 
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}
*/

</script>

<style scoped></style>
