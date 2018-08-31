var zendesk = require('node-zendesk');
var mongo = require('mongodb');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var algoliasearch = require('algoliasearch');
var htmlToText = require('html-to-text');
var jsonQuery = require('json-query')
var zenConfig = require('./configuration');
 

var theSections = {} // empty Object
var sectionkey = 'sections';
theSections[sectionkey] = []; // empty Array, which you can push() values into
var theCategories = {} // empty Object
var categorykey = 'categories';
theCategories[categorykey] = []; // empty Array, which you can push() values into

getSections();
getCategories();
getArticles();

console.log("done-done");





function getArticles() {

  var community = zendesk.createClient({
    username:  'daniel.bechtel@overops.com',
    token:     'Qq1rb4fTmeLmoO7TlkqHYptH56uMnYWi4wEYulgV',
    remoteUri: 'https://takipi.zendesk.com/api/v2/help_center',
    debug: false,
    helpcenter: true
  });

  //community.articles.sideLoad = ['sections'];
  community.articles.listByLocale('en-us', function (err, req, result) {
    //if (debug) {
    //   console.log(result);
    //} 
    if (err) {
      console.log(err);
      return;
    }

    result.forEach(function(value) {
        if (value.section_id !== 360001712713) {   // Old Documentation
          if (value.section_id !== 360001115753) {  // JP Morgan Chase 
            if (value.section_id !==204131907) { // Internal Knowledge Base
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
            } // Internal Knowledge Base
          } // section id == JP Morgan Chase & CO
        } // section ID == OLD Documentation
    }); // result.forEach value
  }); // community.articles
} // getArticles







function getSections() {

  var community = zendesk.createClient({
    username:  'daniel.bechtel@overops.com',
    token:     'Qq1rb4fTmeLmoO7TlkqHYptH56uMnYWi4wEYulgV',
    remoteUri: 'https://takipi.zendesk.com/api/v2/help_center',
    debug: false,
    helpcenter: true
  });

  //community.articles.sideLoad = ['sections'];
  community.sections.list(function (err, req, jsonSections) {
    //if (debug) {
    //   console.log(result);
    //} 
    if (err) {
      console.log(err);
      return;
    }

   //console.log(jsonSections);
    jsonSections.forEach(function(value) {
      
                createStdSectionJson(value, function(err,dataJson) {
                  if (err) {
                      console.log("JSON Section:", err);
                      throw err;
                  }
                  if (dataJson) {
                    theSections[sectionkey].push(dataJson);
                  }
                });

    }); // result.forEach value
  }); // community.articles
} // getArticles

function createStdSectionJson(jsonSections, callback) {

//var theSections = {} // empty Object
//var sectionkey = 'section';
//theSections[sectionkey] = [];

  try {
 
        page = {}
        jsonObj = [];
        page ["id"] = jsonSections.id;
        page ["source"] = "Sections";
        page ["url"] = jsonSections.html_url;
        page ["category_id"] = jsonSections.category_id;
        page ["slug"] = jsonSections.id;
        page ["title"] = jsonSections.name;
        page ["locale"] = jsonSections.locale;
     }
     catch(error) {
      return callback(error);
     }
        console.log(page);
        return callback(null, page);
}








function getCategories() {

  var community = zendesk.createClient({
    username:  'daniel.bechtel@overops.com',
    token:     'Qq1rb4fTmeLmoO7TlkqHYptH56uMnYWi4wEYulgV',
    remoteUri: 'https://takipi.zendesk.com/api/v2/help_center',
    debug: false,
    helpcenter: true
  });

  //community.articles.sideLoad = ['sections'];
  community.categories.list(function (err, req, jsonCategories) {
    //if (debug) {
    //   console.log(result);
    //} 
    if (err) {
      console.log(err);
      return;
    }

   //console.log(jsonSections);
    jsonCategories.forEach(function(value) {
      
                createStdCategoryJson(value, function(err,dataJson) {
                  if (err) {
                      console.log("JSON Category:", err);
                      throw err;
                  }
                  if (dataJson) {
                    theCategories[categorykey].push(dataJson);
                  }
                });

    }); // result.forEach value
  }); // community.articles
} // getArticles

