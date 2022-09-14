import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "../Vuex/index";
Vue.use(Vuex);
import a from "./a";
import b from "./b";

// function A(_Vue){
//   console.log("1111",_Vue)
// }
// A.install = function(_Vue){
//   console.log('2222',_Vue)
// }
// Vue.use(A)

// const myPlugin = () =>{
//   return function (store){
//     store.subscribe((mutation,state) =>{
//       console.log(mutation,state)
//     })
//   }
// }

const persistPlugin = () => {
  return function (store) {
    let initialState = window.localStorage.getItem("VUX:STATE");
    if (initialState && initialState.length > 0) {
      store.replaceState(JSON.parse(initialState));
    }
    store.subscribe((mutation, state) => {
      window.localStorage.setItem("VUX:STATE", JSON.stringify(state));
    });
  };
};

export default new Vuex.Store({
  plugins: [persistPlugin()],
  state: {
    age: 30,
  },
  getters: {
    bigAge(state) {
      console.log("缓存");
      return state.age + 5;
    },
  },
  mutations: {
    changeAge(state, payload) {
      state.age = state.age + payload;
    },
  },
  actions: {
    asyncChangeAge({ commit }, payload) {
      setTimeout(() => {
        commit("changeAge", payload);
      }, 2000);
    },
  },
  modules: {
    a,
    b,
  },
});
