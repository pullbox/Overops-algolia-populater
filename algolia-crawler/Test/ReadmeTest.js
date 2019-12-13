const readme = require('../db/readmeApi');
const docs = new readme();
const prmReadme = require('../promises/prmREadme');

//Path to Mongo install
// /Users/danielbechtel/Documents/Development-tools/MongoDB/mongodb-osx-x86_64-4.0.1/bin
//     ulimit -n 1024
// mongod
const slug = "compatibility";

//getDoc(slug);
getVersion();;

async function getVersion() {
    try {
        const response = await docs.getVersions();
        console.log("got the data: ", response.data);
        let version = [];
        version = response.data;
        console.log(version);
        console.log(version[0]);
        console.log(version[0][1])
    } catch (error) {
        console.log(error)
    }
}



async function getDoc(slug) {
    try {
        const response = await docs.getreadMe("docs", slug);
        console.log("got the data: ", response);
        console.log("data: " + response.data._id + " " + response.data.category);
    } catch (error) {
        console.log(error)
    }
}