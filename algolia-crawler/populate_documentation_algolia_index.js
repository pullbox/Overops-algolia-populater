const logger = require('./util/logger');

var algoliasearch = require('algoliasearch');
var htmlToText = require('html-to-text');
var zenConfig = require('./configuration');
var jsonQuery = require('json-query');
const mongo2 = require('./db/mongodb');
const prmVersions = require('./promises/prmVersions');
const prmCategories = require('./promises/prmCategories');
const prmSlugs = require('./promises/prmSlugs');

const readme = require('./db/readmeApi');
const docs = new readme();

let regexp = /^[a-zA-Z0-9-]+$/;

//logger.info("----------------------------------------------------------");
//logger.info("--------------       Start    ----------------------------");
//logger.info("----------------------------------------------------------");

console.log("node environment: ", process.env.NODE_ENV);
//logger.info("logger node environment: " + process.env.NODE_ENV);

pdelete = deleteagoliaIndex();
pslugs = getslugs();
pversions = getversions();
psections = getsections();



Promise.all([pdelete, pslugs, pversions, psections])
    .then((resolve) => {
        var deleted = resolve[0];
        const slugs = resolve[1];
        const versions = resolve[2];
        const sections = resolve[3];

        console.log("delete: ", deleted);
        //logger.info("deleted old indexes: ", JSON.stringify(deleted));

        for (let index = 0; index < slugs.length; index++) {
          
            //console.log("MissingSlug: ", slugs[index]._id, slugs[index].slug);
          
            if ((slugs[index].hostname != "doc.overops.com") || (!regexp.test(slugs[index].slug))) {
                continue;
            }
            processslug(slugs[index], index)
                .then((result) => {
                    if (result) {
                        var data = result.data;
                        // console.log("data: ", data);
                        // create algolia JSON
                        if (data) {
                            console.log("Create Index: ", data.title);
                            //logger.info("Create Index: ", JSON.stringify(data.title));
                            return createAlgoliaIndex(data, slugs[index], resolve);
                        }
                    }

                })
                .then((algoliarecord) => {
                    if (algoliarecord) {
                        console.log("Write: " + algoliarecord.title);
                        //logger.info("Write: " + algoliarecord.title);
                        let content = writeAlgoliaIndex(algoliarecord)
                        return content
                    }

                })
                .then((result) => {
                    //console.log("result: ", result);
                    console.log("Index written: " + result.updatedAt);
                    //logger.info("Index written at " + result.updatedAt)
                    return "ok"
                })
                .catch((err) => {
                    console.log("Algolia add index error: ", err);
                    //logger.error("Algoila add index error: ", err);
                })

        }
    })
    .catch((error) => {
        console.log("Promise.all failed: ", error);
        //logger.error("Promise.all failed ", JSON.stringify(error));
    })


async function processslug(slug, index) {

    let doc = await docs.getreadMe("docs", slug.slug)
    return doc;

}

async function writeAlgoliaIndex(algoliarecord) {
    var algoliaApplicationID = zenConfig.auth.algoliaApplicationID;
    var algoliaAdminKey = zenConfig.auth.algoliaAdminKey;
    var algoliaIndexName = zenConfig.auth.algoliaIndex;
    //var algoliaIndexName = "test"
    var algolia = algoliasearch(algoliaApplicationID, algoliaAdminKey);
    var index = algolia.initIndex(algoliaIndexName);
    try {
        const content = await index.saveObject(algoliarecord)
        return content
    } catch (error) {
        console.log("WriteAPI Error: ", error);
        //logger.error("writeAPI Error: ", JSON.stringify(error));
    }
}






