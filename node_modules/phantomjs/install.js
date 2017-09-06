// Copyright 2012 The Obvious Corporation.

/*
 * This simply fetches the right version of phantom for the current platform.
 */

'use strict'

var requestProgress = require('request-progress')
var progress = require('progress')
var extractZip = require('extract-zip')
var cp = require('child_process')
var fs = require('fs-extra')
var hasha = require('hasha')
var helper = require('./lib/phantomjs')
var kew = require('kew')
var path = require('path')
var request = require('request')
var url = require('url')
var which = require('which')

var originalPath = process.env.PATH
var DEFAULT_CDN = 'https://github.com/Medium/phantomjs/releases/download/v1.9.19'

// If the process exits without going through exit(), then we did not complete.
var validExit = false

process.on('exit', function () {
  if (!validExit) {
    console.log('Install exited unexpectedly')
    exit(1)
  }
})

// NPM adds bin directories to the path, which will cause `which` to find the
// bin for this package not the actual phantomjs bin.  Also help out people who
// put ./bin on their path
process.env.PATH = helper.cleanPath(originalPath)

var libPath = path.join(__dirname, 'lib')
var pkgPath = path.join(libPath, 'phantom')
var phantomPath = null

// If the user manually installed PhantomJS, we want
// to use the existing version.
//
// Do not re-use a manually-installed PhantomJS with
// a different version.
//
// Do not re-use an npm-installed PhantomJS, because
// that can lead to weird circular dependencies between
// local versions and global versions.
// https://github.com/Obvious/phantomjs/issues/85
// https://github.com/Medium/phantomjs/pull/184
kew.resolve(true)
  .then(tryPhantomjsInLib)
  .then(tryPhantomjsOnPath)
  .then(downloadPhantomjs)
  .then(extractDownload)
  .then(function (extractedPath) {
    return copyIntoPlace(extractedPath, pkgPath)
  })
  .then(function () {
    var location = getTargetPlatform() === 'win32' ?
        path.join(pkgPath, 'phantomjs.exe') :
        path.join(pkgPath, 'bin' ,'phantomjs')

    try {
      // Ensure executable is executable by all users
      fs.chmodSync(location, '755')
    } catch (err) {
      if (err.code == 'ENOENT') {
        console.error('chmod failed: phantomjs was not successfully copied to', location)
        exit(1)
      }
      throw err
    }

    var relativeLocation = path.relative(libPath, location)
    writeLocationFile(relativeLocation)

    console.log('Done. Phantomjs binary available at', location)
    exit(0)
  })
  .fail(function (err) {
    console.error('Phantom installation failed', err, err.stack)
    exit(1)
  })


function writeLocationFile(location) {
  console.log('Writing location.js file')
  if (getTargetPlatform() === 'win32') {
    location = location.replace(/\\/g, '\\\\')
  }

  var platform = getTargetPlatform()
  var arch = getTargetArch()

  var contents = 'module.exports.location = "' + location + '"\n'

  if (/^[a-zA-Z0-9]*$/.test(platform) && /^[a-zA-Z0-9]*$/.test(arch)) {
    contents +=
        'module.exports.platform = "' + getTargetPlatform() + '"\n' +
        'module.exports.arch = "' + getTargetArch() + '"\n'
  }

  fs.writeFileSync(path.join(libPath, 'location.js'), contents)
}

function exit(code) {
  validExit = true
  process.env.PATH = originalPath
  process.exit(code || 0)
}


function findSuitableTempDirectory() {
  var now = Date.now()
  var candidateTmpDirs = [
    process.env.TMPDIR || process.env.TEMP || process.env.npm_config_tmp,
    '/tmp',
    path.join(process.cwd(), 'tmp')
  ]

  for (var i = 0; i < candidateTmpDirs.length; i++) {
    var candidatePath = path.join(candidateTmpDirs[i], 'phantomjs')

    try {
      fs.mkdirsSync(candidatePath, '0777')
      // Make double sure we have 0777 permissions; some operating systems
      // default umask does not allow write by default.
      fs.chmodSync(candidatePath, '0777')
      var testFile = path.join(candidatePath, now + '.tmp')
      fs.writeFileSync(testFile, 'test')
      fs.unlinkSync(testFile)
      return candidatePath
    } catch (e) {
      console.log(candidatePath, 'is not writable:', e.message)
    }
  }

  console.error('Can not find a writable tmp directory, please report issue ' +
      'on https://github.com/Obvious/phantomjs/issues/59 with as much ' +
      'information as possible.')
  exit(1)
}


