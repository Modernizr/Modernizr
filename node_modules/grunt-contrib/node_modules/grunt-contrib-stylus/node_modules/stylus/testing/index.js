
/**
 * Module dependencies.
 */

var stylus = require('../')
  , fs = require('fs')
  , path = 'testing/small.styl'
  , str = fs.readFileSync(path, 'utf8');

// setTimeout(function(){
//   console.log('starting');
//   id = setInterval(function(){
//     stylus(str)
//       .set('filename', path)
//       .render(function(err, css){
//         if (err) throw err;
//         //console.log(css);
//       });
//   }, 0);
// }, 5000);
// 
// setTimeout(function(){
//   clearInterval(id)
//   console.log('stopping');
// }, 40000);

var start = new Date;

stylus(str)
  .set('filename', path)
  .set('include css', true)
  .render(function(err, css){
    if (err) throw err;
    console.log(css);
    // console.log('%dms', new Date - start);
  });
