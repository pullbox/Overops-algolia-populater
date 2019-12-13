const axios = require('axios');
var zenConfig = require('../configuration');

module.exports = class readmeAPI {
    constructor() {}


    getreadMe = async function(type, slug) {
        /* Axios response consists out of the following data:
         * data - the payload returned from the server
         * status - the HTTP code returned from the server
         * statusText - the HTTP status message returned by the server
         * headers - headers sent by server
         * config - the original request configuration
         * request - the request object
         */

        const headeroption = {
            headers: {
                'x-readme-version': zenConfig.auth.DocVersion_current,
                'Content-Type': 'application/json',
                "Authorization": "Basic " + zenConfig.auth.readmeAdminKey,
                'Accept': 'application/json'
            }
        };

        try {
            let url = 'https://dash.readme.io/api/v1/' + type + "/" + slug;
            //  console.log("URL: ", url);
            return await axios.get(url, headeroption);
        } catch (error) {
            console.error("readmeAPI.js catch error: ", slug, error)

        }
    };

    get getreadMe() {
        return this._getreadMe;
    }
    set getreadMe(value) {
        this._getreadMe = value;
    }


}