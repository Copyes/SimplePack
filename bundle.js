;(function(modules) {
  function require(id) {
    const [fn, idMapping] = modules[id]
    function childRequire(filename) {
      return require(idMapping[filename])
    }
    const newModule = { exports: {} }
    fn(childRequire, newModule, newModule.exports)
    return newModule.exports
  }
  require(0)
})({
  0: [
    function(require, module, exports) {
      

      const _module = require('./module2.js')

      const _module2 = require('./module1.js')

      const _module3 = _interopRequireDefault(_module2)

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj }
      }

      const text = (0, _module3.default)()
      console.log()
      console.log(text)

      console.log("welcome to test, I'm", _module.name)
    },
    { './module2.js': 1, './module1.js': 2 }
  ],
  1: [
    function(require, module, exports) {
      

      Object.defineProperty(exports, '__esModule', {
        value: true
      })
      const name = (exports.name = 'fan chao')
    },
    {}
  ],
  2: [
    function(require, module, exports) {
      

      Object.defineProperty(exports, '__esModule', {
        value: true
      })

      const _module = require('./module2.js')

      exports.default = function() {
        return `hello ${  _module.name  }!`
      }
    },
    { './module2.js': 3 }
  ],
  3: [
    function(require, module, exports) {
      

      Object.defineProperty(exports, '__esModule', {
        value: true
      })
      const name = (exports.name = 'fan chao')
    },
    {}
  ]
})
