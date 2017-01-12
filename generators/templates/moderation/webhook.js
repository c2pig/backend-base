'use strict';

const getParams = query => {
  if (!query) {
    return { };
  }
  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce((params, param) => {
      let [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, { });
};

exports.handler = (event, context) => {
    const AWS = require('aws-sdk');
    const done = (err, res) => {
      console.log(err);
      console.log(res);
    };
    console.log('From Crowdflower:', message);
}
