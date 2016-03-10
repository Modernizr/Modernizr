/*jshint asi:true*/
/*global describe, before, beforeEach, it */
"use strict";

var assert = require('assert')
  , proxyquire = require('..')
  , stats = require('./samples/stats')
  ;

describe('Given foo requires the bar and path modules and bar.bar() returns "bar"', function () {
  var file = '/folder/test.ext'
    , foo
    , foober
    , barber = { bar:function () { return 'barber'; } }
    ;

  describe('When I resolve foo with no overrides to bar as foo and resolve foo with barber stub as foober.', function () {
    before(function () {
      stats.reset();
      foo = proxyquire('./samples/foo', { './bar':{ /* no overrides */ } });
      foober = proxyquire('./samples/foo', { './bar':barber });
    })

    it('foo is required 2 times', function () {
      assert.equal(stats.fooRequires(), 2);
    })

    describe('foo\'s bar is unchanged', function () {
      it('foo.bigBar() == "BAR"', function () {
        assert.equal(foo.bigBar(), 'BAR');
      })
    })

    describe('only stubbed modules have overrides in foober', function () {

      it('foober.bigBar() == "BARBER"', function () {
        assert.equal(foober.bigBar(), 'BARBER');
      })

      it('foober.bigExt("/folder/test.ext") == ".EXT"', function () {
        assert.equal(foober.bigExt(file), '.EXT');
      })

      it('foober.bigBas("/folder/test.ext") == "TEST.EXT"', function () {
        assert.equal(foober.bigBas(file), 'TEST.EXT');
      })

    })

    describe('when I override keys of stubs after resolve', function () {

      before(function () {
        barber.bar = function () { return 'friseur'; }
        barber.rab = function () { return 'rabarber'; }
      });

      it('overrides behavior when module is required inside function call', function () {
        assert.equal(foober.bigBar(), 'FRISEUR');
      })

      it('overrides behavior when module is required on top of file', function () {
        assert.equal(foober.bigRab(), 'RABARBER');
      })


      describe('and then delete overrides of stubs after resolve', function () {

        beforeEach(function () {
          delete barber.bar;
          delete barber.rab;
        })

        it('reverts to original behavior when module is required inside function call', function () {
          assert.equal(foober.bigBar(), 'BAR');
        })

        it('doesn\'t properly revert to original behavior when module is required on top of file ', function () {
          assert.throws(foober.bigRab);
        })

      })
    })
  })

  describe('When foo.bigExt() returns capitalized path.extname and foo.bigBas() returns capitalized path.basename', function () {
    describe('and path.extname(file) is stubbed to return "override " + file', function () {

      describe('and callThru was not changed globally or for path module', function () {
        before(function () {
          foo = proxyquire('./samples/foo', {
            path:{
              extname:function (file) { return 'override ' + file; }
            }
          });
        })

        it('foo.bigExt(file) == "OVERRIDE /FOLDER/TEST.EXT"', function () {
          assert.equal(foo.bigExt(file), 'OVERRIDE /FOLDER/TEST.EXT');
        })

        it('foo.bigBas(file) == "TEST.EXT"', function () {
          assert.equal(foo.bigBas(file), 'TEST.EXT');
        })
      })

      describe('and callThru is turned off for path module', function () {
        before(function () {
          foo = proxyquire('./samples/foo', {
            path:{
              extname:function (file) { return 'override ' + file; }, '@noCallThru':true
            }
          });
        })

        it('foo.bigExt(file) == "OVERRIDE /FOLDER/TEST.EXT"', function () {
          assert.equal(foo.bigExt(file), 'OVERRIDE /FOLDER/TEST.EXT');
        })

        it('foo.bigBas(file) throws', function () {
          assert.throws(foo.bigBas);
        })

      })

      describe('and callThru was turned off globally', function () {
        var $proxyquire;
        before(function () {
          $proxyquire = proxyquire.noCallThru();
        })

        describe('and not changed for path module', function () {
          before(function () {
            foo = $proxyquire('./samples/foo', {
              path:{
                extname:function (file) { return 'override ' + file; }
              }
            });
          })

          it('foo.bigExt(file) == "OVERRIDE /FOLDER/TEST.EXT"', function () {
            assert.equal(foo.bigExt(file), 'OVERRIDE /FOLDER/TEST.EXT');
          })

          it('foo.bigBas(file) throws', function () {
            assert.throws(foo.bigBas);
          })
        })

        describe('and turned back on for path module', function () {
          before(function () {
            foo = $proxyquire('./samples/foo', {
              path:{
                extname:function (file) { return 'override ' + file; }, '@noCallThru':false
              }
            });
          })

          it('foo.bigExt(file) == "OVERRIDE /FOLDER/TEST.EXT"', function () {
            assert.equal(foo.bigExt(file), 'OVERRIDE /FOLDER/TEST.EXT');
          })

          it('foo.bigBas(file) == "TEST.EXT"', function () {
            assert.equal(foo.bigBas(file), 'TEST.EXT');
          })
        })

        describe('and turned back on globally', function () {
          before(function () {
            foo = $proxyquire
              .callThru()
              .load('./samples/foo', {
                path:{
                  extname:function (file) { return 'override ' + file; }
                }
              });
          })

          it('foo.bigExt(file) == "OVERRIDE /FOLDER/TEST.EXT"', function () {
            assert.equal(foo.bigExt(file), 'OVERRIDE /FOLDER/TEST.EXT');
          })

          it('foo.bigBas(file) == "TEST.EXT"', function () {
            assert.equal(foo.bigBas(file), 'TEST.EXT');
          })
        })
      })
    })
  })
})



