module.exports = {

    /* 
     * 
     */

    getVersionsbyID: (client, Id) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('versions')
                .find({
                    _id: Id
                })
                // .project({
                //   first_name: 1,
                //   last_name: 1,
                //   username: 1,
                //   email: 1,
                //   auth_token: 1,
                // })
                .limit(1)
                .toArray((err, data) => {
                    (err || data.length === 0) ?
                    resolve({ error: 'no data' }): resolve(data[0]);
                });
        })
    ),


    updateVersions: (client, version) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('versions')
                .updateOne({
                        version: version.version
                    }, {
                        $set: versionJson(version)
                    }, {
                        upsert: true
                    },
                    function(err, data) {
                        // console.log("data: ", data);
                        // assert.equal(null, err);
                        if (err) {
                            console.log("UpdateError: ", err);
                            reject(err);
                        }
                        resolve(data);
                    }
                )
        })),

    deleteVersions: (client) => (
        new Promise((resolve, reject) => {
            client
                .db('algolia')
                .collection('versions')
                .drop(function(err, delOK) {
                    if (err) {
                        console.log("Error: ", err);
                        resolve("Versions does not exist!")
                    }
                    if (delOK) {
                        console.log("Versions deleted!");
                        resolve(delOK);
                    }
                })
                // close(client);
        }))



}


function versionJson(version) {


    versionjson = {}
    versionjson["_id"] = version._id;
    versionjson["is_deprectated"] = version.is_deprecated;
    versionjson["is_hidden"] = version.is_hidden;
    versionjson["is_beta"] = version.is_beta;
    versionjson["is_stable"] = version.is_stable;
    versionjson["codename"] = version.codename;
    versionjson["version"] = version.version;

    return versionjson;
}