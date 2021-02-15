"use strict";

process.env.NODE_ENV='test';

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  tokens,
  testGigs
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /gigs", function() {
    test("works for logged in user", async function() {
        const resp = await request(app).get("/gigs").set("authorization", tokens[0]);
        expect(resp.body.gigs).toEqual([
          {
            id: expect.any(Number),
            platformid: expect.any(Number),
            title: 'gig1',
            description: 'gig1',
            compensation: '50.00',
            isremote: true,
            wordcount: 500,
            isactive: true
          },
          {
            id: expect.any(Number),
            platformid: expect.any(Number),
            title: 'gig2',
            description: 'gig2',
            compensation: '500.00',
            isremote: false,
            wordcount: 100,
            isactive: true
          }])
    });

    test("throws error for non-logged in user", async function() {
      const resp = await request(app).get("/gigs");
      expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("works with one query param filtering", async function() {
      const resp = await request(app).get("/gigs?minWordCount=300").set("authorization", tokens[0]);
      expect(resp.body.gigs).toEqual([
        {
          id: expect.any(Number),
          platformid: expect.any(Number),
          title: 'gig1',
          description: 'gig1',
          compensation: '50.00',
          isremote: true,
          wordcount: 500,
          isactive: true
        }]);
    });

    test("works with two query param filtering", async function() {
      const resp = await request(app).get("/gigs?minWordCount=300&isRemote=false").set("authorization", tokens[0]);
      expect(resp.body).toEqual({gigs: []});
    });

    test("gets gig by id", async function() {
      const resp = await request(app).get(`/gigs/${testGigs[0].id}`).set("authorization", tokens[0]);
      expect(resp.body.gig).toEqual({
        id: expect.any(Number),
        platform_id: expect.any(Number),
        title: 'gig1',
        description: 'gig1',
        compensation: '50.00',
        is_remote: true,
        word_count: 500,
        is_active: true,
        created_at: expect.any(String),
        updated_at: null,
        tags: []
      })
    });

    test("throws error if gig id not found", async function() {
      const resp = await request(app).get("/gigs/0").set("authorization", tokens[0]);
      expect(resp.body).toEqual({ error: { message: 'Gig: 0 Not Found!', status: 404 } });
    });
  });

  describe("PATCH /gigs", function() {


    test("updates a gig", async function() {
      const resp = await request(app).patch(`/platforms/${testGigs[0].platformid}/gigs/${testGigs[0].id}`).send({title: 'gig3'}).set("authorization", tokens[1]);
      expect(resp.body.updatedGig).toEqual({
        id: expect.any(Number),
        platformid: expect.any(Number),
        title: 'gig3',
        description: 'gig1',
        compensation: '50.00',
        isremote: true,
        wordcount: 500,
        isactive: true,
        createdat: expect.any(String),
        updatedat: null
      });
    });

    test("rejects update if not auth", async function() {
      const resp = await request(app).patch(`/platforms/${testGigs[0].platformid}/gigs/${testGigs[0].id}`).send({title: 'gig3'}).set("authorization", tokens[0]);
      expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects update gig with bad json", async function() {
      const resp = await request(app).patch(`/platforms/${testGigs[0].platformid}/gigs/${testGigs[0].id}`).send({blah: null}).set("authorization", tokens[1]);
      expect(resp.body).toEqual({
        error: {
          message: [
            'instance is not allowed to have the additional property "blah"'
          ],
          status: 400
        }
      });
    });
});

describe("POST /gigs", function() {
    test("create a gig", async function() {
      const resp = await request(app).post(`/platforms/${testGigs[0].platformid}/gigs/new`).send({
        "title": "The New Gig",
        "description": "You gotta clean our tables. They are filthy.",
        "compensation": 25.00,
        "isRemote": true,
        "wordCount": 1000,
        "isActive": true
      }).set("authorization", tokens[1]);
      expect(resp.body.newGig).toEqual({
        id: expect.any(Number),
        title: 'The New Gig',
        description: 'You gotta clean our tables. They are filthy.',
        compensation: '25.00',
        platformid: expect.any(Number),
        isremote: true,
        wordcount: 1000,
        isactive: true
      })
    });

    test("rejects new gig if not auth", async function() {
      const resp = await request(app).post(`/platforms/${testGigs[0].platformid}/gigs/new`).send({
        "title": "The New Gig",
        "description": "You gotta clean our tables. They are filthy.",
        "compensation": 25.00,
        "isRemote": true,
        "wordCount": 1000,
        "isActive": true
      }).set("authorization", tokens[0]);
      expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects new gig with bad json", async function() {
      const resp = await request(app).post(`/platforms/${testGigs[0].platformid}/gigs/new`).send({blah: null}).set("authorization", tokens[1]);
      expect(resp.body).toEqual({
        error: {
          message: [
            'instance requires property "title"',
            'instance requires property "description"',
            'instance requires property "compensation"',
            'instance requires property "isRemote"',
            'instance requires property "wordCount"',
            'instance requires property "isActive"',
            'instance is not allowed to have the additional property "blah"'
          ],
          status: 400
        }
      }
  )});
});