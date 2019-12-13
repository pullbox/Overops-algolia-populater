const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

module.exports = {
	
  /* 
   * Mongo Utility: Connect to client */




  connect: async () => (

    client = await (() => (new Promise((resolve, reject) => (

      MongoClient.connect('mongodb://localhost:27017/algolia', {
      //  replicaSet: 'repl-set-name'
      useNewUrlParser: true
      },
      (err, client) => {
        if (err) {
          console.log(err);
          throw err;
        }
        resolve(client);
      })
    )
  )))()),

  
  /* 
   * Mongo Utility: Close client */

  close: async (client) => {
    client.close();
    return true;
  }
};