import babel from 'rollup-plugin-babel'
export default {
  input:'./src/index.js',
  output:{
    file:'./dist/vue.js',
    name:'Vue',
    format:'umd',
    sourceMap:true
  },
  plugins:[
    babel({
      exclude:'node_modules/**'
    })
  ]
}