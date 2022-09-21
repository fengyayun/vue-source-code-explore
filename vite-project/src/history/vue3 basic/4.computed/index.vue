<template>
  <div>
    <!-- <input key="11" type="text" v-model="firstName">
    <input key="22" type="text" v-model="lastName">
    <div>{{ name }}</div> -->
    <table border style="width:800px">
      <thead>
        <th>名称</th>
        <th>数量</th>
        <th>价格</th>
        <th>操作</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in shops" :key="index">
          <td>{{ item.name }}</td>
          <td>
            <button @click="numChange(item,true)">+</button>
            {{ item.num }}
            <button @click="numChange(item,false)">-</button>
          </td>
          <td>{{ item.price }}</td>
          <td>
            <button @click="deleteItem(index)">删除</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <td colspan="4">{{ total }}</td>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

/**
 * computed 支持对象以及函数模式
 */
// const firstName = ref('')
// const lastName = ref('')
// const name = computed({
//   get(){
//     return firstName.value + lastName.value
//   },
//   set(newValue){
//     console.log('1111',newValue)
//   }
// })

/**
 * 下面是简单购物车的案例
 */

type shop = {
  num: number,
  name: string,
  price: number,
}
const shops = reactive<shop[]>([{
  num: 100,
  name: '商品000001',
  price: 1
},{
  num: 200,
  name: '商品000002',
  price: 2
},{
  num: 300,
  name: '商品000003',
  price: 3
}])

const deleteItem = (index:number) =>{
  shops.splice(index,1)
}
const numChange = (item:shop,numAdd:boolean =false) =>{
  if (numAdd){
    item.num+=1
  }else {
    item.num-=1
  }
}
const total = computed<number>(() =>{
  return shops.reduce((totalPrice,current) =>totalPrice+current.price,0)
})
</script>

<style scoped></style>
