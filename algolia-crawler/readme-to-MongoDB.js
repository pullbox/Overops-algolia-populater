var mongo = require('mongodb');
const HCCrawler = require('headless-chrome-crawler');


deletelugsMongodb();

(async() => {
    const crawler = await HCCrawler.launch({
        // Function to be evaluated in browsers
        evaluatePage: (() => ({
            title: $('title').text(),
        })),
        // Function to be called with evaluated results from browsers
        onSuccess: result => {

            result.links.forEach(async(item) => {
                console.log(item);
                var slug = item.substring(item.lastIndexOf('/') + 1);

                var hostname = (new URL(item)).hostname;

                if (hostname == "doc.overops.com") {
                    writetoMongodb(item, hostname, slug);
                }
                console.log("done");
            })
        }

    });
    // Queue a request
    await crawler.queue('https://doc.overops.com/');
    // Queue multiple requests
    //await crawler.queue(['https://example.net/', 'https://example.org/']);
    // Queue a request with custom options
    //await crawler.queue({
    //url: 'https://example.com/',
    // Emulate a tablet device
    //device: 'Nexus 7',
    // Enable screenshot by passing options
    //screenshot: {
    //  path: './tmp/example-com.png'
    //},
    //});
    await crawler.onIdle(); // Resolved when no queue is left
    await crawler.close(); // Close the crawler
})();




function deletelugsMongodb() {

    var mongoclient = mongo.MongoClient;
    var mongoUrl = 'mongodb://localhost:27017/algolia';


    mongoclient.connect(mongoUrl, function(err, db) {
        if (err) {
            console.error(err);
            throw err;
        }

        var dbo = db.db("algolia");

        dbo.collection("slugs").drop(function(err, delOK) {
            if (err) throw err;
            if (delOK) console.log("Collection deleted");
            db.close();
        });
    });
}






function createJSON(pageurl, hostname, slug) {
    jsonObj = [];

    page = {}
    page["url"] = pageurl;
    page["hostname"] = hostname;
    page["slug"] = slug;
    page["source"] = "Documentation";


    // console.log("page: ", page);

    return page;
}





function writetoMongodb(pageurl, hostname, slug) {

    var mongoclient = mongo.MongoClient;
    var mongoUrl = 'mongodb://localhost:27017/algolia';


    mongoclient.connect(mongoUrl, function(err, db) {
        if (err) {
            console.error(err);
            throw err;
        }

        var dbo = db.db("algolia");


        //    dbo.collection("slugs").insertOne(JSON.stringify(createJSON(pageurl, hostname, slug)), function(err, res) {


        // db.city.update({_id:ObjectId("584a13d5b65761be678d4dd4")}, {"citiName" : "Jakarta Selatan", "provName" : "DKI Jakarta"}, {upsert:true})
        //   dbo.collection("slugs").insertOne(createJSON(pageurl, hostname, slug), function(err, res) {

        var query = {}
        query["slug"] = slug;
        console.log("query:", query);


        dbo.collection("slugs").updateOne(query, { $set: createJSON(pageurl, hostname, slug) }, { upsert: true }, function(err, res) {
            if (err) {
                console.error(err);
                throw err;
            }
            console.log("DB added / updated", pageurl);
            db.close();

        });
    });

}