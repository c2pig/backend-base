let validation = require('../common/app');

exports.handler = validation.input('base-input', function(data, next, params) {
    console.log('*input from base*');
    var three = "3", four = "4";
    next('base-output', {'three': three, "four": four});
}).input('base-input-2',function(data, next, params) {
    console.log('input from project - default');
    var three = "3", four = "4";
    setTimeout(() => {
    //next('when-not-found', {'three': three, "four": four});
      next({'three': three, "four": four});
  }, 2500);
}).output('base-output', function(params, outputHandler) {
    console.log('*output from base*');
    console.log('params:' + params);
    console.log('handler:' + outputHandler);
    outputHandler({}, {});
}).output('base-when-error', function(params) {
    console.log('output from project - when-not-found');
  //  console.log(params);
  })