function getRequestOptions() {
  var strictSSL = !!process.env.npm_config_strict_ssl
  if (process.version == 'v0.10.34') {
    console.log('Node v0.10.34 detected, turning off strict ssl due to https://github.com/joyent/node/issues/8894')
    strictSSL = false
  }

  var options = {
    uri: getDownloadUrl(),
    encoding: null, // Get response as a buffer
    followRedirect: true, // The default download path redirects to a CDN URL.
    headers: {},
    strictSSL: strictSSL
  }

  var proxyUrl = process.env.npm_config_https_proxy ||
      process.env.npm_config_http_proxy ||
      process.env.npm_config_proxy
  if (proxyUrl) {

    // Print using proxy
    var proxy = url.parse(proxyUrl)
    if (proxy.auth) {
      // Mask password
      proxy.auth = proxy.auth.replace(/:.*$/, ':******')
    }
    console.log('Using proxy ' + url.format(proxy))

    // Enable proxy
    options.proxy = proxyUrl
  }

  // Use the user-agent string from the npm config
  options.headers['User-Agent'] = process.env.npm_config_user_agent

  // Use certificate authority settings from npm
  var ca = process.env.npm_config_ca
  if (!ca && process.env.npm_config_cafile) {
    try {
      ca = fs.readFileSync(process.env.npm_config_cafile, {encoding: 'utf8'})
        .split(/\n(?=-----BEGIN CERTIFICATE-----)/g)

      // Comments at the beginning of the file result in the first
      // item not containing a certificate - in this case the
      // download will fail
      if (ca.length > 0 && !/-----BEGIN CERTIFICATE-----/.test(ca[0])) {
        ca.shift()
      }

    } catch (e) {
      console.error('Could not read cafile', process.env.npm_config_cafile, e)
    }
  }

  if (ca) {
    console.log('Using npmconf ca')
    options.agentOptions = {
      ca: ca
    }
    options.ca = ca
  }

  return options
}

function handleRequestError(error) {
  if (error && error.stack && error.stack.indexOf('SELF_SIGNED_CERT_IN_CHAIN') != -1) {
      console.error('Error making request, SELF_SIGNED_CERT_IN_CHAIN. ' +
          'Please read https://github.com/Medium/phantomjs#i-am-behind-a-corporate-proxy-that-uses-self-signed-ssl-certificates-to-intercept-encrypted-traffic')
      exit(1)
  } else if (error) {
    console.error('Error making request.\n' + error.stack + '\n\n' +
        'Please report this full log at https://github.com/Medium/phantomjs')
    exit(1)
  } else {
    console.error('Something unexpected happened, please report this full ' +
        'log at https://github.com/Medium/phantomjs')
    exit(1)
  }
}

function requestBinary(requestOptions, filePath) {
  var deferred = kew.defer()

  var writePath = filePath + '-download-' + Date.now()

  console.log('Receiving...')
  var bar = null
  requestProgress(request(requestOptions, function (error, response, body) {
    console.log('')
    if (!error && response.statusCode === 200) {
      fs.writeFileSync(writePath, body)
      console.log('Received ' + Math.floor(body.length / 1024) + 'K total.')
      fs.renameSync(writePath, filePath)
      deferred.resolve(filePath)

    } else if (response) {
      console.error('Error requesting archive.\n' +
          'Status: ' + response.statusCode + '\n' +
          'Request options: ' + JSON.stringify(requestOptions, null, 2) + '\n' +
          'Response headers: ' + JSON.stringify(response.headers, null, 2) + '\n' +
          'Make sure your network and proxy settings are correct.\n\n' +
          'If you continue to have issues, please report this full log at ' +
          'https://github.com/Medium/phantomjs')
      exit(1)
    } else {
      handleRequestError(error)
    }
  })).on('progress', function (state) {
    try {
      if (!bar) {
        bar = new progress('  [:bar] :percent', {total: state.size.total, width: 40})
      }
      bar.curr = state.size.transferred
      bar.tick()
    } catch (e) {
      // It doesn't really matter if the progress bar doesn't update.
    }
  })
  .on('error', handleRequestError)

  return deferred.promise
}


