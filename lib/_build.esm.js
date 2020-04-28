const _build = ({buildConfig, buildVersion, cb, config, generateBanner, metadata, minify, rollup}) => {
  cb = cb || function noop() {};
  config['feature-detects'] = config['feature-detects'] || []
  config.options = config.options || []

  const rollupConfig = buildConfig(config, metadata())

  return rollup
    .rollup(rollupConfig)
    .then(b => {
      return b.generate({output:{format:'iife'}})
    })
    .then(f => {

      const ie8Support = config['feature-detects'].includes('ie8compat')
      const banner = generateBanner(config.minify ? 'compact' : 'full', config, metadata())
      let code = f.output[0].code.replace(/__VERSION__/, buildVersion)

      // Hack the prefix into place. Anything is way too big for something so small.
      if (config.classPrefix) {
        code = code.replace(/(classPrefix'?:\s?)['"]{2}(,)/, '$1\'' + config.classPrefix.replace(/'/g, '\\\'') + '\'$2');
      }
      ['enableClasses', 'enableJSClass', 'usePrefixes'].forEach((configName) => {
        if (typeof config[configName] === 'boolean') {
          code = code.replace(new RegExp('(' + configName + '\\\'?\\s?:\\s?)(true|false)([,\\n])'), '$1' + Boolean(config[configName]) + '$3');
        }
      });

      if (config.minify) {
        code = minify(code, {
          ecma: 5,
          warnings: true,
          ie8: ie8Support,
          compress: {
            arrows: false,
            "arguments": true,
            booleans_as_integers: true,
            typeofs: false
          },
          output: {
            comments: false,
            preamble: banner
          }
        }).code
      } else {
        code = banner + code
      }

      cb(code)
    })

}

export default _build
