<template>
  <div class="home">
    <h1>Vuex的源码解析</h1>
    <h1>我的年龄{{$store.state.age}}</h1>
    <h1>我哥哥的年龄{{$store.getters.bigAge}}{{$store.getters.bigAge}}{{$store.getters.bigAge}}</h1>
    <button @click="$store.commit('changeAge',1)">同步修改年龄</button>
    <br /><br />
    <button @click="$store.dispatch('asyncChangeAge',1)">异步修改年龄</button>
  </div>
</template>

<script>

export default {
  name: "Home",
  components: {
  },
  created(){
    console.log('this',this)
  }
};
</script>
