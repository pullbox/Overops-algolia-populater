var mongo = require('mongodb');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var algoliasearch = require('algoliasearch');
var htmlToText = require('html-to-text');
var zenConfig = require('./configuration');
var jsonQuery = require('json-query');


var categories = `[ 
                  { "id": "5c45cf5372c8701449bd958a", "name": "SaaS Deployment" } ,
                  { "id": "5b86ae6bf96d6b0003c0bd91", "name": "SaaS Deployment" } , 
                  { "id": "5c45cf5372c8701449bd9598", "name": "Attaching the Micro-Agent" },
                  { "id": "5b86ae6bf96d6b0003c0bd9f", "name": "Attaching the Micro-Agent" }, 
                  { "id": "5c45cf5372c8701449bd9597", "name": "On-Premises Deployment" },
                  { "id": "5b86ae6bf96d6b0003c0bd9e", "name": "On-Premises Deployment" },
                  { "id": "5c45cf5372c8701449bd9594", "name": "Hybrid Deployment"},
                  { "id": "5b86ae6bf96d6b0003c0bd9b", "name": "Hybrid Deployment"},
                  { "id": "5c45cf5372c8701449bd9599", "name": "Reporting and Publishing Metrics"},
                  { "id": "5b86ae6bf96d6b0003c0bda0", "name": "Reporting and Publishing Metrics"},
                  { "id": "5c45cf5372c8701449bd9590", "name": "The Dashboard"},
                  { "id": "5b86ae6bf96d6b0003c0bd97", "name": "The Dashboard"},
                  { "id": "5c45cf5372c8701449bd958c", "name": "Resolving Error"},
                  { "id": "5b69a12a98d4d300037af500", "name": "Resolving Error"},
                  { "id": "5c45cf5372c8701449bd959d", "name": "Video Tutorials"},
                  { "id": "5b86ae6bf96d6b0003c0bda4", "name": "Video Tutorials"},
                  { "id": "5c45cf5372c8701449bd9592", "name": "Integrations to Overops"},
                  { "id": "5c45cf5372c8701449bd9596", "name": "Before Installing Overops"},
                  { "id": "5b86ae6bf96d6b0003c0bd9d", "name": "Before Installing Overops"},
                  { "id": "5c45cf5372c8701449bd9593", "name": "Upgrading or Uninstalling Overops"},
                  { "id": "5b86ae6bf96d6b0003c0bd9a", "name": "Upgrading or Uninstalling Overops"},
                  { "id": "5c45cf5372c8701449bd958b", "name": "Get Started"},
                  { "id": "5b86ae6bf96d6b0003c0bd92", "name": "Get Started"},
                  { "id": "5c45cf5372c8701449bd958e", "name": "General"},
                  { "id": "5b86ae6bf96d6b0003c0bd95", "name": "General"},
                  { "id": "5c45cf5372c8701449bd9595", "name": "Security"},
                  { "id": "5be44400a1f75800379bf28f", "name": "Security"},
                  { "id": "5c45cf5372c8701449bd9591", "name": "OverOps Switches"},
                  { "id": "5b69a12a98d4d300037af505", "name": "OverOps Switches"},
                  { "id": "5c45cf5372c8701449bd958d", "name": "Whats New"},
                  { "id": "5b86ae6bf96d6b0003c0bd94", "name": "Whats New"},
                  { "id": "5c45cf5372c8701449bd959a", "name": "Collector Advanced Settings"},
                  { "id": "5b69a12a98d4d300037af50e", "name": "Collector Advanced Settings"},
                  { "id": "5c45cf5372c8701449bd959b", "name": "Agent Advanced Settings"},
                  { "id": "5b86ae6bf96d6b0003c0bda2", "name": "Agent Advanced Settings"},
                  { "id": "5c45cf5372c8701449bd959f", "name": "Build Tools"},   
                  { "id": "5c45cf5372c8701449bd95a0", "name": "Deployment Automation"},                  
                  { "id": "5c45cf5372c8701449bd95a1", "name": "Reliability Dashboard"},
                  { "id": "5c45cf5372c8701449bd95a2", "name": "Installation Links (Site Map)"},
                  { "id": "5c45cf5372c8701449bd958f", "name": "Administrative Settings"},
                  { "id": "5b86ae6bf96d6b0003c0bd96", "name": "Administrative Settings"}
                ] `;


// create JSON object 
catjson = JSON.parse(categories);


// Delete old indexs based on "old Version number"
// ---------------------------------
// Make sure to set the version numbers in the configuration.js file !!!!!!!
// ---------------------------------

deleteagoliaIndex();

// Add/update current index records
listslugsMongodb();










function listslugsMongodb() {

    var mongoclient = mongo.MongoClient;
    var mongoUrl = 'mongodb://localhost:27017/algolia';

    mongoclient.connect(mongoUrl, function(err, db) {
        if (err) {
            console.error("Mongo error", err);
            throw err;
        }

        var dbo = db.db("algolia");

        dbo.collection("slugs").find().forEach(function(doc) {
            // do stuff

            //console.log(doc.url);
            if (doc.hostname == "doc.overops.com") {
                readReadme(doc);
            }

        }, function(err) {

            //console.log("err done in listslugsMongodb");
            //console.log("Err:", err); 
            db.close(false, function() {

                console.log("Mongo Done");


            });


        });

    });

}






