let validation = require('./index').handler;

validation
.init(function(rs, next) {
  console.log('*init from cpp*');
  next('base-input-2', {});

}).input(function(data, next, params) {
  console.log('*default input from cpp*');

}).input('cpp-input', function(data, next, params) {
    console.log('*input from cpp*');
    next('cpp-output',{});
}).output('cpp-output', function(params, outputHandler) {
  console.log('*output from cpp*');

}).output(function(params, outputHandler) {
  console.log('*default output from cpp*');

}).done();
