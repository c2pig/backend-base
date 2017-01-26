'use strict';

let validation = require('review-service-baseline').pipe;
let resource;
module.exports.handler = validation
  .init(function(rs, next) {
      resource = new rs();
      next({data:'dummy text'});
  }).input(function(event, next, params) {

    let config = process.env.EXAMLE_CONFIG || 'no config defined in env';
    let data = { 0: true, 1: false };
    let ret = data[Math.floor(Math.random() * 2)];
    if(ret) {
      next('when-no-profanity',{data:{status:'OK', text:'No profanity found', config:config, text2:params.data}});
    } else {
      next('when-profanity-found',{data:{status:'NOK', text:'Profanity found', config:config, text2:params.data}});
    }
  }).output('when-profanity-found',function(params, resp) {

      resp.callback(null, { statusCode:'400', body: JSON.stringify(params.data),
      headers: { 'Content-Type': 'application/json' } });

  }).output('when-no-profanity',function(params, resp) {

      resp.callback(null, { statusCode:'200', body: JSON.stringify(params.data),
      headers: { 'Content-Type': 'application/json' } });

  }).done();
