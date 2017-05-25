/* global setTimeout */
/*!
{
  "name": "HbbTV Video",
  "property": "hbbtvvideo",
  "tags": ["hbbtv", "oipf", "video"],
  "async" : true,
  "warnings": [
    "This test is currently only compatible to HbbTV >= 1.x",
    "All siblings of an existing HbbTV video object in the DOM will be deleted during the test"
  ],
  "notes": [{
      "name": "OIPF Specification Volume 5 Release 1 v1.1 - Declarative Application Environment",
      "href": "http://www.oipf.tv/"
    },
    {
      "name": "MIT-xperts HBBTV testsuite",
      "href": "https://github.com/mitxp/HbbTV-Testsuite"
    }]
}
!*/
/* DOC
Tests if the play, pause and seek functionality of the HbbTV video object works correctly.

At the moment the [test video](https://cdn.rawgit.com/philippsimon/Modernizr/hbbtv/feature-detects/hbbtv/test.mp4) is loaded from Github.
For a reliable use I suggest to host the video yourself and set `window.MODERNIZR_HBBTVVIDEO_TEST_VIDEO` to that URL.
*/
define(['Modernizr', 'addTest', 'getBody', 'createElement', 'test/hbbtv'], function(Modernizr, addTest, getBody, createElement) {

  /*
   * Leave the console statements inside as it's the only good working way to debug the problematic HbbTV devices
   *
   * @todo Use additionally DOMNodeRemoved, DOMNodeInserted to speed up the tests
   * @todo The generated and uploaded video doesn't work with every device
   */

  var PLAYSTATES = ['stopped', 'playing', 'paused', 'connecting', 'buffering', 'finished', 'error'];

  /*
    The test video was generated with the following command:

    ffmpeg -f lavfi \
    -i color=color=black:rate=25:size=352x288 \
    -ar 32000 -ac 1 -f s16le -i /dev/zero \
    -t 180 \
    -codec:v libx264 -profile:v main -preset veryslow -r:v 25 -aspect 16:9 -g 50 -x264opts pic-struct:no-scenecut:keyint=50:keyint_min=50:colorprim=bt709:transfer=bt709:colormatrix=bt709:open_gop=0 -pix_fmt yuv420p \
    -codec:a libfdk_aac -profile:a aac_low -b:a 8k \
    -async 1 \
    -map_chapters -1 -metadata:s language=deu \
    -movflags faststart -y \
    test.mp4

    As several devices crash when the data is set base64 encoded we have to use a link.
  */
  var testData = window.MODERNIZR_HBBTVVIDEO_TEST_VIDEO || '//github.com/p7s1digital/Modernizr/raw/hbbtv/test/video/black_352x288_25fps_180s_aac_low.mp4';

  var timeouts = {
    play: 15000,
    pause: 2000,
    seek: 15000
  };
  var seekPosition = 30000;

  Modernizr.addAsyncTest(function() {
    if (!Modernizr.hbbtv) {
      addTest('hbbtvvideo', false);
      return;
    }

    if (document.readyState === 'complete') {
      runTests();
    } else {
      // console.log('onload');
      runTests.previousOnLoad = window.onload;
      window.onload = runTests;
    }

  });

  function runTests() {
    // console.log('runTests');

    if (this.previousOnLoad) {
      this.previousOnLoad();
    }

    setTimeout(function() {
      var finished = {
        play: false,
        pause: false,
        seek: false
      };
      var passed = {
        play: false,
        pause: false,
        seek: false
      };

      createTestVideo(function(video, existingVideoParams) {
        if (!video) {
          finishTest();
          return;
        }

        //initApp();

        var videoId = video.id;

        var tests = {

          play: function() {
            try {
              video.play(1);
              // console.log('video.play');
            } catch (e) {
              // console.log('video.play failed');
              finishTest();
              return;
            }

            setTimeout(function() {
              if (!passed.play) {
                // console.log('video.play timed out');
                finishTest();
              }
            }, timeouts.play);
          },

          pause: function() {
            try {
              video.play(0);
              // console.log('video.pause');
            } catch (e) {
              // console.log('video.pause failed');
              finished.pause = true;
              setTimeout(tests.seek, 0);
            }

            setTimeout(function() {
              if (!passed.pause) {
                // console.log('video.pause timed out');
                finished.pause = true;
                setTimeout(tests.seek, 0);
              }
            }, timeouts.pause);
          },

          seek: function() {
            try {
              video.seek(seekPosition);
              // console.log('video.seek');
              video.play(1);
              // console.log('video.seek');

              // send additional seek for some devices which need it executed while the video is in the playing state
              var intervalCounter = 0;
              var interval = setInterval(function() {
                if (++intervalCounter >= 10) {
                  clearInterval(interval);
                  return;
                }

                if (PLAYSTATES[video.playState] === 'playing') {
                  clearInterval(interval);
                  if (!isAroundPosition(video, seekPosition)) {
                    video.seek(seekPosition);
                    // console.log('video.seek');
                  }
                }
              }, 500);

            } catch (e) {
              // console.log('video.seek failed');
              finished.seek = true;
              finishTest();
              return;
            }

            setTimeout(function() {
              clearInterval(interval);

              if (!finished.seek) {
                finishTest();
              }
            }, timeouts.seek);
          }

        };

        var previousPlayState = video.playState;
        video.onPlayStateChange = function() {
          // Some devices send a playStateChange even if the playState didn't change
          if (video._previous_playState === video.playState) {
            return;
          }
          previousPlayState = video.playState;

          // console.log('video ' + PLAYSTATES[video.playState] + (video.playState < 3 ? ' (' + video.playPosition + 'ms)' : ''));

          if (!finished.play && PLAYSTATES[video.playState] === 'playing') {
            passed.play = true;
            finished.play = true;

            setTimeout(function() {
              tests.pause();
            }, 500);
          }

          else if (finished.play && !finished.pause && PLAYSTATES[video.playState] === 'paused') {
            passed.pause = true;
            finished.pause = true;

            setTimeout(tests.seek, 0);
          }

          else if (finished.play && finished.pause && !testingSeek) {
            if (video.playState && (PLAYSTATES[video.playState] === 'paused' || PLAYSTATES[video.playState] === 'connecting' || PLAYSTATES[video.playState] === 'buffering')) {
              return;
            }

            testingSeek = true;
            testSeekPosition(video);
          }
        };

        // console.log('start tests');
        tests.play();

        function finishTest() {
          destroyVideo(videoId, !existingVideoParams, function() {
            // console.log('destroyed video');

            createVideo(existingVideoParams, function() {

              // console.log('finished tests');
              addTest('hbbtvvideo', passed.play ? passed : false);
            });
          });
        }

        /**
         * Checks if video is around required position
         *
         * @param {HTMLObjectElement} video    - OIPF video object
         * @param {number}            position - in milliseconds
         */
        function isAroundPosition(video, position) {
          var currentPosition = isNaN(video.playPosition) ? -1 : Math.floor(video.playPosition);
          return currentPosition >= 0 && currentPosition >= (position - 2000) && currentPosition <= (position + 10000);
        }

        var testingSeek = false;
        function testSeekPosition(video) {
          var intervalCounter = 0;
          var interval = setInterval(function() {
            // console.log('video ' + PLAYSTATES[video.playState] + (video.playState < 3 ? ' (' + video.playPosition + 'ms)' : ''));

            if (PLAYSTATES[video.playState] === 'playing' && isAroundPosition(video, seekPosition)) {
              passed.seek = true;
            } else if (++intervalCounter < 10) {
              return;
            }

            finished.seek = true;
            clearInterval(interval);
            finishTest();
          }, 200);
        }

      });
    }, 0);
  }

  /* Helper functions */

  function createTestVideo(callback) {
    var video = getVideoObject();
    var existingVideoParams;

    var params = {
      id: video && video.id || 'modernizer-hbbtvvideo-' + (new Date()).getTime(),
      attributes: {
        type: 'video/mp4'
      }
    };

    try {
      if (video) {
        existingVideoParams = getElementParams(video);
        // console.log('existing video: ' + JSON.stringify(existingVideoParams));

        params.fullScreen = existingVideoParams.fullScreen;
        params.className = existingVideoParams.className;
        params.attributes.style = existingVideoParams.attributes.style;
        params.parentElement = existingVideoParams.parentElement;

      } else {
        var parentElement = createElement('div');
        parentElement.id = 'modernizer-hbbtvvideo-container-' + (new Date()).getTime();
        parentElement.style.cssText = 'position:fixed;top:0;left:0;height:1px;width:1px;';
        getBody().appendChild(parentElement);

        params.parentElement = getElementParams(parentElement);
        params.fullScreen = false;
        params.attributes.style = 'position:absolute;top:0;left:0;height:100%;width:100%';
      }
      params.attributes.data = testData;

    } catch (e) {
      callback();
      return;
    }

    destroyVideo(video, false, function() {
      video = null;
      createVideo(params, function(video) {
        callback(video, existingVideoParams);
      });
    });
  }

  function getVideoObject() {
    var videos = [];

    // As HbbTV only supports one video object, search first if a video object already exists
    var objects = document.getElementsByTagName('object');
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      var type = obj.getAttribute('type');
      if (['video/broadcast', 'video/mp4', 'video/mpeg'].indexOf(type) !== -1) {
        videos.push(obj);
      }
    }

    if (videos.length > 1) {
      // console.log('!! found several video objects');
    }

    return videos[0];
  }

  function createVideo(params, callback) {
    if (!params) {
      callback();
      return;
    }

    // console.log('createVideo: ' + JSON.stringify(params));

    var attributes = ['id="' + params.id + '"'];
    if (params.className) {
      attributes.push('class="' + params.className + '"');
    }
    for (var key in params.attributes) {
      if (params.attributes[key] && params.attributes.hasOwnProperty(key)) {
        attributes.push(key + '="' + params.attributes[key] + '"');
      }
    }
    var html = '<object ' + attributes.join(' ') + '></object>';
    getElementByParams(params.parentElement).innerHTML = html;

    // console.log('video object added to DOM');

    setTimeout(function() {
      var video = document.getElementById(params.id);

      if (!video || (params.attributes.data && (video.getAttribute('data') || video.getAttribute('firetv-data')) !== params.attributes.data) ||
        !video.getAttribute('type').match(params.attributes.type) || !video.parentElement
      ) {
        // console.log('video creation failed');
        callback();
        return;
      }

      if (typeof video.setFullScreen === 'function') {
        try {
          video.setFullScreen(!!params.fullScreen);
          // console.log('video.setFullScreen');
        } catch (e) {
          // ignore
        }
      }

      try {
        if (params.onPlayStateChange) {
          video.onPlayStateChange = params.onPlayStateChange;
          // console.log('video.onPlayStateChange');
        }
      } catch (e) {
        // some versions of Samsung 2012 TVs threw an error while setting the function
        callback();
        return;
      }

      if (video.getAttribute('type') === 'video/broadcast') {
        try {
          video.bindToCurrentChannel();
          // console.log('video.bindToCurrentChannel');
        } catch (e) {
          // ignore
        }
      }

      // many devices need at least to wait for the next tick and 2011 Samsung devices otherwise sometimes throw an error
      setTimeout(function() {
        // console.log('video object available in DOM');
        callback(video);
      }, 300);
    }, 1000);
  }

  function destroyVideo(elem, removeParent, callback) {
    if (typeof elem === 'string') {
      try {
        elem = document.getElementById(elem);
      } catch (e) {}
    }
    if (!elem) {
      callback();
      return;
    }

    var elemParams = getElementParams(elem);
    var parentElement = elem.parentElement;

    // console.log('destroyVideo: ' + (elem.id || elem.tagName) + ' ' + elem.type);

    try {
      // console.log('destroy: stop');
      getElementByParams(elemParams).stop();
    } catch (e) {
      // ignore
    }

    try {
      // console.log('destroy: setFullScreen');
      getElementByParams(elemParams).setFullScreen(false);
    } catch (e) {
      // ignore
    }

    try {
      // console.log('destroy: release');
      getElementByParams(elemParams).release();
    } catch (e) {
      // ignore
    }

    try {
      // console.log('destroy: onPlayStateChange');
      if (getElementByParams(elemParams).onPlayStateChange) {
        getElementByParams(elemParams).onPlayStateChange = undefined;
      }
    } catch (e) {
      // ignore
    }

    try {
      // console.log('destroy: remove');
      parentElement.removeChild(getElementByParams(elemParams));
    } catch (e) {
      // ignore
    }

    if (removeParent) {
      try {
        // console.log('destroy: parentElement remove');
        parentElement.parentElement.removeChild(parentElement);
      } catch (e) {
        // ignore
      }
    }

    // only after next tick the video object is really removed from DOM
    setTimeout(callback, 500);
  }

  function getElementByParams(params) {
    if (params.id) {
      return document.getElementById(params.id);
    } else {
      return document.getElementsByTagName(params.tagName)[0];
    }
  }

  function getElementParams(elem) {
    if (!elem) {
      return;
    }

    try {
      var params = {
        id: elem.id,
        tagName: elem.tagName.toLowerCase(),
        className: elem.className || undefined,
        attributes: {
          type: elem.getAttribute('type') || undefined,
          data: elem.getAttribute('data') || undefined,
          style: elem.getAttribute('style') || undefined
        },
        fullScreen: elem.fullScreen || undefined,
        onPlayStateChange: elem.onPlayStateChange || undefined,
        parentElement: {
          id: elem.parentElement.id || undefined,
          tagName: elem.parentElement.tagName.toLowerCase()
        }
      };
      return params;
    } catch (e) {
      // ignore
    }
  }

  /*function initApp() {
    try {
      var app = document.getElementById('appmgr').getOwnerApplication(document);
      app.show();
      app.activate(); // this is for HbbTV 0.5 backwards-compliance. It will throw an ignored exception on HbbTV 1.x devices, which is fine
    } catch (e) {
      // ignore
    }
  }*/

});
