const Category = require('./Category');
const mongo = require('../db/mongodb');
const prmCategories = require('../promises/prmCategories');
const readme = require('../db/readmeApi');
const docs = new readme();

//Path to Mongo install
// /Users/danielbechtel/Documents/Development-tools/MongoDB/mongodb-osx-x86_64-4.0.1/bin
//     ulimit -n 1024
// mongod

let categories = [];
categories.push(new Category("get-started", "", "Introduction"));
categories.push(new Category("whats-new", "", "What's New"));
categories.push(new Category("general", "", "Getting Started"));
categories.push(new Category("security-1", "", "OverOps Product End of Life"));
categories.push(new Category("new-installation-portal", "", "Install OverOps"));
categories.push(new Category("java-installation", "", "Java Installation"));
categories.push(new Category("net-installation", "", ".NET Installation"));
categories.push(new Category("upgrading-overops", "", "Upgrading or Uninstalling"));

//categories.push(new Category("collector-advanced-setting", "", "collector Advanced Seetings"));
categories.push(new Category("reliability-dashboard", "", "Identify"));
categories.push(new Category("the-dashboard", "", "Event Explorer"));
categories.push(new Category("resolving-with-errors", "", "Resolve"));
categories.push(new Category("integrations-to-overops", "", "Prevent"));
categories.push(new Category("reporting-and-publishing-metrics", "", "Reporting and Publishing"));
categories.push(new Category("customizations", "", "Customizations"));
categories.push(new Category("installation-advanced-settings-beta", "", "Advanced Configurations"));
categories.push(new Category("deployment-automation", "", "Deployment Automation"));
categories.push(new Category("application-performance-monitoring-apm-integrations", "", "Appliction Performance Monitoring (APM) Integrations"));

categories.push(new Category("security", "", "Security"));
categories.push(new Category("build-tools", "", "Build Tools"));
categories.push(new Category("attaching-the-agent", "", "Attaching the Agent"));
categories.push(new Category("overops-switches", "", "OverOps Switches"));
categories.push(new Category("administration-settings", "", "Administration Settings"));
categories.push(new Category("settings", "", "Settings"));



console.log("--------------------------");
console.log("Program start! ");
console.log(categories.length + " Categories to update!")
console.log("--------------------------");

deleteCategories();



let promises = [];

categories.forEach(function(element, index) {
    promises.push(updateCategory(element, index)
        .then((result) => {
            categories[index].id = result.data._id;
            categories[index].title = result.data.title;
            console.log("Updated category: ", categories[index].id, categories[index].title);
        })
        .catch(function(error) {
            console.log(error);
        })
    )
});

Promise.all(promises).then(() => {
    writeCategorystoMongo(categories).then(() => {
        mongo.close(client);
        console.log("-----------------------------");
        console.log("-- Program finished!       --");
        console.log("-----------------------------");
    })

});



function updateCategory(category, index) {
    return docs.getreadMe("categories", category.slug)
}

async function writeCategorystoMongo(categories) {
    const client = await mongo.connect();
    categories.forEach(writeCategories);
}






async function writeCategories(category, index) {

    try {
        let response = await prmCategories.updateCategory(client, category);
        console.log("Category " + category.slug + " was written!");
        console.log("Upsert status: ", response.result.ok);
    } catch (e) {
        console.log("Update Error: ", e);
        //throw e
    }
}


async function deleteCategories() {
    try {
        const client = await mongo.connect();
        var result = await prmCategories.deleteCategories(client);
        console.log("Categories dropped?  ", result);
        mongo.close(client);

    } catch (e) {
        console.log("Categories dropped? ", e);
        throw e
    }
}