# travis-after-all

[![Build Status](https://travis-ci.org/alrra/travis-after-all.svg?branch=master)](https://travis-ci.org/alrra/travis-after-all)
[![devDependency Status](https://david-dm.org/alrra/travis-after-all/dev-status.svg)](https://david-dm.org/alrra/travis-after-all#info=devDependencies)

`travis-after-all` is a script that can help you execute code only once
in a [build matrix](http://docs.travis-ci.com/user/customizing-the-build/#Build-Matrix)
based on whether the build has succeeded or failed.

Or to put it in another way, `travis-after-all` is basically a temporary
workaround for: [`travis-ci/travis-ci#929`](https://github.com/travis-ci/travis-ci/issues/929).


## Usage

__[1]__ Include the command that executes the `travis-after-all` script
inside [`after_script`](http://docs.travis-ci.com/user/customizing-the-build/#The-Build-Lifecycle)
(or inside of a script that is included inside `after_script`).

__[2]__ Based on the (exit) code returned by `travis-after-all`, run
your custom code.

See [examples](#usage-examples).

--

Terminology:

* A __job passed__ if either the tests passed, or the tests failed,
  but the job was [allowed to fail](http://docs.travis-ci.com/user/customizing-the-build/#Rows-that-are-Allowed-To-Fail).

* A __build succeeded__ if all jobs passed and there is at least one
  job who's tests passed.

* A __build failed__ if there is at least one job that didn't pass,
  or if all jobs passed, but for all of them the tests failed.

--

Meaning of (exit) codes:

* `0` - is returned to the job that was assigned to run the code if
  the __build succeeded__

* `1` - is returned to the job that was assigned to run the code if
  the __build failed__

* `2` - is returned to the jobs that where not assigned to do anything

* `3` - is returned if something went wrong (e.g.: `travis-after-all`
  failed to connect to Travis CI's API)


## Usage examples

### Using `npm`

Install `travis-after-all` as a `devDependency`.

 ```bash
npm install --save-dev travis-after-all
```

Then, in your `.travis.yml` file, add:

```bash

# ...

after_script:
  - |

      declare exitCode;


      # -- [1] -------------------------------------------------------

      $(npm bin)/travis-after-all
      exitCode=$?


      # -- [2] -------------------------------------------------------

      if [ $exitCode -eq 0 ]; then
        # Here goes the code that needs to be executed if the build succeeded
      fi

      if [ $exitCode -eq 1 ]; then
        # Here goes the code that needs to be executed if the build failed
      fi


# ...

```

You can also run `travis-after-all` from within your `node` script,
e.g.:

```js
var travisAfterAll = require('travis-after-all');

function callback(code, error) {

    if ( error !== undefined ) {
       // ...
    } else {

        if ( code === 0 ) {
          // Here goes the code that needs to be executed if the build succeeded
        } else if ( code === 1) {
          // Here goes the code that needs to be executed if the build failed
        }

    }

}

travisAfterAll(callback);
```

### General usage

:warning: If your using this method, please try to keep up with the
releases and update the version number once a new version is released.

In your `.travis.yml` file add:

```bash

# ...

after_script:
  - |

      declare exitCode


      # -- [1] -------------------------------------------------------

      curl -sSL https://raw.githubusercontent.com/alrra/travis-after-all/1.4.3/lib/travis-after-all.js | node
      exitCode=$?


      # -- [2] -------------------------------------------------------

      if [ $exitCode -eq 0 ]; then
        # Here goes the code that needs to be executed if the build succeeded
      fi

      if [ $exitCode -eq 1 ]; then
        # Here goes the code that needs to be executed if the build failed
      fi

# ...

```

__Note:__ `travis-after-all` is written in JavaScript, however, since
Travis [includes the Node runtime by default](http://docs.travis-ci.com/user/ci-environment/#Runtimes),
it can be use no matter what [build environment](http://docs.travis-ci.com/user/ci-environment/)
you have.


## License

The code is available under the [MIT license](LICENSE.txt).
