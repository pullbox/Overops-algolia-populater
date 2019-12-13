/* eslint max-len: "off" */
// var zenConfig = require('./configuration');

const Slug = require('../util/Category');
const GetCategoryfromSlugs = require('../getCategoryfromSlugs.js');
const data = new GetCategoryfromSlugs();

const readmeApi = require('../db/readmeApi');
const docs = new readmeApi();
const mongo = require('../db/mongodb');
const prmCategories = require('../promises/prmCategories');

const category_slug = "compatibility";
const category_id = "5dedf7251c00fe00368efb78";



describe('Test Class getCategoryfromSlugs', function() {


    describe('Test Objects', function() {
        test('GetCategoryfromSlugs class is defined', function() {
            expect(GetCategoryfromSlugs).toBeDefined();
        });

        test('GetCategoryfromSlugs object should exist', function() {
            expect(data).toBeInstanceOf(Object);
        });


        test('Slug class is defined', function() {
            expect(Slug).toBeDefined();
            console.log(Slug);
        });

        test('slug object was created', function() {
            expect(slug).toBeInstanceOf(Object);
        });

    });


    describe('Test readmeAPI.js', function() {

        test('Read compatibilty slug from doc ', async() => {
            const actual = await docs.getreadMe("docs", category_slug);
            expect(actual.slug).toBe("compatibility");
        });

        test('Extract "Category" from response', async() => {
            const actual = await data.getPageData(slug);
            expect(actual.category).not.toBeNull();
        });

        //   test('Read Categories from Mongo', async()  => {
        //       const actual = await data.readCategoriesfromMongo();
        //       expect(actual.data.category).not.toBeNull();
        //   });


    });


    describe('Test MongoDB calls', function() {

        it('Read a Category by ID from Mongo', async() => {
            const client = await mongo.connect();
            prmCategories.getCategorybyID(client, category_id)
                .then((actual) => {
                    expect(actual).not.toBeNull();
                    expect(actual.title).toBe("Application Performance Monitoring (APM) Integrations");
                    mongo.close(client);
                });
        });
    });





    describe('Test readmeAPI', function() {

        test('Read document "compatibility"', () => {
            docs.getreadMe("categories", category_slug)
                .then((result) => {
                    expect(response.data.category).not.toBeNull();
                });
        });

    });







});