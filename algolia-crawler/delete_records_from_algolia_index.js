var algoliasearch = require('algoliasearch');
var zenConfig = require('./configuration');



              


deleteagoliaIndex();



  function deleteagoliaIndex() {
    var  algoliaApplicationID = zenConfig.auth.algoliaApplicationID;
    var  algoliaAdminKey = zenConfig.auth.algoliaAdminKey;
    var  algoliaIndexName = zenConfig.auth.algoliaIndex;
    var  algolia = algoliasearch(algoliaApplicationID, algoliaAdminKey);
    var index = algolia.initIndex(algoliaIndexName);



        index.deleteby({
            filters: 'version:' + zenConfig.Auth.DocVersion_old
            }, function(err, content) {
            
            if (err) {
              console.error(err);
              throw err;
            }

            console.log("Index deleted", content);
         
          });
  }








