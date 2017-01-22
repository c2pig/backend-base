const AWS = require('aws-sdk');
const Queue = require('./queue');
const DB = require('./db');
const File = require('./file');
const doc = require('dynamodb-doc');

module.exports = function() {
  'use strict';
  return {
    queue: new Queue(new AWS.SNS()),
    db: new DB(new doc.DynamoDB()),
    file: new File(new AWS.S3()),
    stats: {}
  };
}
