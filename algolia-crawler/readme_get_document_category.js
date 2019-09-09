var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var htmlToText = require('html-to-text');
var zenConfig = require('./configuration');
var jsonQuery = require('json-query');



var urls = [ {"slug": "introduction-to-overops", "id": "", "name": "Introduction to OverOps"},
             {"slug": "whats-new", "id": "", "name": "What's New"},
             {"slug": "compatibility", "id": "", "name": "Getting Started"},
             {"slug": "reliability-dashboards-overview", "id": "", "name": "Reliability Dashboards"},
             {"slug": "automated-root-cause-arc", "id": "", "name": "Resolving Errors"},
             {"slug": "overops-install-portal-deployment-models", "id": "", "name": "Installation"},
             {"slug": "the-dashboard-overview", "id": "", "name": "Classic  Dashboard"},
             {"slug": "advanced-settings-1", "id": "", "name": "Advanced Configuration"},
             {"slug": "collector-properties", "id": "", "name": "Collector Advanced Settings"},
             {"slug": "agent-properties", "id": "", "name": "Agents Advanced Settings"},
             {"slug": "upgrading-overops", "id": "", "name": "Upgrading or Uninstalling OverOps"},
             {"slug": "installation-site-map", "id": "", "name": "Installation Links"},
             {"slug": "configure-your-integrations", "id": "", "name": "Integrations"},
             {"slug": "publishing-metrics", "id": "", "name": "Reporting and Publishing Metrics"},
             {"slug": "overops-security-protocols", "id": "", "name": "Security"},
             {"slug": "build-tools", "id": "", "name": "Build Tools"},
             {"slug": "deployment-automation", "id": "", "name": "Deployment Automation"},
             {"slug": "naming-your-application-server-deployment", "id": "", "name": "OverOps Switches"},
             {"slug": "account-settings", "id": "", "name": "Adminstration Settings"},
             {"slug": "attach-a-micro-agent", "id": "", "name": "Attaching the Agent"},
             {"slug": "overops-tutorials", "id": "", "name": "Tutoricals"}
];


// Delete old indexs based on "old Version number"
// ---------------------------------
// Make sure to set the version numbers in the configuration.js file !!!!!!!
// ---------------------------------

getslugs(urls);




function readReadme(url) {

    var data = JSON.stringify(false);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {

        //callback function once completed!

        if (this.readyState === this.DONE) {

            // Begin accessing JSON data here
            obj = JSON.parse(this.responseText);
           // console.log(obj.title);

           // console.log(obj);
            if ((obj !== null) && (typeof obj._id != 'undefined')) {

              //  console.log(obj.category);
                index = urls.findIndex((obj => obj.slug == url.slug));

                updateUrlId(index, obj.category);
       

            } // obj !== null
        } // readystate == done
    });

    //console.log("zenConfig", zenConfig);
    //console.log("adminkey:", zenConfig.auth.readmeAdminKey);
    xhr.open("GET", "https://dash.readme.io/api/v1/docs/" + url.slug);
    xhr.setRequestHeader("x-readme-version", zenConfig.auth.DocVersion_current);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Basic " + zenConfig.auth.readmeAdminKey);
    xhr.send(data);

}



function updateUrlId(index, newid) {
  
  //  console.log("before Update: ", urls[index]);
    urls[index].id= newid;
    console.log("Slug: ", urls[index]);
}









function translateCategory(id) {

    var categoryobj = jsonQuery('[id=' + id + ']', {
        data: catjson
    });

    console.log("categoryobj: ", categoryobj.value);
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
    } else if (id == '5c879d6a2b0dbc00203fc2e4') {
        version = "4.32";
        return version;
    } else if (id == '5cab5e89c994f600504111b5') {
        version = "4.34";
        return version;
    } else if (id == '5ccfe882bdd50b0014f9a394') {
        version = "4.37";
        return version;
    } else if (id == '5d384352d4c29e02e0245c0b') {
        version = "4.41";
        return version;
    } else if (id == '5d70cecfbb9cfc01c088d9a9') {
        version = "4.43";
        return version;
    } else {

        version = id;
        return version;
    }
}



function getslugs(urls) {

    for (url of urls) {
        // do stuff
        readReadme(url);
    
    }
}
