'use strict';
class Queue {
  constructor(sns) {
    this.sns = sns;
  }
  put(msg, topic, callback) {
    this.sns.publish({ Message: msg, TopicArn: topic }, callback);
  }
}
module.exports = Queue;
