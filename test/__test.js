const fs = require('fs')
const path = require('path')
const pack = require('../src/main.js')

const jsBundle = pack('../example/index.js')
fs.writeFileSync(path.resolve(__dirname, '../bundle.js'), jsBundle)
console.log(jsBundle)
