module.exports = {

    /* 
     * Axios response consists out of the following data:
        * data - the payload returned from the server
        * status - the HTTP code returned from the server
        * statusText - the HTTP status message returned by the server
        * headers - headers sent by server
        * config - the original request configuration
        * request - the request object
        */

    getDoc: (instance, slug) => (
        new Promise((resolve, reject) => {

            instance.get('/docs/' + slug)
        })
        .then(function(response) {
            if (data.length === 0) {
                console.log("No docs data!");
                resolve("No docs data :", error);
            }
            resolve(response);
        })
        .catch(function(error) {
            console.log("readmeAPI error: ", error);
            throw new Error();
        })
    ),



    getCategory: (instance, slug) => (
        new Promise((resolve, reject) => {

            instance.get('/categories/' + slug)
        })
        .then(function(response) {
            if (data.length === 0) {
                console.log("No docs data!");
                resolve("No docs data :", error);
            }
            resolve(response);
        })
        .catch(function(error) {
            console.log("readmeAPI error: ", error);
            reject("Received Error: ", error);
        })
    )


}
