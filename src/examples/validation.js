'use strict';
let validation = require('review-service-baseline').validation;

const headers = { headers: { 'Content-Type': 'application/json' } };
let resource;
exports.handler = validation
  .init(function(rs, next) {
      this.resource = rs;
      const configpath = require('path').join(__dirname, 'webpurify.config.json');
      const config = JSON.parse(require('fs').readFileSync(configpath, 'utf8'));
      const WebPurify = require('webpurify');
      const wp = new WebPurify(config.key);
      const validator = new Validator({"client":wp, "config":config}, require('./schema_validation'));      
      next({

      });
  })
  .input(function(data, next, params) {
      params.validator.validate(event);
      let payload = JSON.parse(event.body).payload;
      let pfields = config.verifyFields.filter((field) => {
        return payload[field];
      });

      if(pfields.length) {
        let err, resp = {status: 'OK'}, msg = {payload:payload}
        params.validator.purify(pfields.map((f) => payload[f]).join())
        .fetch((profanity) => {
          if(profanity.length !==0) {
            next('when-profanity-found', {
              err: {reason:'Profanity'}, resp: {status:'NOK', profanity: profanity}
            });
          } else {
            next('when-no-profanity', { err: null, resp:{status: 'OK'}});
          }
        });
      }, (err) => { throw err; });
    }
  }).output('when-no-profanity',function(params, cb) {
    notifier.notify(JSON.stringify(msg), process.env.SNS_TOPIC, (err, data) => {
        console.log('sns callback');
        console.log(err);
        console.log(data);
    });
    callback(null, { statusCode:'200', body: '{}', headers });
  }).output('when-profanity-found',function(params, cb) {
    callback(null, { statusCode:'400', body: JSON.stringify(params.resp), headers });
  }).error(function(e) {
    console.log('err from project : ' + e );
  }).done();
