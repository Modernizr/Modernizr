var expect = require('chai').expect;
var util = require('./util');

var compressor = require('../lib/protocol/compressor');
var HeaderTable = compressor.HeaderTable;
var HuffmanTable = compressor.HuffmanTable;
var HeaderSetCompressor = compressor.HeaderSetCompressor;
var HeaderSetDecompressor = compressor.HeaderSetDecompressor;
var Compressor = compressor.Compressor;
var Decompressor = compressor.Decompressor;

var test_integers = [{
  N: 5,
  I: 10,
  buffer: new Buffer([10])
}, {
  N: 0,
  I: 10,
  buffer: new Buffer([10])
}, {
  N: 5,
  I: 1337,
  buffer: new Buffer([31, 128 + 26, 10])
}, {
  N: 0,
  I: 1337,
  buffer: new Buffer([128 + 57, 10])
}];

var test_strings = [{
  string: 'www.foo.com',
  buffer: new Buffer('89f1e3c2f29ceb90f4ff', 'hex')
}, {
  string: 'éáűőúöüó€',
  buffer: new Buffer('13c3a9c3a1c5b1c591c3bac3b6c3bcc3b3e282ac', 'hex')
}];

test_huffman_request = {
  'GET': 'c5837f',
  'http': '9d29af',
  '/': '63',
  'www.foo.com': 'f1e3c2f29ceb90f4ff',
  'https': '9d29ad1f',
  'www.bar.com': 'f1e3c2f18ec5c87a7f',
  'no-cache': 'a8eb10649cbf',
  '/custom-path.css': '6096a127a56ac699d72211',
  'custom-key': '25a849e95ba97d7f',
  'custom-value': '25a849e95bb8e8b4bf'
};

test_huffman_response = {
  '302': '6402',
  'private': 'aec3771a4b',
  'Mon, 21 OCt 2013 20:13:21 GMT': 'd07abe941054d5792a0801654102e059b820a98b46ff',
  ': https://www.bar.com': 'b8a4e94d68b8c31e3c785e31d8b90f4f',
  '200': '1001',
  'Mon, 21 OCt 2013 20:13:22 GMT': 'd07abe941054d5792a0801654102e059b821298b46ff',
  'https://www.bar.com': '9d29ad171863c78f0bc63b1721e9',
  'gzip': '9bd9ab',
  'foo=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAALASDJKHQKBZXOQWEOPIUAXQWEOIUAXLJKHQWOEIUAL\
QWEOIUAXLQEUAXLLKJASDQWEOUIAXN1234LASDJKHQKBZXOQWEOPIUAXQWEOIUAXLJKH\
QWOEIUALQWEOIUAXLQEUAXLLKJASDQWEOUIAXN1234LASDJKHQKBZXOQWEOPIUAXQWEO\
IUAXLJKHQWOEIUALQWEOIUAXLQEUAXLLKJASDQWEOUIAXN1234LASDJKHQKBZXOQWEOP\
IUAXQWEOIUAXLJKHQWOEIUALQWEOIUAXLQEUAXLLKJASDQWEOUIAXN1234ZZZZZZZZZZ\
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ1234 m\
ax-age=3600; version=1': '94e7821861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861873c3bafe5cd8f666bbfbf9ab672c1ab5e4e10fe6ce583564e10fe67cb9b1ece5ab064e10e7d9cb06ac9c21fccfb307087f33e7cd961dd7f672c1ab86487f34844cb59e1dd7f2e6c7b335dfdfcd5b3960d5af27087f3672c1ab27087f33e5cd8f672d583270873ece583564e10fe67d983843f99f3e6cb0eebfb3960d5c3243f9a42265acf0eebf97363d99aefefe6ad9cb06ad793843f9b3960d593843f99f2e6c7b396ac1938439f672c1ab27087f33ecc1c21fccf9f3658775fd9cb06ae1921fcd21132d678775fcb9b1eccd77f7f356ce58356bc9c21fcd9cb06ac9c21fccf97363d9cb560c9c21cfb3960d593843f99f660e10fe67cf9b2c3bafece583570c90fe6908996bf7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f42265a5291f9587316065c003ed4ee5b1063d5007f',
  'foo=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ\
ZZZZZZZZZZZZZZZZZZZZZZZZZZLASDJKHQKBZXOQWEOPIUAXQWEOIUAXLJKHQWOEIUAL\
QWEOIUAXLQEUAXLLKJASDQWEOUIAXN1234LASDJKHQKBZXOQWEOPIUAXQWEOIUAXLJKH\
QWOEIUALQWEOIUAXLQEUAXLLKJASDQWEOUIAXN1234LASDJKHQKBZXOQWEOPIUAXQWEO\
IUAXLJKHQWOEIUALQWEOIUAXLQEUAXLLKJASDQWEOUIAXN1234LASDJKHQKBZXOQWEOP\
IUAXQWEOIUAXLJKHQWOEIUALQWEOIUAXLQEUAXLLKJASDQWEOUIAXN1234AAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1234 m\
ax-age=3600; version=1': '94e783f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f73c3bafe5cd8f666bbfbf9ab672c1ab5e4e10fe6ce583564e10fe67cb9b1ece5ab064e10e7d9cb06ac9c21fccfb307087f33e7cd961dd7f672c1ab86487f34844cb59e1dd7f2e6c7b335dfdfcd5b3960d5af27087f3672c1ab27087f33e5cd8f672d583270873ece583564e10fe67d983843f99f3e6cb0eebfb3960d5c3243f9a42265acf0eebf97363d99aefefe6ad9cb06ad793843f9b3960d593843f99f2e6c7b396ac1938439f672c1ab27087f33ecc1c21fccf9f3658775fd9cb06ae1921fcd21132d678775fcb9b1eccd77f7f356ce58356bc9c21fcd9cb06ac9c21fccf97363d9cb560c9c21cfb3960d593843f99f660e10fe67cf9b2c3bafece583570c90fe6908996a1861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861861842265a5291f9587316065c003ed4ee5b1063d5007f'
};

