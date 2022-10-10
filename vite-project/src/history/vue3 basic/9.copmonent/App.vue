<template>
  <Card content="我是传过来的内容"></Card>
  <TreeItem :data="data"></TreeItem>
  <component :is="dynamicComponent"></component>
  <button @click="switchComponent">切换AB</button>
  <Dialog>
    <!-- <template v-slot:header>
      <div>剧名插槽</div>
    </template>
    <template v-slot>默认插槽</template>
    <template v-slot:footer>
      <div>剧名插槽</div>
    </template> -->
    <!-- 剧名插槽 -->

    <!-- <template #header>
      <div>剧名插槽</div>
    </template>
    <template #default>默认插槽</template>
    <template #footer>
      <div>剧名插槽</div>
    </template> -->

    <!-- 作用域插槽 使用子组件的数据 -->
    <!-- <template #default="{ data }">
      <div>{{ data }}</div>
   </template> -->
    <!-- <AsyncComponent></AsyncComponent> -->
    <Suspense>
      <template #default>
        <AsyncComponent></AsyncComponent>
      </template>
      <template #fallback>
        <div>loading...</div>
      </template>
    </Suspense>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref, shallowRef, markRaw, defineAsyncComponent } from 'vue'
import TreeItem from '../src/components/tree/index.vue'
import A from './views/A.vue'
import B from './views/B.vue'
import Dialog from './views/Dialog.vue'
const AsyncComponent = defineAsyncComponent(
  () => import('./views/AsyncComponent.vue')
)
type TreeList = {
  name: string
  icon?: string
  children?: TreeList[] | []
}
// 递归组件
const data = reactive<TreeList[]>([
  {
    name: 'no.1',
    children: [
      {
        name: 'no.1-1',
        children: [
          {
            name: 'no.1-1-1',
          },
        ],
      },
    ],
  },
  {
    name: 'no.2',
    children: [
      {
        name: 'no.2-1',
      },
    ],
  },
  {
    name: 'no.3',
  },
])
/**
 * vue2 的动态组件可以是字符串 vue3中的动态组件不能是字符串
 */
let dynamicComponent = shallowRef<any>(null)
let flag = ref(false)
const switchComponent = () => {
  flag.value = !flag.value
  flag.value ? (dynamicComponent.value = B) : (dynamicComponent.value = A)
}

type Com = {
  name: string
  comName: any
}
/**
 *  markRaw 跳过proxy 代理 或者使用shallowReactive替代
 */
const tab = reactive<Com[]>([
  {
    name: 'A组件',
    comName: markRaw(A),
  },
  {
    name: 'B组件',
    comName: markRaw(B),
  },
])
</script>

<style scoped></style>