function extractDownload(filePath) {
  var deferred = kew.defer()
  // extract to a unique directory in case multiple processes are
  // installing and extracting at once
  var extractedPath = filePath + '-extract-' + Date.now()
  var options = {cwd: extractedPath}

  fs.mkdirsSync(extractedPath, '0777')
  // Make double sure we have 0777 permissions; some operating systems
  // default umask does not allow write by default.
  fs.chmodSync(extractedPath, '0777')

  if (filePath.substr(-4) === '.zip') {
    console.log('Extracting zip contents')
    extractZip(path.resolve(filePath), {dir: extractedPath}, function(err) {
      if (err) {
        console.error('Error extracting zip')
        deferred.reject(err)
      } else {
        deferred.resolve(extractedPath)
      }
    })

  } else {
    console.log('Extracting tar contents (via spawned process)')
    cp.execFile('tar', ['jxf', path.resolve(filePath)], options, function (err) {
      if (err) {
        console.error('Error extracting archive')
        deferred.reject(err)
      } else {
        deferred.resolve(extractedPath)
      }
    })
  }
  return deferred.promise
}


function copyIntoPlace(extractedPath, targetPath) {
  console.log('Removing', targetPath)
  return kew.nfcall(fs.remove, targetPath).then(function () {
    // Look for the extracted directory, so we can rename it.
    var files = fs.readdirSync(extractedPath)
    for (var i = 0; i < files.length; i++) {
      var file = path.join(extractedPath, files[i])
      if (fs.statSync(file).isDirectory() && file.indexOf(helper.version) != -1) {
        console.log('Copying extracted folder', file, '->', targetPath)
        return kew.nfcall(fs.move, file, targetPath)
      }
    }

    console.log('Could not find extracted file', files)
    throw new Error('Could not find extracted file')
  })
}

function getLocationInLibModuleIfMatching(libPath) {
  var libModule = require(libPath)
  if (libModule.location &&
      getTargetPlatform() == libModule.platform &&
      getTargetArch() == libModule.arch) {
    try {
      var resolvedLocation = path.resolve(path.dirname(libPath), libModule.location)
      if (fs.statSync(resolvedLocation)) {
        return resolvedLocation
      }
    } catch (e) {
      // fall through
    }
  }
  return false
}

/**
 * Check to see if the binary in lib is OK to use. If successful, exit the process.
 */
function tryPhantomjsInLib() {
  return kew.fcall(function () {
    var location = getLocationInLibModuleIfMatching('./lib/location.js')
    if (location) {
      console.log('PhantomJS is previously installed at', location)
      exit(0)
    }
  }).fail(function () {
    // silently swallow any errors
  })
}

/**
 * Check to see if the binary on PATH is OK to use. If successful, exit the process.
 */
function tryPhantomjsOnPath() {
  if (getTargetPlatform() != process.platform || getTargetArch() != process.arch) {
    console.log('Building for target platform ' + getTargetPlatform() + '/' + getTargetArch() +
                '. Skipping PATH search')
    return kew.resolve(false)
  }

  return kew.nfcall(which, 'phantomjs')
  .then(function (result) {
    phantomPath = result
    console.log('Considering PhantomJS found at', phantomPath)

    // Horrible hack to avoid problems during global install. We check to see if
    // the file `which` found is our own bin script.
    if (phantomPath.indexOf(path.join('npm', 'phantomjs')) !== -1) {
      console.log('Looks like an `npm install -g` on windows; skipping installed version.')
      return
    }

    var contents = fs.readFileSync(phantomPath, 'utf8')
    if (/NPM_INSTALL_MARKER/.test(contents)) {
      console.log('Looks like an `npm install -g`')

      var globalLocation = getLocationInLibModuleIfMatching(
          path.resolve(fs.realpathSync(phantomPath), '../../lib/location'))
      if (globalLocation) {
        console.log('Linking to global install at', globalLocation)
        writeLocationFile(globalLocation)
        exit(0)
      }

      console.log('Could not link global install, skipping...')
    } else {
      return checkPhantomjsVersion(phantomPath).then(function (matches) {
        if (matches) {
          writeLocationFile(phantomPath)
          console.log('PhantomJS is already installed on PATH at', phantomPath)
          exit(0)
        }
      })
    }
  }, function () {
    console.log('PhantomJS not found on PATH')
  })
  .fail(function (err) {
    console.error('Error checking path, continuing', err)
    return false
  })
}

/**
 * @return {?string} Get the download URL for phantomjs.
 *     May return null if no download url exists.
 */
function getDownloadUrl() {
  var spec = getDownloadSpec()
  return spec && spec.url
}

