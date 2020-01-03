module.exports = {

    /* 
     * 
     */

    getCategories: (client) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('categories')
                .find()
                .toArray((err, data) => {
                    (err || data.length === 0) ?
                    resolve({ error: 'no data' }): resolve(data);
                });
        })
    ),


    getCategorybySlug: (client, slug) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('categories')
                .find({
                    slug: slug
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


    getCategorybyID: (client, Id ) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('categories')
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


    updateCategory: (client, category) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('categories')
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

    updateCategoryId: (client, category) => (
        new Promise((resolve, reject) => {

            client
                .db('algolia')
                .collection('categories')
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




    deleteCategories: (client) => (
        new Promise((resolve, reject) => {
            client
                .db('algolia')
                .collection('categories')
                .drop(function(err, delOK) {
                    if (err) {
                        console.log("Error: ", err);
                        resolve("Categories does not exist!")
                    }
                    if (delOK) {
                        console.log("Categories deleted!");
                        resolve(delOK);
                    }
                })
                // close(client);
        }))



}


function slugJson(category) {


    categoryjson = {}
    categoryjson["slug"] = category.slug;
    categoryjson["id"] = category.id;
    categoryjson["title"] = category.title;

    return categoryjson;
}