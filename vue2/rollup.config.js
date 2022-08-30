import babel from 'rollup-plugin-babel'
import rollupNodeResolvePlugin from '@rollup/plugin-node-resolve'
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
    }),
    rollupNodeResolvePlugin()
  ]
}