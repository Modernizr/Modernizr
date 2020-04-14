'use strict';

import connect            from 'gulp-connect';
import cp                 from 'child_process'
import del                from 'del';
import eslint             from 'gulp-eslint';
import fs                 from 'fs';
import globby             from 'globby';
import gulp               from 'gulp';
import { json }           from 'body-parser';
import jsonPlugin         from '@rollup/plugin-json';
import Mocha              from 'mocha';
import Mochaheadless      from 'mocha-headless-chrome';
import NYC                from 'nyc';
import polka              from 'polka'
import pug                from 'gulp-pug';
import sirv               from 'sirv';
import path               from 'path';
import { rollup }         from 'rollup';
import istanbul           from 'rollup-plugin-istanbul';


import ModernizrMetadata  from './lib/metadata.js';
import config             from './lib/config-all';
import ThisModernizr      from '.';


const directories = {
  browserTests: globby.sync([
    'test/universal/**/*.js',
    'test/browser/**/*.js',
    '!test/browser/setup.js',
    '!test/browser/integration/*.js'
  ]),
  integrationTests: globby.sync([
    'test/browser/integration/*.js'
  ]),
  nodeTests: globby.sync([
    'test/universal/**/*.js',
    'test/node/**/*.js'
  ])
};

let failures = 0;

gulp.task('clean', () => {
  return del([
    'gh-pages',
    'test/coverage',
    'test/test-build.js',
    'test/*.html',
    'tmp'
  ]);
});

gulp.task('copy:gh-pages', () => {
  return gulp.src([
    './lib/**/*',
    './node_modules/chai/**/*',
    './node_modules/jquery/**/*',
    './node_modules/json3/**/*',
    './node_modules/lodash/**/*',
    './node_modules/mocha/**/*',
    './node_modules/requirejs/**/*',
    './node_modules/sinon/**/*',
    './node_modules/ua-parser-js/**/*',
    './src/**/*',
    './test/**/*',
    '!./test/coverage/**/*'
  ], { 'base' : '.' })
    .pipe(gulp.dest('gh-pages/'))
});

gulp.task('eslint', () => {
  return gulp.src([
    ...directories.browserTests,
    ...directories.integrationTests,
    ...directories.nodeTests,
    'feature-detects/**/*.js',
    'lib/*.js',
    'src/*.js',
    'test/**/*.js',
    '!lib/generateBanner.js',
    '!src/html5shiv.js',
    '!src/html5printshiv.js',
    '!test/test-build.js',
    '!test/coverage/**/*.js'
  ])
    .pipe(eslint({
      fix: true,
      configFile: '.eslintrc'
    }))
    .pipe(eslint.format())
});

gulp.task('buildFiles', (done) => {
  fs.writeFileSync('./lib/metadataStatic.js', `// eslint-disable-next-line
  var metadata=(function(){
    return ${JSON.stringify(ModernizrMetadata())}
  })()`)

  ThisModernizr.build(config, function(output) {
    fs.writeFileSync('test/test-build.js', output)
    done();
  });
});

gulp.task('mocha:browser', (done) => {
  const port = 3127
  const options = {
    reporter: 'dot',
    timeout: 15000,
    args: ['disable-web-security']
  };

  const iifeify = (opts) => {

    const f = opts.filePath
    const config = {
      input: f,
      external: opts.external,
      onwarn: () => {},
      output: { format: 'iife' },
      plugins: [
        jsonPlugin(),
        istanbul(),
        { load: i => i == f ? `${fs.readFileSync(f)}` : null }
      ]
    }

    return rollup(config)
  };

  const server = polka()
    .use(json({limit: '50mb', extended: true}))
    .use(sirv('.', {dev: true}))
    .post('/coverage/client', (req, res, next) => {
      const name = encodeURI(req.headers['user-agent'].replace(/\//g, '-'));

      fs.mkdirSync('.nyc_output', {recursive: true})
      fs.writeFileSync('.nyc_output/' + name + '.json', JSON.stringify(req.body));
      return res.end('OK')
    })
    .post('/iifeGen', (req, res, next) => {
      try {

        iifeify({filePath: req.body.file, external: req.body.external})
          .then(e => e.generate({output:{format:'iife', name: req.body.func, globals: function(id) {
            if (id.includes('globalThis')) {
              return
            }
            return id.match(/([^/]*).js$/)[1]
          }}})
          )
          .then(e => res.end(e.output[0].code))
      } catch (e) {
        res.statusCode = 500
        res.end(e.toString())
      }
    })
    .listen(port, function() {

    console.log(`> Ready on localhost:${port}!`);

      Mochaheadless.runner({
        ...options,
        file: 'http://localhost:3127/test/unit.html',
      })
        .then(result => {
          failures += result.result.failures.length;
          return Mochaheadless.runner({
            ...options,
            file: 'http://localhost:3127/test/integration.html'
          });
        })
        .then(result => {
          failures += result.result.failures.length;
          process.exitCode = failures;  // exit with non-zero status if there were failures
          server.server.close()
          done();
        });
  })
});

gulp.task('mocha:node', (done) => {
  const nyc = new NYC(require('./nyc.config.js'))

  const mocha = new Mocha({
    reporter: 'spec',
    timeout: 15000
  });

  nyc.reset();
  nyc.wrap();

  directories.nodeTests.forEach(file => {
    mocha.addFile(file);
  });

  nyc.addAllFiles();

  // Run the tests.
  const runner = mocha.run(fails => {
    failures += fails;
  });

  runner.on('end', () => {
    nyc.writeCoverageFile();
    nyc.report();
    done()
  });

});

gulp.task('pug', () => {
  return gulp.src('test/browser/*.pug')
    .pipe(pug({
      data: {
        browserTests: directories.browserTests,
        integrationTests: directories.integrationTests
      }
    }))
    .pipe(gulp.dest('test/'))
});

gulp.task('serve:gh-pages', gulp.series('clean', 'buildFiles', 'pug',  'copy:gh-pages', (done) => {
  connect.server({
    root: 'gh-pages/'
  });
  done();
}));

gulp.task('test', gulp.series('clean', 'eslint', 'buildFiles', 'pug', 'mocha:node', 'mocha:browser'));

gulp.task('gh-pages', gulp.series('clean', 'pug', 'buildFiles', 'copy:gh-pages'));

gulp.task('default', gulp.series('clean', 'eslint', 'buildFiles'));
