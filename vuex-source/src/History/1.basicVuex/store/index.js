import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "../Vuex/index";
Vue.use(Vuex);

// function A(_Vue){
//   console.log("1111",_Vue)
// }
// A.install = function(_Vue){
//   console.log('2222',_Vue)
// }
// Vue.use(A)

export default new Vuex.Store({
  state: {
    age:30
  },
  getters:{
    bigAge(state){
      console.log('缓存')
      return state.age + 5
    }
  },
  mutations: {
    changeAge(state,payload){
      state.age = state.age + payload
    }
  },
  actions: {
    asyncChangeAge({commit},payload){
      setTimeout(() => {
        commit('changeAge',payload)
      }, 2000);
    }
  },
  modules: {},
});
