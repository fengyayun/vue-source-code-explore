<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <button @click="reverseMessage">reverseMessage</button>

    <h1>Attribute绑定</h1>
    <p :title="msg">Hover your mouse over me for a few seconds to see my dynamically bound title!</p>
    <p :class="{'red':isRed}" @click="toggleRed">
      This should be red... but click me to toggle it.
    </p>
    <p :style="{ color }" @click="toggleColor"> This should be green, and should toggle between green and blue on click.</p>

    <h1>条件循环</h1>
    <button @click="show = !show">toggle List</button>
    <button @click="list.push(list.length + 1)">Push Number</button>
    <button @click="list.pop">Pop Number</button>
    <button @click="list.reverse">reverse</button>
    <ul v-if="show && list.length> 0">
      <li v-for="item in list" :key="item">{{item}}</li>
    </ul>
    <div v-else-if="list.length > 0">
      List is not empty, but hidden
    </div>
    <div v-else>List is  empty</div>

    <h1>表单绑定</h1>
    <div>Text Input</div>
    <input type="text" v-model="text">{{text}}

    <div>checkbox</div>
    <input type="checkbox" id="checkbox" v-model="checked">
    <label for="checkbox">Checked: {{ checked }}</label>

    <div>Multi Checked</div>

    <input type="checkbox" id="Jack" value="Jack" v-model="checkedNames">
    <label for="checkbox">Jack</label>

    <input type="checkbox" id="Join" value="Join"  v-model="checkedNames">
    <label for="checkbox">Join</label>

    <input type="checkbox" id="Tom" value="Tom" v-model="checkedNames">
    <label for="checkbox">Tom</label>

    <div>checkNames:{{ checkedNames }}</div>

    <h1>Radio</h1>
    <input type="radio" value="One" v-model="picked">
    <label for="One">One</label>

    <input type="radio" value="Two" v-model="picked">
    <label for="Two">Two</label>

    <div>Radio Value:{{ picked }}</div>

    <h1>Selected</h1>
    <select name="selected" id="selected" v-model="selected">
      <option disabled value="">Please select one</option>
      <option >A</option>
      <option >B</option>
      <option >C</option>
    </select>
    <div>Selected:{{ selected }}</div>

    <h1>MultiSelected</h1>
    <select style="width:100px" multiple name="selected1" id="selected1" v-model="multiSelected">
      <option >A</option>
      <option >B</option>
      <option >C</option>
    </select>
    <div>Selected:{{ multiSelected }}</div>

    <h1>ToDo</h1>
    <div>
      <TodoItem v-for="item in todo" :key="todo.id" :todo="item"></TodoItem>
    </div>
  </div>
</template>

<script setup>
import TodoItem from './TodoItem.vue'
import { ref } from 'vue';
const msg = ref('Hello World')
function reverseMessage(){
  msg.value = msg.value.split('').reverse().join('')
}
const isRed = ref(true)
const color = ref('green')
function toggleRed(){
  isRed.value = !isRed.value
}
function toggleColor(){
  color.value = color.value === 'green'?'blue':'green'
}

const show = ref(true)
const list = ref([1,2,3])

const text = ref('Edit me')
const checked = ref(true)
const checkedNames = ref(['Jack'])
const picked = ref('One')
const selected = ref('A')
const multiSelected = ref('A')

const todo = ref([
  {id:1,text:'01'},
  {id:2,text:'02'},
  {id:3,text:'03'},
])

</script>
<style>
  .red {
    color:red
  }
</style>
