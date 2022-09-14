export function mapState(stateArr = []) {
  let obj = {};
  stateArr.forEach((nameStr) => {
    obj[nameStr] = function () {
      return this.$store.state[nameStr];
    };
  });
  return obj;
}

export function mapGetter(getters = []) {
  let obj = {};
  getters.forEach((getter) => {
    obj[getter] = function () {
      return this.$store.getters[getter];
    };
  });
  return obj;
}
