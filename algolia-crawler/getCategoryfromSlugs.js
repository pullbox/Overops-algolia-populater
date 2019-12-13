const axios = require('axios');
var htmlToText = require('html-to-text');
var zenConfig = require('./configuration');
var jsonQuery = require('json-query');
const MongoClient = require('mongodb').MongoClient;




module.exports = class GetCategoryfromSlugs {
    // empty constructor by default



    constructor() {
    }


    getPageData = async function(slug) {
        /* Axios response consists out of the following data:
        * data - the payload returned from the server
        * status - the HTTP code returned from the server
        * statusText - the HTTP status message returned by the server
        * headers - headers sent by server
        * config - the original request configuration
        * request - the request object
        */

        try {
            return await axios({
                url: 'https://dash.readme.io/api/v1/docs/' + slug,
                methods: 'get',
                headers: {
                    'x-readme-version': zenConfig.auth.DocVersion_current,
                    'Content-Type': 'application/json',
                    "Authorization": "Basic " + zenConfig.auth.readmeAdminKey,
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error("API call to readme failed: ", slug, error)

        }
    };
    get getPageData() {
        return this._getPageData;
    }
    set getPageData(value) {
        this._getPageData = value;
    }



    readslugfromDoc = async(slug) => {
        let response
            // Read URL as Promise
        try {
            const response = await this.getPageData(slug)
            return response;
        } catch (e) {
            throw new Error("Error calling getPageData: ", e);
        }
    };

/* 
    readCategoriesfromMongo = async() => {
        const mongoUrl = 'mongodb://localhost:27017/algolia';
        const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
            .catch(err => { console.log(err); });
        if (!client) {
            return;
        }

        try {
            const db = client.db('algolia');
            const cursor = db.collection("categories").find({});
            while (await cursor.hasNext()) {
                const data = await cursor.next();
                readslugfromDoc(slug.slug);
            }

        } catch (err) {
            throw new Error("Error calling mongo: ", e);
        } finally {
           // client.close();
        }
    } */




    getCategoryName(data) {
        //  console.log(obj.category);
        index = data.findIndex((obj => obj.slug == url.slug));
        //upateSlugwithCategory(index, obj.category);
    };

}