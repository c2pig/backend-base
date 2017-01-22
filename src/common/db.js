'use strict';
class DB {
  constructor(db) {
    this.db = db;
  }
  insert(key, msg, table, callback) {
    const timestamp = new Date().getTime();
    const params = {
        TableName: table,
        Item: {
          id: key,
          text: msg,
          checked: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };
    this.db.putItem(params, callback);
  }

}
module.exports = DB;
