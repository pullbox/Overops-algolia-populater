var mongo = require('mongodb');
const HCCrawler = require('headless-chrome-crawler');
const GetCategoryfromSlugs = require('../getCategoryfromSlugs.js');
const data = new GetCategoryfromSlugs();


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
                    readdoc(slug);

                    // writetoMongodb(item, hostname, slug);
                }
                console.log("done");
            })
        }

    });
    // Queue a request
    await crawler.queue('https://doc.overops.com/');
    await crawler.onIdle(); // Resolved when no queue is left
    await crawler.close(); // Close the crawler
})();

readdoc = async function(slug) {
    try {
        const actual = await data.getPageData(slug);
        console.log("Actual data: ", actual);
    } catch (err) {
        console.log("getPageData failed: ", err);
    }

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