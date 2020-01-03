const mongo = require('../db/mongodb');
const prmCategories = require('../promises/prmCategories');
const prmVersions = require('../promises/prmVersions');
//Path to Mongo install
// /Users/danielbechtel/Documents/Development-tools/MongoDB/mongodb-osx-x86_64-4.0.1/bin
//     ulimit -n 1024
// mongod

readbyID();

async function readbyID() {
    try {
        const client = await mongo.connect();
        let actual = await prmCategories.getCategorybyID(client, "5dedf7251c00fe00368efb78");
        console.log("Actual: ", actual);

         actual = await prmVersions.getVersionsbyID(client, "5dedf7251c00fe00368efd03");
        console.log("Actual: ", actual);


        mongo.close(client);
    } catch (error) {
        console.log(error)
    }
}