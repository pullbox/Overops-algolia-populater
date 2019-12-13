

const mongo = require('../db/mongodb');
const prmCategories = require('../promises/prmCategories');

//Path to Mongo install
// /Users/danielbechtel/Documents/Development-tools/MongoDB/mongodb-osx-x86_64-4.0.1/bin
//     ulimit -n 1024
// mongod

dropCategories();

async function dropCategories() {
    try {
        const client = await mongo.connect();
        await prmCategories.deleteCategories(client);
        mongo.close(client);
    } catch (error) {
        console.log(error)
    }
}




function deletecategoriesMongodb() {

    var mongoclient = mongo.MongoClient;
    var mongoUrl = 'mongodb://localhost:27017/algolia';


    mongoclient.connect(mongoUrl, function(err, db) {
        if (err) {
            console.error(err);
            throw err;
        }

        var dbo = db.db("algolia");

        dbo.collection("categories").drop(function(err, delOK) {
            if (err) throw err;
            if (delOK) console.log("Collection deleted");
            db.close();
        });
    });
}