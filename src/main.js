const path = require('path')
const fs = require('fs')
const traverse = require('babel-traverse').default
const { transformFromAst, transform } = require('babel-core')

let ID = 0
// 当前用户操作的文件路径
function loader(filename, code) {
  if (/ext/.test(filename)) {
    console.log('this is a loader')
  }
  return code
}

function parseDependence(filename) {
  const rowCode = fs.readFileSync(filename, 'utf-8')

  const ast = transform(rowCode).ast
  const dependences = []

  traverse(ast, {
    ImportDeclaration({ node }) {
      const sourcePath = node.source.value
      dependences.push(sourcePath)
    }
  })

  const es5Code = transformFromAst(ast, null, {
    presets: ['env']
  }).code

  const customCode = loader(filename, es5Code)

  return {
    id: ID++,
    code: customCode,
    dependences,
    filename
  }
}

function parseGraph(entry) {
  const entryAsset = parseDependence(path.join(__dirname, entry))
  const graph = [entryAsset]

  for (const asset of graph) {
    if (!asset.idMapping) {
      asset.idMapping = {}
    }

    const dir = path.dirname(asset.filename)

    asset.dependences.forEach((dependencePath) => {
      const absolutePath = path.resolve(dir, dependencePath)
      const dependenceAsset = parseDependence(absolutePath)

      const { id } = dependenceAsset

      asset.idMapping[dependencePath] = id

      graph.push(dependenceAsset)
    })
  }
  return graph
}

function build(graph) {
  let modules = ''

  graph.forEach((asset) => {
    modules += `${asset.id}:[
      function(require,module,exports) {
        ${asset.code}
      },
      ${JSON.stringify(asset.idMapping)}
    ]`
  })

  const wrap = `
    (function(modules){
      function require(id){
        const [fn, idMapping] = modules[id];
        function childRequire(filename){
          return require(idMapping[filename]);
        }
        const newModule = {exports: {}};
        fn(childRequire, newModule, newModule.exports)
        return newModule.exports
      }
      require(0)
    })(${modules})
  `
  return wrap
}

module.exports = (entry) => {
  const graph = parseGraph(entry)
  const bundle = build(graph)

  return bundle
}
