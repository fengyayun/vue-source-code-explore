<template>
  <div class="home">
    <h1>Vuex的源码解析</h1>
    <h1>A模块</h1>
    <h1>我的年龄{{ $store.state.age }}</h1>
    <h1>
      我哥哥的年龄{{ $store.getters.bigAge }}{{ $store.getters.bigAge
      }}{{ $store.getters.bigAge }}
    </h1>
    <br /><br />
    <button @click="$store.commit('changeAge', 1)">同步修改年龄</button>
    <button @click="$store.dispatch('asyncChangeAge', 1)">异步修改年龄</button>

    <h1>A模块</h1>
    <h1>我的年龄{{ $store.state.a.age }}</h1>
    <br /><br />
    <button @click="$store.commit('a/changeAge', 1)">同步修改年龄</button>
    <button @click="$store.dispatch('asyncChangeAge', 1)">异步修改年龄</button>

    <h1>MAP</h1>
    <h1>MAP age:{{ age }}</h1>
    <h1>GETTER bigAge:{{ bigAge }}</h1>
  </div>
</template>

<script>
import { mapState, mapGetter } from "../Vuex/index";

export default {
  name: "Home",
  components: {},
  created() {
    console.log("this", this);
  },
  computed: {
    ...mapState(["age"]),
    ...mapGetter(["bigAge"]),
  },
};
</script>
