const AWS = require('aws-sdk');
const Queue = require('./queue');
const DB = require('./db');
const File = require('./file');
module.exports = function() {
  'use strict';
  return {
    queue: new Queue(new AWS.SNS()),
    db: new DB(new AWS.DynamoDB.DocumentClient()),
    file: new File(new AWS.S3()),
    stats: {}
  };
}
