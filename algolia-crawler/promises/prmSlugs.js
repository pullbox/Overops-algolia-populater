module.exports = {

    /* 
     * 
     */

    getSlugs: (client, slug) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('slugs')
                .find()
                .toArray((err, data) => {
                    (err || data.length === 0) ?
                    resolve({ error: 'no data' }): resolve(data);
                });
        })
    ),

    getSlugbySlug: (client, slug) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('slugs')
                .find({
                    slug: slug
                })
               
                .limit(1)
                .toArray((err, data) => {
                    (err || data.length === 0) ?
                    resolve({ error: 'no data' }): resolve(data[0]);
                });
        })
    ),



    getSlugbyID: (client, Id ) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('slugs')
                .find({
                    id: Id
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


    updateSlug: (client, category) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('slugs')
                .updateOne({
                        slug: category.slug
                    }, {
                        $set: slugJson(category)
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

    updateSlugId: (client, category) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('slugs')
                .updateOne({
                        slug: category.slug
                    }, {
                        $set: { "id": category.id }
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




    deleteSlugs: (client) => (
        new Promise((resolve, reject) => {
            client
                .db('algolia')
                .collection('slugs')
                .drop(function(err, delOK) {
                    if (err) {
                        console.log("Error: ", err);
                        resolve("Collection Slugs does not exist!")
                    }
                    if (delOK) {
                        console.log("Collection Slugs deleted!");
                        resolve(delOK);
                    }
                })
                // close(client);
        }))



}

