const url = require('url');
const path = require('path');

const requireOrImport = async file => {
  file = path.resolve(file);

  if (path.extname(file) === '.mjs') {
    return import(url.pathToFileURL(file));
  }
  // This is currently the only known way of figuring out whether a file is CJS or ESM.
  // If Node.js or the community establish a better procedure for that, we can fix this code.
  // Another option here would be to always use `import()`, as this also supports CJS, but I would be
  // wary of using it for _all_ existing test files, till ESM is fully stable.
  try {
    return require(file);
  } catch (err) {
    if (err.code === 'ERR_REQUIRE_ESM') {
      return import(url.pathToFileURL(file));
    } else {
      throw err;
    }
  }
};

exports.loadFilesAsync = async (files, preLoadFunc, postLoadFunc) => {
  for (const file of files) {
    preLoadFunc(file);
    const result = await requireOrImport(file);
    postLoadFunc(file, result);
  }
};
