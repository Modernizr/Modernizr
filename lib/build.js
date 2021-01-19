import generateBanner from './generateBanner.esm.js'
import buildConfig from './buildConfig.esm.js'
import {buildVersion} from './buildConfig.esm.js'
import metadata from './metadata.js'
import _build from './_build.esm.js'
import {minify} from 'terser'
const rollup = require('rollup')

const build = (config, cb) => {
  // weird abstraction to make sure the library and website can share logic
  return _build({buildConfig, buildVersion, cb, config, generateBanner, metadata, minify, rollup})
}


export default build