function readReadme(doc) {

    var data = JSON.stringify(false);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {

        //callback function once completed!

        if (this.readyState === this.DONE) {

            // Begin accessing JSON data here
            obj = JSON.parse(this.responseText);
            //console.log(obj.title);

            //console.log(obj);
            if ((obj !== null) && (typeof obj._id != 'undefined')) {
                createAlgoliaIndex(obj, doc, function(err, dataJson) {
                    if (err) {
                        console.log("Add Algolia index:", err);
                        throw err;
                    }
                    //console.log("Json:", dataJson);
                    if (dataJson) {
                        writealgoliaIndex(dataJson, function(err, result) {
                            if (err) {
                                console.log("writeIndex error", err);
                                throw err;
                            }
                            console.log("Index added:", dataJson.title, result);
                        });
                    }
                });
            } // obj !== null
        } // readystate == done
    });

    //console.log("zenConfig", zenConfig);
    //console.log("adminkey:", zenConfig.auth.readmeAdminKey);
    xhr.open("GET", "https://dash.readme.io/api/v1/docs/" + doc.slug);
    xhr.setRequestHeader("x-readme-version", zenConfig.auth.DocVersion_current);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Basic " + zenConfig.auth.readmeAdminKey);
    xhr.send(data);

}






function writealgoliaIndex(mongorecord, callback) {
    var algoliaApplicationID = zenConfig.auth.algoliaApplicationID;
    var algoliaAdminKey = zenConfig.auth.algoliaAdminKey;
    var algoliaIndexName = zenConfig.auth.algoliaIndex;
    var algolia = algoliasearch(algoliaApplicationID, algoliaAdminKey);
    var index = algolia.initIndex(algoliaIndexName);



    index.saveObject(mongorecord, function(err, content) {
        if (err) {
            console.error(err);
            throw err;
        }

        //  console.log("Index added", content);
        return callback(null, content);
    });

}







function createAlgoliaIndex(zendeskdata, doc, callback) {

    //console.log("apiddata", zendeskdata);
    try {

        jsonObj = [];
        page = {}

        page["locale"] = localeJson(zendeskdata.locale);
        page["position"] = 0;
        page["title"] = zendeskdata.title;
        page["body_safe"] = htmlToText.fromString(zendeskdata.body_html, { wordwrap: 130 }).substring(0, 8000);
        page["outdated"] = null;
        page["promoted"] = null;
        page["vote_sum"] = null;
        page["comment_count"] = 0;
        page["category"] = categoryJson(zendeskdata.topic_id);
        page["section"] = sectionJson(zendeskdata.category);
        page["lable_names"] = null;

        page["_id"] = zendeskdata._id;
        page["id"] = zendeskdata._id;
        page["objectID"] = zendeskdata._id;


        page["source"] = "Documentation";
        page["version"] = translateVersion(zendeskdata.version);

        page["url"] = doc.url;
        page["author"]


        page["follower_count"]
        page["hidden"] = zendeskdata.hidden;
        page["parentDoc"] = zendeskdata.parentDoc;

        page["created_at_iso"] = zendeskdata.createdAt;
        page["updated_at_iso"] = null
        page["edited_at_iso"] = null
        page["slug"] = zendeskdata.id;



        var regex2 = /((https:\/\/files.readme.io)[-a-zA-Z0-9:@;?&=\/%\+\.\*!'\(\),\$_\{\}\^~\[`#|]+)/
        var datatosearch = htmlToText.fromString(zendeskdata.body_html, { wordwrap: 130 }).substring(0, 9000);

        var regexresult2 = datatosearch.match(regex2);
        if (regexresult2 != null) {
            var myimage = regexresult2[0];
            page["image"] = myimage;

        }


    } catch (error) {
        return callback(error);
    }

    return callback(null, page);
}






function categoryJson(sec_id) {

    var category = {} // empty object
    category["id"] = 2;
    category["title"] = "Documentation";

    return category;
}



function sectionJson(sec_id) {


    //console.log("Section-ID", sec_id);
    var section = {} // empty object
    section["id"] = sec_id;
    section["title"] = translateCategory(sec_id);
    section["full_path"]
    section["user_segment"]
        //console.log("section", section);
    return section;
}


function translateCategory(id) {

    var categoryobj = jsonQuery('[id=' + id + ']', {
        data: catjson
    });

    //console.log("categoryobj: ", categoryobj.value);
    if (categoryobj.value == null) {
        return id;
    } else {
        return categoryobj.value.name;
    }
}

function translateVersion(id) {

    var version = "n/a";

    if (id == '5b69a12a98d4d300037af5fd') {
        version = "4.16";
        return version;
    } else if (id == '5b86ae6bf96d6b0003c0be97') {
        version = "4.17";
        return version;
    } else if (id == '5bbeee6ae658fb000339e4ec') {
        version = "4.19";
        return version;
    } else if (id == '5be44400a1f75800379bf3a6') {
        version = "4.22";
        return version;
    } else if (id == '5c45cf5372c8701449bd96e6') {
        version = "4.30";
        return version;
    } else {

        version = id;
        return version;
    }
}


function localeJson(varlocale) {


    var locale = {} // empty object
    locale["locale"] = "en-us";
    locale["name"] = 'English';
    locale["rtl"] = false;

    return locale;
}











function deleteagoliaIndex() {
    var algoliaApplicationID = zenConfig.auth.algoliaApplicationID;
    var algoliaAdminKey = zenConfig.auth.algoliaAdminKey;
    var algoliaIndexName = zenConfig.auth.algoliaIndex;
    var algolia = algoliasearch(algoliaApplicationID, algoliaAdminKey);
    var index = algolia.initIndex(algoliaIndexName);



    index.deleteBy({ filters: 'version:' + zenConfig.auth.DocVersion_old.substring(1, 5) }, function(err, content) {

        if (err) {
            console.error(err);
            throw err;
        }

        console.log("Indexes deleted", content);

    });
}