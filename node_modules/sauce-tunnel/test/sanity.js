var SauceTunnel = require('../index');

var tunnel = new SauceTunnel(process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESSKEY);
if (!tunnel.identifier) {
  console.error('`tunnel.identifier` should be set to a random variable when not specified in the constructor');
  process.exit(1);
}
if (tunnel.tunneled !== true) {
  console.error('`tunnel.tunneled` should be set to `true` when not specified in the constructor');
  process.exit(1);
}

tunnel = new SauceTunnel(process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESSKEY, null, true, ['--verbose']);
tunnel.on('verbose:ok', function () {
  console.log.apply(console, arguments);
});
tunnel.on('verbose:debug', function () {
  console.log.apply(console, arguments);
});
tunnel.on('log:error', function () {
  console.error.apply(console, arguments);
});
tunnel.start(function(status){
  if (status === false){
    console.error('Something went wrong with the tunnel');
    process.exit(1);
  }
  tunnel.stop(function(err){
    if(err){
      console.error(err);
      process.exit(1);
    }
    console.log('Tunnel destroyed');
    process.exit(0);
  });
});
