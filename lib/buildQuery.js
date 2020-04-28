const getDetectObjByAmdPath = (amdPath, metadata) => metadata.find(m => m.amdPath === amdPath || m.amdPath === `test/${amdPath}`);

function generateBuildQuery(config, metadata) {
  // Format:
  // ?-<prop1>-<prop2>-…-<propN>-<option1>-<option2>-…<optionN>[-dontmin][-cssclassprefix:<prefix>][&global=><globalVar>]
  // where prop1…N and option1…N are sorted alphabetically (for consistency)
  const dontmin = !config.minify;

  config['feature-detects'] = config['feature-detects'] || []
  config.options = config.options || []

  if (config['feature-detects'].length > 0 && typeof metadata === 'undefined') {
    throw new Error('You must provide metadata to buildQuery() if you need feature detects')
  }

  // Config uses amdPaths, but build query uses property names
  const props = config['feature-detects'].map(amdPath => {
    const detect = getDetectObjByAmdPath(amdPath, metadata);

    let prop = detect && detect.property;

      if (Array.isArray(prop)) {
        prop = prop.join('_')
      }

      return prop && prop.replace('-', '_');
  }).filter(f => f).sort()

  // Config uses amdPaths, but the option's just use their names.
  // A few of the values have to be massaged in order to match
  // the `value`
  const opts = config.options.map(o => o.replace(/^html5/, '').toLowerCase()).sort();

  // Options are AMD paths in the config, but need to be converted to
  var result = '?' + props.concat(opts).join('-') +
      (dontmin ? '-dontmin' : '') +
      ((config.classPrefix) ? '-cssclassprefix:' + config.classPrefix : '')

  // if globalVar is undefined or is set but not a string or "false", set to Modernizr
  if (config.globalVar === undefined || (typeof config.globalVar !== 'string' && config.globalVar !== false)) {
    config.globalVar = 'Modernizr'
  }
  if (config.globalVar) {
    result += `&global=${config.globalVar}`
  }

  return result
};

export default generateBuildQuery;