function createStdCategoryJson(jsonCategory, callback) {

//var theSections = {} // empty Object
//var sectionkey = 'section';
//theSections[sectionkey] = [];

  try {
 
        page = {}
        jsonObj = [];
        page ["id"] = jsonCategory.id;
        page ["source"] = "Category";
        page ["url"] = jsonCategory.html_url;
        page ["slug"] = jsonCategory.id;
        page ["title"] = jsonCategory.name;
        page ["locale"] = jsonCategory.locale;
     }
     catch(error) {
      return callback(error);
     }
        console.log(page);
        return callback(null, page);
}



















  function writealgoliaIndex(mongorecord, callback) {
    //var  algoliaApplicationID = 'HI7RLPJPBN';
    //var  algoliaAdminKey = 'efb31d83596571adcb98aea8cf3c2fed';
    //var  algoliaIndexName = 'Documentation';
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
        //console.log("locale", zendeskdata.locale);

        page ["locale"] = localeJson(zendeskdata.locale);
        page ["position"] = zendeskdata.position;
        page ["title"] = zendeskdata.title;
        page ["body_safe"] = htmlToText.fromString(zendeskdata.body, 
          {wordwrap: 130}).substring(0,8000);
        page ["outdated"] = zendeskdata.outdated;
        page ["promoted"] = zendeskdata.promoted;
        page ["vote_sum"] = zendeskdata.vote_sum;

        page ["category"] = categoryJson(zendeskdata.section_id);
        page ["section"] = sectionJson(zendeskdata.section_id);
        page ["lable_names"] = zendeskdata.lable_names

        page ["_id"] = zendeskdata.id;
        page ["id"] = zendeskdata.id;
        page ["objectID"] = zendeskdata.id;
        page ["source"] = "KnowledgeBase";
        page ["version"] = 0.00;
       
        page ["url"] = zendeskdata.html_url;
        page ["author"] = zendeskdata.author_id;




        page ["hidden"] = zendeskdata.hidden;
        page ["parentDoc"] = zendeskdata.parentDoc;
        page ["created_at_iso"] = zendeskdata.created_at;
        page ["updated_at_iso"] = zendeskdata.updated_at;
        page ["edited_at_iso"] = zendesk.edited_at;
        page ["slug"] = zendeskdata.id;

        
     }
     catch(error) {
      return callback(error);
     }

        return callback(null, page);
}



function categoryJson(sec_id) {
  var sectionobj =  jsonQuery('sections[id=' + sec_id + ']', {
              data: theSections
              });
  //console.log("category-ID", sectionobj.value.category_id);
  var category = {}  // empty object
  category ["id"] = sectionobj.value.category_id;

  var categoryobj =  jsonQuery('categories[id=' + sectionobj.value.category_id + ']', {
              data: theCategories
              });
  //console.log("sectionobj:", sectionobj);
  //console.log("categoryobj", categorytitle);
  category ["title"] = categoryobj.value.title;

  return  category;
}


function sectionJson(sec_id) {

  var sectionobj =  jsonQuery('sections[id=' + sec_id + ']', {
              data: theSections
              });

  //console.log("Section-ID", sec_id);
  var section = {}  // empty object
  section ["id"] = sec_id;
  section ["title"] = sectionobj.value.title;
  section ["full_path"]
  section ["user_segment"]
  //console.log("section", section);
  return  section;
}




function localeJson(varlocale) {

  
  var locale = {}  // empty object
  locale ["locale"] = varlocale;
  locale ["name"] = 'English';
  locale ["rtl"] = false;
  

  return  locale;
}






