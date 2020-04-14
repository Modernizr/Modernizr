// this script is rewrites the features detects to the top level
// of the repo for a prepublish step, so folks can so things like
// import emoji from 'modernizr/emoji'
// it is dumb and badly written, but I am tired.
const m = require('..')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const version = require('../package.json').version
const Terser = require('terser')
const rollup = require('rollup')

const makeMin = (result, prop) => {
  return Terser.minify(result, {
    ecma: 5,
    warnings: true,
    compress: {
      arrows: false,
      "arguments": true,
      booleans_as_integers: true,
      typeofs: false
    },
    output: {
      comments: false,
      preamble: `
/********************************************/
/*    Modernizr v${version} | MIT          */ 
/*    Modernizr.${prop.padEnd(27 - prop.length)}*/`
    }
  }).code
}

const result = m.metadata()
  .map(m => {
    if (Array.isArray(m.property)) {
      return m.property.map(p => {
        return {
          property: p,
          amdPath: m.amdPath
        }
      })
    }

    return {
      property: m.property,
      amdPath: m.amdPath
    }
  }).flat()

if (result.filter(m => fs.existsSync(`./${m.property}`)).length > 0) {
  throw new Error('cant make production bundles')
} else {
  result.forEach(m => {

    const pkgJSON = {
      "name": `modernizr/${m.property}`,
      "version": version,
      "main": "index.js",
      "module": "main.js"
    }

    const prop = m.property
    const modifiedProp = prop.replace(/-/g,'_')
    const updatedPath = m.amdPath.replace(/^test/,'../feature-detects')
    const index = `require = require('esm')(module);module.exports = require('./main.min.js')`
    const main = `import ${modifiedProp} from "${updatedPath}.js";export default ${modifiedProp}`

    rollup
    .rollup({
      input: 'MOD',
      onwarn: () => {},
      plugins: [{
        name: 'momdernizr-module-packager',
        resolveId ( source, requestor ) {
          if (source === "MOD") {
            return source
          } else if (fs.existsSync(path.resolve(requestor, source))) {
            return path.resolve(requestor, source)
          } else {
            return null
          }
        },
        load ( id ) {
          if (id === "MOD") {
            return main
          } else if (fs.existsSync(id)) {
            return fs.readFileSync(id).toString()
          } else {
            return null
          }
        }
      }]
    })
    .then(b => b.generate({output:{format:'es'}}))
    .then(f => {
      const min = makeMin(f.output[0].code, prop)

      mkdirp.sync(`./${prop}`);
      fs.writeFileSync(`./${prop}/package.json`, JSON.stringify(pkgJSON,0,2))
      fs.writeFileSync(`./${prop}/index.js`, index)
      fs.writeFileSync(`./${prop}/main.js`, main)
      fs.writeFileSync(`./${prop}/main.min.js`, min)

    })

  })
}
