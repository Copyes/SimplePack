// 教程不在这里，看 roid.js
const pack = require('../src/main.js')
// const vm = require('vm')

const jsBundle = pack('../example/index.js')
console.log(jsBundle)
// vm.runInThisContext(jsBundle)
