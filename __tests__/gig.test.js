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
} = require("./_testCommon");


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /gigs", function() {
    test("works for logged in user", async function() {
        const resp = await request(app).get("/gigs").set("authorization", tokens[0]);
        expect(resp.body.gigs).toEqual([
          {
            id: testGigs[0].id,
            platformid: testGigs[0].platformid,
            title: 'gig1',
            description: 'gig1',
            compensation: '50.00',
            isremote: true,
            wordcount: '500',
            isactive: true
          },
          {
            id: testGigs[1].id,
            platformid: testGigs[0].platformid,
            title: 'gig2',
            description: 'gig2',
            compensation: '500.00',
            isremote: false,
            wordcount: '100',
            isactive: true
          }
  ])
    })
});