
var mongo = require('mongodb');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var algoliasearch = require('algoliasearch');
var htmlToText = require('html-to-text');
var zenConfig = require('./configuration');


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
    });

  });

}






function readReadme(doc) {

  var data = JSON.stringify(false);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {

    //callback function once completed!
    if (this.readyState === this.DONE) {
    
      // Begin accessing JSON data here
      obj = JSON.parse(this.responseText);
      //console.log(obj.title);

      //console.log(obj);
      if (obj !== null) {
        createAlgoliaIndex(obj, doc, function(err,dataJson) {

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
    }  // readystate == done
  });

  //console.log("zenConfig", zenConfig);
  console.log("adminkey:", zenConfig.auth.readmeAdminKey);
  xhr.open("GET", "https://dash.readme.io/api/v1/docs/" + doc.slug);
  xhr.setRequestHeader("x-readme-version", "v4.16");
  xhr.setRequestHeader("Accept",  "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Basic " + zenConfig.auth.readmeAdminKey);
  xhr.send(data);

}






  function writealgoliaIndex(mongorecord, callback) {
    var  algoliaApplicationID = zenConfig.auth.algoliaApplicationID;
    var  algoliaAdminKey = zenConfig.auth.algoliaAdminKey;
    var  algoliaIndexName = zenConfig.auth.algoliaIndex;
    var  algolia = algoliasearch(algoliaApplicationID, algoliaAdminKey);
    var index = algolia.initIndex(algoliaIndexName);



        index.saveObject(mongorecord, function(err, content) {
            if (err) {
              console.error(err);
              throw err;
            }

            console.log("Index added", content);
            return callback(null, content);
          });

  }







function createAlgoliaIndex(zendeskdata, doc , callback) {

  //console.log("apiddata", zendeskdata);
  try {

    jsonObj = [];
        page = {}

        page ["locale"] = localeJson(zendeskdata.locale);
        page ["position"] = 0;
        page ["title"] = zendeskdata.title;
        page ["body_safe"] = htmlToText.fromString(zendeskdata.body_html, 
          {wordwrap: 130}).substring(0,8000);
        page ["outdated"] = null;
        page ["promoted"] = null;
        page ["vote_sum"] = null;
        page ["comment_count"] = 0;
        page ["category"] = categoryJson(zendeskdata.topic_id);
        page ["section"] = sectionJson(zendeskdata.category);
        page ["lable_names"] = null;

        page ["_id"] = zendeskdata._id;
        page ["id"] = zendeskdata._id;
        page ["objectID"] = zendeskdata._id;


        page ["source"] = "Documentation";
        page ["version"] = translateVersion(zendeskdata.version);

        page ["url"] = doc.url;
        page ["author"]
       

        page ["follower_count"] 
        page ["hidden"] = zendeskdata.hidden;
        page ["parentDoc"] = zendeskdata.parentDoc;

        page ["created_at_iso"] = zendeskdata.createdAt;
        page ["updated_at_iso"] = null
        page ["edited_at_iso"] = null
        page ["slug"] = zendeskdata.id;
       
       

        var regex2 = /((https:\/\/files.readme.io)[-a-zA-Z0-9:@;?&=\/%\+\.\*!'\(\),\$_\{\}\^~\[`#|]+)/
        var datatosearch = htmlToText.fromString(zendeskdata.body_html, 
          {wordwrap: 130}).substring(0,9000);
    
        var regexresult2 = datatosearch.match(regex2);
        if (regexresult2 != null) {
          var myimage = regexresult2[0];
        page ["image"] = myimage;

        }  


     }
     catch(error) {
      return callback(error);
     }

        return callback(null, page);
}






function categoryJson(sec_id) {
 
  var category = {}  // empty object
  category ["id"] = 2;
  category ["title"] = "Documentation";

  return  category;
}



function sectionJson(sec_id) {


  //console.log("Section-ID", sec_id);
  var section = {}  // empty object
  section ["id"] = sec_id;
  section ["title"] = translateCategory(sec_id);
  section ["full_path"]
  section ["user_segment"]
  //console.log("section", section);
  return  section;
}


function translateCategory(id) {

if (id == '5b69a12a98d4d300037af4fe') {
        return 'SaaS Deployment';
    } else  if (id == '5b69a12a98d4d300037af50c') {
       return 'Attaching the Micro-Agent';
    } else  if (id == '5b69a12a98d4d300037af50b') {
       return 'On-Premises Deployment';
    } else  if (id == '5b69a12a98d4d300037af508') {
       return 'Hybrid Deployment';
    } else  if (id == '5b69a12a98d4d300037af50d') {
       return 'Reporting and Publishing Metrics';
    } else  if (id == '5b69a12a98d4d300037af504') {
       return 'The Dashboard';
    } else  if (id == '5b69a12a98d4d300037af500') {
       return 'Resolving Error';
    } else  if (id == '5b69a12a98d4d300037af511') {
       return 'Video Tutorials';
    } else  if (id == '5b69a12a98d4d300037af506') {
        return 'Integrations to Overops'
    } else  if (id == '5b69a12a98d4d300037af50a') {
        return 'Before Installing Overops'
    } else  if (id == '5b69a12a98d4d300037af507') {
        return 'Upgrading or Uninstalling Overops'
    } else  if (id == '5b69a12a98d4d300037af4ff') {
        return 'Get Started'
    } else  if (id == '5b69a12a98d4d300037af509') {
        return 'Integrations to Overops'
    } else  if (id == '5b69a12a98d4d300037af502') {
        return 'General'
    } else  if (id == '5b69a12a98d4d300037af505') {
        return 'OverOps Switches'
    } else  if (id == '5b69a12a98d4d300037af501') {
        return 'What`s New'
    } else  if (id == '5b69a12a98d4d300037af50e') {
        return 'Collector Advanced Settings'
    } else  if (id == '5b69a12a98d4d300037af50f') {
        return 'Agent Advanced Settings'
    } else  if (id == '5b69a12a98d4d300037af503') {
       return 'Administrative Settings';
    } else {
        return id;
    }
}

function translateVersion(id) {

if (id == '5b69a12a98d4d300037af5fd') {
        return '4.16';
    } else {
        return id;
    }
}


function localeJson(varlocale) {

  
  var locale = {}  // empty object
  locale ["locale"] = "en-us";
  locale ["name"] = 'English';
  locale ["rtl"] = false;
  

  return  locale;
}