/**
 * @return {?{url: string, checksum: string}} Get the download URL and expected
 *     SHA-256 checksum for phantomjs.  May return null if no download url exists.
 */
function getDownloadSpec() {
  var cdnUrl = process.env.npm_config_phantomjs_cdnurl ||
      process.env.PHANTOMJS_CDNURL ||
      DEFAULT_CDN
  var downloadUrl = cdnUrl + '/phantomjs-' + helper.version + '-'
  var checksum = ''

  var platform = getTargetPlatform()
  var arch = getTargetArch()
  if (platform === 'linux' && arch === 'x64') {
    downloadUrl += 'linux-x86_64.tar.bz2'
    checksum = 'a1d9628118e270f26c4ddd1d7f3502a93b48ede334b8585d11c1c3ae7bc7163a'
  } else if (platform === 'linux' && arch == 'ia32') {
    downloadUrl += 'linux-i686.tar.bz2'
    checksum = '4102450bb658157e9aef3e229828fade0aaa0de0663802b31a0edff4b5aedf85'
  } else if (platform === 'darwin' || platform === 'openbsd' || platform === 'freebsd') {
    downloadUrl += 'macosx.zip'
    checksum = '8f15043ae3031815dc5f884ea6ffa053d365491b1bc0dc3a0862d5ff1ac20a48'
  } else if (platform === 'win32') {
    downloadUrl += 'windows.zip'
    checksum = 'da36853ece7d58b6f50813d3e598d8a16bb191b467ac32e1624a239a49de9104'
  } else {
    return null
  }
  return {url: downloadUrl, checksum: checksum}
}

/**
 * Download phantomjs, reusing the existing copy on disk if available.
 * Exits immediately if there is no binary to download.
 * @return {Promise.<string>} The path to the downloaded file.
 */
function downloadPhantomjs() {
  var downloadSpec = getDownloadSpec()
  if (!downloadSpec) {
    console.error(
        'Unexpected platform or architecture: ' + getTargetPlatform() + '/' + getTargetArch() + '\n' +
        'It seems there is no binary available for your platform/architecture\n' +
        'Try to install PhantomJS globally')
    exit(1)
  }

  var downloadUrl = downloadSpec.url
  var downloadedFile

  return kew.fcall(function () {
    // Can't use a global version so start a download.
    var tmpPath = findSuitableTempDirectory()
    var fileName = downloadUrl.split('/').pop()
    downloadedFile = path.join(tmpPath, fileName)

    if (fs.existsSync(downloadedFile)) {
      console.log('Download already available at', downloadedFile)
      return verifyChecksum(downloadedFile, downloadSpec.checksum)
    }
    return false
  }).then(function (verified) {
    if (verified) {
      return downloadedFile
    }

    // Start the install.
    console.log('Downloading', downloadUrl)
    console.log('Saving to', downloadedFile)
    return requestBinary(getRequestOptions(), downloadedFile)
  })
}

/**
 * Check to make sure that the file matches the checksum.
 * @param {string} fileName
 * @param {string} checksum
 * @return {Promise.<boolean>}
 */
function verifyChecksum(fileName, checksum) {
  return kew.resolve(hasha.fromFile(fileName, {algorithm: 'sha256'})).then(function (hash) {
    var result = checksum == hash
    if (result) {
      console.log('Verified checksum of previously downloaded file')
    } else {
      console.log('Checksum did not match')
    }
    return result
  }).fail(function (err) {
    console.error('Failed to verify checksum: ', err)
    return false
  })
}

/**
 * Check to make sure a given binary is the right version.
 * @return {kew.Promise.<boolean>}
 */
function checkPhantomjsVersion(phantomPath) {
  console.log('Found PhantomJS at', phantomPath, '...verifying')
  return kew.nfcall(cp.execFile, phantomPath, ['--version']).then(function (stdout) {
    var version = stdout.trim()
    if (helper.version == version) {
      return true
    } else {
      console.log('PhantomJS detected, but wrong version', stdout.trim(), '@', phantomPath + '.')
      return false
    }
  }).fail(function (err) {
    console.error('Error verifying phantomjs, continuing', err)
    return false
  })
}

/**
 * @return {string}
 */
function getTargetPlatform() {
  return process.env.PHANTOMJS_PLATFORM || process.platform
}

/**
 * @return {string}
 */
function getTargetArch() {
  return process.env.PHANTOMJS_ARCH || process.arch
}
