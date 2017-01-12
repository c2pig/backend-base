'use strict';

module.exports.ConnectionHelper = class ConnectionHelper {

  constructor(conn, profile) {
    this.host = conn.host;
    this.port = conn.port;
    this.job_id = profile.job_id;
    this.key = profile.key;
  }
  createConnection() {
    let options = {
      host:"api.crowdflower.com",
      port:80,
      path: `/v1/jobs/${this.job_id}/units.json?key=${this.key}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    /* probably need fully abstract http/s footprint */
    return require('http').request(options);
  }
}

class Moderation {

    constructor(conn) {
      this.req = conn.createConnection();
    }

    moderate(review) {
      const formurlencoded = require('form-urlencoded');
      return new Promise((resolve, reject) => {
        this.req.end(formurlencoded(review), 'utf8');
        this.req.on('response', (resp) => {
          resp.setEncoding('utf8');
          resp.on('data', (data) => {
            resolve({
              statusCode: resp.statusCode,
              statusMessage: resp.statusMessage,
              data: data
            });
          });
        });
        this.req.on('error', (e) => {
          reject(new Error(e));
        });
      });
    }
}

module.exports.Moderation = Moderation;

exports.handler = (event, context) => {
    const AWS = require('aws-sdk');
    const done = (err, res) => {
      console.log(err);
      console.log(res);
    };
    // const message = JSON.parse(event.Records[0].Sns.Message);
    // console.log('From SNS:', message);
    let mod = new Moderation({ host:"api.crowdflower.com", port:443}, "vyMyzfr9feYxkMJeciqh");
      mod.moderate("123",{});
}
