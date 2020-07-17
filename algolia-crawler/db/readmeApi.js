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
            const response = await axios.get(url, headeroption);
            return response;
        } catch (error) {
            // Error 😨
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                // console.log(error.response.data);
                console.log("Type: " +  type + " Slug:  " + slug)
                console.log(error.response.status);
                console.log(error.response.config.url);
                console.log(error.response.data);
            } else if (error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                console.log(error.request);
            } else {
                // Something happened in setting up the request and triggered an Error
                console.log('Error', error.message);
            }
            //console.log(error);
        }
    };

    get getreadMe() {
        return this._getreadMe;
    }
    set getreadMe(value) {
        this._getreadMe = value;
    }


    /* ----------------------------------------- */
    // Get Version
    /* ----------------------------------------- */



    getVersions = async function(type, slug) {
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
            let url = 'https://dash.readme.io/api/v1/version';
            const response = await axios.get(url, headeroption);
            return response;
        } catch (error) {
            // Error 😨
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                console.log("readmeAPI: ", error.response.data);
                console.log("readmeAPI: ", error.response.status);
                console.log("readmeAPI: ", error.response.headers);
                console.log("readmeAPI: ", slug);
            } else if (error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                console.log("readmeAPI: ", error.request);
            } else {
                // Something happened in setting up the request and triggered an Error
                console.log("readmeAPI: ", error.message);
            }
            console.log("readmeAPI: ", error);
        }
    };

}