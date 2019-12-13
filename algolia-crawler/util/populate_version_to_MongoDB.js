const mongo = require('../db/mongodb');
const prmVersions = require('../promises/prmVersions');
const readme = require('../db/readmeApi');
const docs = new readme();

//Path to Mongo install
// /Users/danielbechtel/Documents/Development-tools/MongoDB/mongodb-osx-x86_64-4.0.1/bin
//     ulimit -n 1024
// mongod


start();


async function start() {

    let versions = [];
    console.log("--------------------------");
    console.log("Program start! ");
    console.log("--------------------------");


    try {
        const client = await mongo.connect();
        var result = await prmVersions.deleteVersions(client);
        console.log("Versions dropped?  ", result);
        mongo.close(client);

    } catch (e) {
        console.log("Versions dropped? ", e);
        throw e
    }

    try {
        const response = await docs.getVersions();
        versions = response.data;
    } catch (error) {
        console.log(error)
    }



    writetoMongo(versions).then(() => {
        mongo.close(client);
        console.log("-----------------------------");
        console.log(versions.length + " Versions were upated!")
        console.log("-- Program finished!       --");
        console.log("-----------------------------");
    })

}


async function writetoMongo(versions) {
    const client = await mongo.connect();
    versions.forEach(writeVersions);
}



async function writeVersions(version, index) {

    try {
        let response = await prmVersions.updateVersions(client, version);
        console.log("Version " + version.version + " was written!");
        console.log("Upsert status: ", response.result.ok);
    } catch (e) {
        console.log("Update Error: ", e);
    }
}