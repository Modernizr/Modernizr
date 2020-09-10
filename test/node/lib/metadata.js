var root = require('find-parent-dir').sync(__dirname, 'package.json');
var proxyquire = require('proxyquire').noPreserveCache();
var metadata = require(root + 'lib/metadata').default;
var chai = require('chai');
var expect = chai.expect;
var Joi = require('@hapi/joi');

describe('cli/metadata', function() {

  it('should not throw when metadata is missing', function() {

    var metadata = proxyquire(root + 'lib/metadata', {
      'fs': {
        'readFileSync': function() {
          return 'sup dude';
        }
      }
    }).default;

    expect(metadata).to.not.throw(/Error Parsing Metadata/);
  });

  it('should throw when metadata is invalid JSON', function() {

    var metadata = proxyquire(root + 'lib/metadata', {
      'fs': {
        'readFileSync': function() {
          return '/*!{!*/';
        }
      }
    }).default;

    expect(metadata).to.throw();
  });

  it('should throw when metadata contains polyfills not found in polyfills.json', function() {

    var metadata = proxyquire(root + 'lib/metadata', {
      'fs': {
        'readFileSync': function() {
          return '/*! { "name": "fake", "property": "fake", "polyfills": ["fake"]}!*/ define([],';
        }
      }
    }).default;

    expect(metadata).to.throw(/Polyfill not found/);
  });

  it('should throw if no name is defined', function() {

    var metadata = proxyquire(root + 'lib/metadata', {
      'fs': {
        'readFileSync': function() {
          return '/*! { "property": "fake"}!*/ define([],';
        }
      }
    }).default;

    expect(metadata).to.throw(/Minimal metadata not found/);
  });

  it('should throw if no property is defined', function() {

    var metadata = proxyquire(root + 'lib/metadata', {
      'fs': {
        'readFileSync': function() {
          return '/*! { "name": "fake"}!*/ define([],';
        }
      }
    }).default;

    expect(metadata).to.throw(/Minimal metadata not found/);
  });

  it('should throw if property contains uppercase characters and/or special symbols except dashes', function() {

    var metadata = proxyquire(root + 'lib/metadata', {
      'fs': {
        'readFileSync': function() {
          return '/*! { "name": "fake", "property": "U_pper-case123"}!*/ define([],';
        }
      }
    }).default;
    
    expect(metadata).to.throw(/Property can only have lowercase alphanumeric characters and dashes/);
  });

  it('returns a json blob when invoked without callback', function() {
    expect(metadata()).to.be.an('array');
  });

  it('return nothing when given a callback', function() {
    expect(metadata(function noop() {})).to.be.equal(undefined);
  });

  it('pass the json blob when given a callback', function(done) {
    metadata(function(data) {
      expect(data).to.be.an('array');
      done();
    });
  });

  describe('returns an array of valid objects', function() {
    var schema = Joi.object().keys({
      amdPath: Joi.string().required(),
      name: Joi.string().required(),
      doc: Joi.alternatives().try(Joi.string(), null),

      caniuse: Joi.alternatives().try(Joi.string(), null),

      async: Joi.boolean(),

      aliases: Joi.array().items(Joi.string()),
      builderAliases: Joi.array().items(Joi.string()),
      knownBugs: Joi.array().items(Joi.string()),
      warnings: Joi.array().items(Joi.string()),
      authors: Joi.array().items(Joi.string()),
      tags: Joi.array().items(Joi.string()),
      deps: Joi.array().items(Joi.string()),

      notes: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          href: Joi.string().required()
        })
      ).unique(),

      cssclass: Joi.alternatives().try(
        Joi.string().lowercase(),
        Joi.array().items(Joi.string().lowercase())
      ).required(),

      property: Joi.alternatives().try(
        Joi.string().lowercase(),
        Joi.array().items(Joi.string().lowercase())
      ).required(),

      polyfills: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          authors: Joi.array().items(Joi.string()),
          notes: Joi.array().items(Joi.string()),
          href: Joi.string().required(),
          licenses: Joi.array().items(Joi.string()).required()
        })
      ).unique()
    });

    metadata(function(data) {
      data.forEach(function(obj) {
        var err = schema.validate(obj, {convert: false}).error;
        it('for ' + obj.name, function() {
          expect(`${obj.name} - ${err}`).to.be.equal(`${obj.name} - ${undefined}`);
        });
      });
    });
  });
});
