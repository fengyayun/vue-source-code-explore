export default {
  state: {
    age: 10,
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
  modules: {},
};
