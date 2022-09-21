<template>
  <div>
    <h1>ref && isRef</h1>
    <div>{{ msg1 }}</div>
    <div>{{ msg }}</div>
    <button @click="changeMsg">改变msg</button>
    <hr />
    <h1>
      shallowRef 只监听对象的value变化看是否更新 && triggerRef 强制刷新页面
    </h1>
    <div>{{ shallowRefObj }}</div>
    <button @click="changeShallowRef">更该shallowRef</button>
    <hr />
    <h1>CustomRef</h1>
    <div>{{ myValue }}</div>
    <button @click="changeMyRef">修改myRef</button>
  </div>
</template>

<script setup lang="ts">
import { ref, isRef, shallowRef, triggerRef, customRef } from 'vue'
let msg1 = 'msg' //不是响应式的
let msg = ref('msg') //不是响应式的
const changeMsg = () => {
  msg1 = 'changeMsg'
  msg.value = 'changeMsg'
  console.log(isRef(msg))
  console.log(isRef(msg1))
}

let obj1 = { name: '小明' }
const shallowRefObj = shallowRef(obj1)
const changeShallowRef = () => {
  //下面这种页面是不会刷新的 但是值有修改
  // shallowRefObj.value.name = "大明"

  //下面这种方式页面会刷新
  // shallowRefObj.value = {
  //   name:'大明'
  // }

  //下面这种强制刷新也是可以的
  // shallowRefObj.value.name = "大明"
  // triggerRef(shallowRefObj)
  console.log(shallowRefObj)
}

function myRef(value: any) {
  return customRef((track, trigger) => {
    return {
      set(newValue) {
        //自己控制实现依赖更新
        value = newValue
        if (newValue == '中明')return
        trigger()
      },
      get() {
        //依赖收集
        track()
        return value
      },
    }
  })
}
let myValue = myRef('小明')
const changeMyRef = () => {
  myValue.value = '大明'
  console.log(myValue)
}


/**
 * ref 的源码 就是会进行依赖收集以及依赖触发 而且如果传入是对象类型 ref内部会自动去调用reactive
 function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    const useDirectValue =
      this.__v_isShallow || isShallow(newVal) || isReadonly(newVal)
    newVal = useDirectValue ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = useDirectValue ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
}

export function triggerRef(ref: Ref) {
  triggerRefValue(ref, __DEV__ ? ref.value : void 0)
}
*/


/**
 * toRef 的源码 判断其value值是否存在
 * export function unref<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}
*/


/**
 * shallowRef 就是在 new RefImpl(rawValue, shallow) 这里shallow传了true 代表只会响应式一层
*/

/**
 * triggerRef 在创建ref函数中用使用 执行set方法触发依赖就是该方法
export function triggerRef(ref: Ref) {
  triggerRefValue(ref, __DEV__ ? ref.value : void 0)
}

*/


/**
 * customRef 就是创建一个可以自己可以管理收集依赖&触发依赖的ref
 
 export type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}

class CustomRefImpl<T> {
  public dep?: Dep = undefined

  private readonly _get: ReturnType<CustomRefFactory<T>>['get']
  private readonly _set: ReturnType<CustomRefFactory<T>>['set']

  public readonly __v_isRef = true

  constructor(factory: CustomRefFactory<T>) {
    const { get, set } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    )
    this._get = get
    this._set = set
  }

  get value() {
    return this._get()
  }

  set value(newVal) {
    this._set(newVal)
  }
}

export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl(factory) as any
}

*/



</script>

<style scoped></style>