async function createAlgoliaIndex(zendeskdata, doc, resolve) {
    const versions = resolve[2];
    const sections = resolve[3];

    try {
        jsonObj = [];
        algoliarecord = {}
        algoliarecord["locale"] = localeJson(zendeskdata.locale);
        algoliarecord["position"] = 0;
        algoliarecord["title"] = zendeskdata.title;
        algoliarecord["body_safe"] = htmlToText.fromString(zendeskdata.body_html, { wordwrap: 130 }).substring(0, 8000);
        algoliarecord["outdated"] = null;
        algoliarecord["promoted"] = null;
        algoliarecord["vote_sum"] = null;
        algoliarecord["comment_count"] = 0;
        algoliarecord["category"] = categoryJson(zendeskdata.topic_id);
        algoliarecord["lable_names"] = null;
        algoliarecord["section"] = sectionJson(zendeskdata.category, sections)
        algoliarecord["version"] = versions.find(function(element) { return element._id == zendeskdata.version }).version
        algoliarecord["_id"] = zendeskdata._id;
        algoliarecord["id"] = zendeskdata._id;
        algoliarecord["objectID"] = zendeskdata._id;
        algoliarecord["source"] = "Documentation";

        algoliarecord["url"] = doc.url;
        algoliarecord["author"]
        algoliarecord["follower_count"]
        algoliarecord["hidden"] = zendeskdata.hidden;
        algoliarecord["parentDoc"] = zendeskdata.parentDoc;
        algoliarecord["created_at_iso"] = zendeskdata.createdAt;
        algoliarecord["updated_at_iso"] = null
        algoliarecord["edited_at_iso"] = null
        algoliarecord["slug"] = zendeskdata.slug;
        var regex2 = /((https:\/\/files.readme.io)[-a-zA-Z0-9:@;?&=\/%\+\.\*!'\(\),\$_\{\}\^~\[`#|]+)/
        var datatosearch = htmlToText.fromString(zendeskdata.body_html, { wordwrap: 130 }).substring(0, 9000);

        var regexresult2 = datatosearch.match(regex2);
        if (regexresult2 != null) {
            var myimage = regexresult2[0];
            algoliarecord["image"] = myimage;
        }
    } catch (error) {
        console.log("CreateIndex Catch Error: ", error, zendeskdata);
        //logger.error("createIndex catch error: ", JSON.stringify(error));
        //reject(error);
        return null;
    }
    return algoliarecord;
}



async function getslugs() {
    return new Promise(async(resolve, reject) => {
        let client = await mongo2.connect()
        let slugs = await prmSlugs.getSlugs(client)
        resolve(slugs);
        client.close();
    })
}

function localeJson(varlocale) {
    var locale = {} // empty object
    locale["locale"] = "en-us";
    locale["name"] = 'English';
    locale["rtl"] = false;
    return locale;
}

function sectionJson(sec_id, sections) {
    try{
        var section = {} // empty object
        section["id"] = sec_id;
        section["title"] = sections.find(function(element) { return element.id == sec_id }).title;
        section["full_path"]
        section["user_segment"]
    }
    catch {
        console.log("Category lookup failed: ", error.message);
        throw(error);
    }
    return section;
}


function categoryJson(sec_id) {
    var category = {} // empty object
    category["id"] = 2;
    category["title"] = "Documentation";
    return category;
}



async function getversions() {
    return new Promise(async(resolve, reject) => {
        const client3 = await mongo2.connect();
        let versions = await prmVersions.getVersions(client3)
        resolve(versions);
        client3.close();
    })
}


async function getsections() {
    return new Promise(async(resolve, reject) => {
        const client2 = await mongo2.connect();
        let sections = await prmCategories.getCategories(client2);
        resolve(sections);
        client2.close();
    })
}


async function deleteagoliaIndex() {
    return new Promise((resolve, reject) => {
        var algoliaApplicationID = zenConfig.auth.algoliaApplicationID;
        var algoliaAdminKey = zenConfig.auth.algoliaAdminKey;
        //var algoliaIndexName = "test"
        var algoliaIndexName = zenConfig.auth.algoliaIndex;
        var algolia = algoliasearch(algoliaApplicationID, algoliaAdminKey);
        var index = algolia.initIndex(algoliaIndexName);

        index.deleteBy({ filters: 'version:' + zenConfig.auth.DocVersion_old.substring(1, 5) }, function(err, content) {
            (err) ? reject(err): resolve(("Indexes deleted", content));
        });
    })
}