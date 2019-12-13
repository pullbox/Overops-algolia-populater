

const readme = require('../db/readmeApi');
const docs = new readme();
const prmReadme = require('../promises/prmREadme');

//Path to Mongo install
// /Users/danielbechtel/Documents/Development-tools/MongoDB/mongodb-osx-x86_64-4.0.1/bin
//     ulimit -n 1024
// mongod
const slug = "compatibility";

getDoc(slug);

async function getDoc(slug) {
    try {
        const response = await docs.instance("docs",slug);
        console.log("got the data: " , response);
        console.log("data: " + response.data._id + " " + response.data.category);
    } catch (error) {
        console.log(error)
    }
}