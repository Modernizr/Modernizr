// this takes the modernizr config and generates the requisite rollup config
import _globalThis from '../src/globalThis.js';
import {version} from '../package.json';

const parseURL = (source) => {
  try {
    return new URL(source);
  } catch (error) {
    // Not a valid absolute-URL-with-fragment string
    // https://url.spec.whatwg.org/#absolute-url-with-fragment-string
    return null;
  }
}

async function loadURL(url, fetchOpts) {
  return fetch(url, fetchOpts).then(r => r.text().then(text => text))
}

const codeGen = (config) => {
  let result = `import * as Modernizr from "../modernizr/src/Modernizr.js"\n`

  const detects = config['feature-detects'] || [];
  const options = (config['options'] || []).filter(o => {
    // filter out options from older versions of Modernizr
    // that no longer exist in v4
    return !['addTest', 'load', 'setClasses'].includes(o)
  });

  result += options.map(o => {
    let optionPath = `../modernizr/src/${o}.js`;

    return `import ${o} from "${optionPath}";`
  }).join('\n')

  result += detects.map(d => `import "${ d.replace(/^(test\/)?/,'../modernizr/feature-detects/') }.js";`).join('\n')

  // if globalVar is undefined or is set but not a string or "false", set to Modernizr
  if (config.globalVar === undefined || (typeof config.globalVar !== 'string' && config.globalVar !== false)) {
    config.globalVar = 'Modernizr'
  }

  if (config.globalVar) {
    result += `Modernizr.testRunner(); self["${config.globalVar}"] = Modernizr.default;`
  }

  return result
}

const buildConfig = (config) => {

  const rollupConfig = {
    input: "modernizr-module",
    onwarn: /* istanbul ignore next */ (msg, originalWarn) => {
      if (msg.code !== 'EVAL') {
        console.group('')
        originalWarn(msg)
        if (msg.loc) {
          // taken from https://git.io/JvjRw
          originalWarn(`\t${((msg.loc.file || msg.id))} (${msg.loc.line}:${msg.loc.column})`)
        }
        console.groupEnd('')
      }
    },
    plugins: [
      {
        name: 'modernizr-builder-plugin',
        resolveId ( source, requestor ) {
          if (source === 'modernizr-module') {
            // if it is our dummy file name, we just pass it through to load
            return source;
          }
          else if (source.startsWith('.') && _globalThis.self) {
            // `self` being dedfined means that we are in the browser, so we need to rewrite
            // the module imports to be absolute URLs in order to actually load them.
            // if the import source starts with a dot, its trying to load a relative path
            // (we do not import anything other than our own modules, so this is guaranteed)
            if (!parseURL(requestor)) {
              // the requestor arg is only included if it is being imported by an import. we
              // we can use this value as the absolute path to compare the source's relative
              // path. if there is no requestor, the we can key off of the current URL
              requestor = location.href
            }
            return new URL(source, requestor).href
          }
          return null;
        },
        load (id) {
          if (id === 'modernizr-module') {
            // the source code for "virtual-module"
            return codeGen(config)
          }
          else if (parseURL(id)) {
            return loadURL(id)
          }
          return null; // other ids should be handled as usually
        }
      }
    ]
  }

  return rollupConfig
}

export default buildConfig
export let buildVersion = version
