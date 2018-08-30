var zendesk = require('node-zendesk');
var algoliasearch = require('algoliasearch');
var htmlToText = require('html-to-text');
var jsonQuery = require('json-query')
var zenConfig = require('./configuration');
var fs = require('fs');
// var zd = require('../lib/client');



var theTopics = {} // empty Object
var topickey = 'topics';
theTopics[topickey] = []; // empty Array, which you can push() values into
var theCategories = {} // empty Object
var categorykey = 'categories';
theCategories[categorykey] = []; // empty Array, which you can push() values into

getTopics();
getPosts();






function getPosts() {

  var community = zendesk.createClient({
    username:  zenConfig.auth.username,
    token:     zenConfig.auth.token,
    remoteUri: 'https://takipi.zendesk.com/api/v2/community',
    debug: false,
    community: true
  });

  //community.articles.sideLoad = ['topics'];
  community.posts.list(function (err, req, result) {
    //if (debug) {
    //   console.log(result);
    //} 
    if (err) {
      console.log(err);
      return;
    }

    result.forEach(function(value) {
       
                createStdAlgoliaJson(value, function(err,dataJson) {
                  if (err) {
                      console.log("JSON Algolia:", err);
                      throw err;
                  }
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

    }); // result.forEach value
  }); // community.articles
} // getArticles







function getTopics() {

  var community = zendesk.createClient({
    username:  zenConfig.auth.username,
    token:     zenConfig.auth.token,
    remoteUri: 'https://takipi.zendesk.com/api/v2/community',
    debug: false,
    community: true
  });

  //community.articles.sideLoad = ['topics'];
  community.topics.list(function (err, req, jsonTopics) {
    //if (debug) {
    //   console.log(result);
    //} 
    if (err) {
      console.log(err);
      return;
    }

   //console.log(jsonTopics);
    jsonTopics.forEach(function(value) {
      
                createStdTopicJson(value, function(err,dataJson) {
                  if (err) {
                      console.log("JSON Topic:", err);
                      throw err;
                  }
                  if (dataJson) {
                    theTopics[topickey].push(dataJson);
                  }
                });

    }); // result.forEach value
  }); // community.articles
} // getArticles

function createStdTopicJson(jsonTopics, callback) {

//var theTopics = {} // empty Object
//var topickey = 'topic';
//theTopics[topickey] = [];

  try {
 
        page = {}
        jsonObj = [];
        page ["id"] = jsonTopics.id;
        page ["source"] = "Topics";
        page ["url"] = jsonTopics.html_url;
        page ["follower_count"] = jsonTopics.follower_count;
        page ["slug"] = jsonTopics.id;
        page ["title"] = jsonTopics.name;
     }
     catch(error) {
      return callback(error);
     }
        return callback(null, page);
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

            //console.log("Index added", content);
            return callback(null, content);
          });

  }







function createStdAlgoliaJson(zendeskdata, callback) {

  try {

    jsonObj = [];
        page = {}



        page ["locale"] = localeJson(zendeskdata.locale);
        page ["position"] = 0;
        page ["title"] = zendeskdata.title;
        page ["body_safe"] = htmlToText.fromString(zendeskdata.details, 
          {wordwrap: 130}).substring(0,8000);
        page ["outdated"] = null;
        page ["promoted"] = null;
        page ["vote_sum"] = zendeskdata.vote_sum;
        page ["comment_count"] = zendeskdata.comment_count;
        page ["category"] = categoryJson(zendeskdata.topic_id);
        page ["section"] = sectionJson(zendeskdata.topic_id);
        page ["lable_names"] = null;

        page ["_id"] = zendeskdata.id;
        page ["id"] = zendeskdata.id;
        page ["objectID"] = zendeskdata.id;


        page ["source"] = "Community";
        page ["version"] = null;

        page ["url"] = zendeskdata.html_url;
        page ["author"] = zendeskdata.author_id;
       

        page ["follower_count"] = zendeskdata.follower_count;
        page ["hidden"] = zendeskdata.hidden;
        page ["parentDoc"] = zendeskdata.parentDoc;
        page ["created_at_iso"] = zendeskdata.created_at;
        page ["updated_at_iso"] = zendeskdata.updated_at;
        page ["edited_at_iso"] = null;

        page ["slug"] = zendeskdata.id;
       

     }
     catch(error) {
      return callback(error);
     }

        return callback(null, page);
}




function categoryJson(sec_id) {
 
  var category = {}  // empty object
  category ["id"] = 1;
  category ["title"] = "Community";

  return  category;
}


function sectionJson(sec_id) {

  var sectionobj =  jsonQuery('topics[id=' + sec_id + ']', {
              data: theTopics
              });

  //console.log("Section-ID", sec_id);
  var section = {}  // empty object
  section ["id"] = sec_id;
  section ["title"] = sectionobj.value.title;
  section ["full_path"]
  section ["user_segment"] = sectionobj.value.user_segment_id;
  section ["follower_count"] = sectionobj.value.follower_count;
  //console.log("section", section);
  return  section;
}




function localeJson(varlocale) {

  
  var locale = {}  // empty object
  locale ["locale"] = 'en-us';
  locale ["name"] = 'English';
  locale ["rtl"] = false;
  

  return  locale;
}