var test_headers = [{
  // index
  header: {
    name: 1,
    value: 1,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('82', 'hex')
}, {
  // index
  header: {
    name: 5,
    value: 5,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('86', 'hex')
}, {
  // index
  header: {
    name: 3,
    value: 3,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('84', 'hex')
}, {
  // literal w/index, name index
  header: {
    name: 0,
    value: 'www.foo.com',
    index: true,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('41' + '89f1e3c2f29ceb90f4ff', 'hex')
}, {
  // indexed
  header: {
    name: 1,
    value: 1,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('82', 'hex')
}, {
  // indexed
  header: {
    name: 6,
    value: 6,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('87', 'hex')
}, {
  // indexed
  header: {
    name: 3,
    value: 3,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('84', 'hex')
}, {
  // literal w/index, name index
  header: {
    name: 0,
    value: 'www.bar.com',
    index: true,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('41' + '89f1e3c2f18ec5c87a7f', 'hex')
}, {
  // literal w/index, name index
  header: {
    name: 23,
    value: 'no-cache',
    index: true,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('58' + '86a8eb10649cbf', 'hex')
}, {
  // index
  header: {
    name: 1,
    value: 1,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('82', 'hex')
}, {
  // index
  header: {
    name: 6,
    value: 6,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('87', 'hex')
}, {
  // literal w/index, name index
  header: {
    name: 3,
    value: '/custom-path.css',
    index: true,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('44' + '8b6096a127a56ac699d72211', 'hex')
}, {
  // index
  header: {
    name: 63,
    value: 63,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('C0', 'hex')
}, {
  // literal w/index, new name & value
  header: {
    name: 'custom-key',
    value: 'custom-value',
    index: true,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('40' + '8825a849e95ba97d7f' + '8925a849e95bb8e8b4bf', 'hex')
}, {
  // index
  header: {
    name: 1,
    value: 1,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('82', 'hex')
}, {
  // index
  header: {
    name: 6,
    value: 6,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('87', 'hex')
}, {
  // index
  header: {
    name: 62,
    value: 62,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('BF', 'hex')
}, {
  // index
  header: {
    name: 65,
    value: 65,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('C2', 'hex')
}, {
  // index
  header: {
    name: 64,
    value: 64,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('C1', 'hex')
}, {
  // index
  header: {
    name: 61,
    value: 61,
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('BE', 'hex')
}, {
  // Literal w/o index, name index
  header: {
    name: 6,
    value: "whatever",
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('07' + '86f138d25ee5b3', 'hex')
}, {
  // Literal w/o index, new name & value
  header: {
    name: "foo",
    value: "bar",
    index: false,
    mustNeverIndex: false,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('00' + '8294e7' + '03626172', 'hex')
}, {
  // Literal never indexed, name index
  header: {
    name: 6,
    value: "whatever",
    index: false,
    mustNeverIndex: true,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('17' + '86f138d25ee5b3', 'hex')
}, {
  // Literal never indexed, new name & value
  header: {
    name: "foo",
    value: "bar",
    index: false,
    mustNeverIndex: true,
    contextUpdate: false,
    newMaxSize: 0
  },
  buffer: new Buffer('10' + '8294e7' + '03626172', 'hex')
}, {
  header: {
    name: -1,
    value: -1,
    index: false,
    mustNeverIndex: false,
    contextUpdate: true,
    newMaxSize: 100
  },
  buffer: new Buffer('3F45', 'hex')
}];

var test_header_sets = [{
  headers: {
    ':method': 'GET',
    ':scheme': 'http',
    ':path': '/',
    ':authority': 'www.foo.com'
  },
  buffer: util.concat(test_headers.slice(0, 4).map(function(test) { return test.buffer; }))
}, {
  headers: {
    ':method': 'GET',
    ':scheme': 'https',
    ':path': '/',
    ':authority': 'www.bar.com',
    'cache-control': 'no-cache'
  },
  buffer: util.concat(test_headers.slice(4, 9).map(function(test) { return test.buffer; }))
}, {
  headers: {
    ':method': 'GET',
    ':scheme': 'https',
    ':path': '/custom-path.css',
    ':authority': 'www.bar.com',
    'custom-key': 'custom-value'
  },
  buffer: util.concat(test_headers.slice(9, 14).map(function(test) { return test.buffer; }))
}, {
  headers: {
    ':method': 'GET',
    ':scheme': 'https',
    ':path': '/custom-path.css',
    ':authority': ['www.foo.com', 'www.bar.com'],
    'custom-key': 'custom-value'
  },
  buffer: util.concat(test_headers.slice(14, 19).map(function(test) { return test.buffer; }))
}];

describe('compressor.js', function() {
  describe('HeaderTable', function() {
  });

  describe('HuffmanTable', function() {
    describe('method encode(buffer)', function() {
      it('should return the Huffman encoded version of the input buffer', function() {
        var table = HuffmanTable.huffmanTable;
        for (var decoded in test_huffman_request) {
          var encoded = test_huffman_request[decoded];
          expect(table.encode(new Buffer(decoded)).toString('hex')).to.equal(encoded);
        }
        table = HuffmanTable.huffmanTable;
        for (decoded in test_huffman_response) {
          encoded = test_huffman_response[decoded];
          expect(table.encode(new Buffer(decoded)).toString('hex')).to.equal(encoded);
        }
      });
    });
    describe('method decode(buffer)', function() {
      it('should return the Huffman decoded version of the input buffer', function() {
        var table = HuffmanTable.huffmanTable;
        for (var decoded in test_huffman_request) {
          var encoded = test_huffman_request[decoded];
          expect(table.decode(new Buffer(encoded, 'hex')).toString()).to.equal(decoded);
        }
        table = HuffmanTable.huffmanTable;
        for (decoded in test_huffman_response) {
          encoded = test_huffman_response[decoded];
          expect(table.decode(new Buffer(encoded, 'hex')).toString()).to.equal(decoded);
        }
      });
    });
  });

  describe('HeaderSetCompressor', function() {
    describe('static method .integer(I, N)', function() {
      it('should return an array of buffers that represent the N-prefix coded form of the integer I', function() {
        for (var i = 0; i < test_integers.length; i++) {
          var test = test_integers[i];
          test.buffer.cursor = 0;
          expect(util.concat(HeaderSetCompressor.integer(test.I, test.N))).to.deep.equal(test.buffer);
        }
      });
    });
    describe('static method .string(string)', function() {
      it('should return an array of buffers that represent the encoded form of the string', function() {
        var table = HuffmanTable.huffmanTable;
        for (var i = 0; i < test_strings.length; i++) {
          var test = test_strings[i];
          expect(util.concat(HeaderSetCompressor.string(test.string, table))).to.deep.equal(test.buffer);
        }
      });
    });
    describe('static method .header({ name, value, index })', function() {
      it('should return an array of buffers that represent the encoded form of the header', function() {
        var table = HuffmanTable.huffmanTable;
        for (var i = 0; i < test_headers.length; i++) {
          var test = test_headers[i];
          expect(util.concat(HeaderSetCompressor.header(test.header, table))).to.deep.equal(test.buffer);
        }
      });
    });
  });

  describe('HeaderSetDecompressor', function() {
    describe('static method .integer(buffer, N)', function() {
      it('should return the parsed N-prefix coded number and increase the cursor property of buffer', function() {
        for (var i = 0; i < test_integers.length; i++) {
          var test = test_integers[i];
          test.buffer.cursor = 0;
          expect(HeaderSetDecompressor.integer(test.buffer, test.N)).to.equal(test.I);
          expect(test.buffer.cursor).to.equal(test.buffer.length);
        }
      });
    });
    describe('static method .string(buffer)', function() {
      it('should return the parsed string and increase the cursor property of buffer', function() {
        var table = HuffmanTable.huffmanTable;
        for (var i = 0; i < test_strings.length; i++) {
          var test = test_strings[i];
          test.buffer.cursor = 0;
          expect(HeaderSetDecompressor.string(test.buffer, table)).to.equal(test.string);
          expect(test.buffer.cursor).to.equal(test.buffer.length);
        }
      });
    });
    describe('static method .header(buffer)', function() {
      it('should return the parsed header and increase the cursor property of buffer', function() {
        var table = HuffmanTable.huffmanTable;
        for (var i = 0; i < test_headers.length; i++) {
          var test = test_headers[i];
          test.buffer.cursor = 0;
          expect(HeaderSetDecompressor.header(test.buffer, table)).to.deep.equal(test.header);
          expect(test.buffer.cursor).to.equal(test.buffer.length);
        }
      });
    });
  });
  describe('Decompressor', function() {
    describe('method decompress(buffer)', function() {
      it('should return the parsed header set in { name1: value1, name2: [value2, value3], ... } format', function() {
        var decompressor = new Decompressor(util.log, 'REQUEST');
        for (var i = 0; i < test_header_sets.length - 1; i++) {
          var header_set = test_header_sets[i];
          expect(decompressor.decompress(header_set.buffer)).to.deep.equal(header_set.headers);
        }
      });
    });
    describe('transform stream', function() {
      it('should emit an error event if a series of header frames is interleaved with other frames', function() {
        var decompressor = new Decompressor(util.log, 'REQUEST');
        var error_occured = false;
        decompressor.on('error', function() {
          error_occured = true;
        });
        decompressor.write({
          type: 'HEADERS',
          flags: {
            END_HEADERS: false
          },
          data: new Buffer(5)
        });
        decompressor.write({
          type: 'DATA',
          flags: {},
          data: new Buffer(5)
        });
        expect(error_occured).to.be.equal(true);
      });
    });
  });

  describe('invariant', function() {
    describe('decompressor.decompress(compressor.compress(headerset)) === headerset', function() {
      it('should be true for any header set if the states are synchronized', function() {
        var compressor = new Compressor(util.log, 'REQUEST');
        var decompressor = new Decompressor(util.log, 'REQUEST');
        var n = test_header_sets.length;
        for (var i = 0; i < 10; i++) {
          var headers = test_header_sets[i%n].headers;
          var compressed = compressor.compress(headers);
          var decompressed = decompressor.decompress(compressed);
          expect(decompressed).to.deep.equal(headers);
          expect(compressor._table).to.deep.equal(decompressor._table);
        }
      });
    });
    describe('source.pipe(compressor).pipe(decompressor).pipe(destination)', function() {
      it('should behave like source.pipe(destination) for a stream of frames', function(done) {
        var compressor = new Compressor(util.log, 'RESPONSE');
        var decompressor = new Decompressor(util.log, 'RESPONSE');
        var n = test_header_sets.length;
        compressor.pipe(decompressor);
        for (var i = 0; i < 10; i++) {
          compressor.write({
            type: i%2 ? 'HEADERS' : 'PUSH_PROMISE',
            flags: {},
            headers: test_header_sets[i%n].headers
          });
        }
        setTimeout(function() {
          for (var j = 0; j < 10; j++) {
            expect(decompressor.read().headers).to.deep.equal(test_header_sets[j%n].headers);
          }
          done();
        }, 10);
      });
    });
    describe('huffmanTable.decompress(huffmanTable.compress(buffer)) === buffer', function() {
      it('should be true for any buffer', function() {
        for (var i = 0; i < 10; i++) {
          var buffer = [];
          while (Math.random() > 0.1) {
            buffer.push(Math.floor(Math.random() * 256))
          }
          buffer = new Buffer(buffer);
          var table = HuffmanTable.huffmanTable;
          var result = table.decode(table.encode(buffer));
          expect(result).to.deep.equal(buffer);
        }
      });
    });
  });
});
