'use strict';
module.exports = {
  validation: require('./src/common/app'),
  ingest: require('./src/common/app'),
  moderation: require('./src/common/app'),
  view: require('./src/common/app'),
  pipe: require('./src/common/app')
};
