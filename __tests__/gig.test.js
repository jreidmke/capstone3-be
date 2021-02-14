"use strict";

process.env.NODE_ENV='test';

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  writerToken,
  platformToken,
  testGigs
} = require("./_testCommon");


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe("GET /gigs", function() {
    test("works for logged in user", async function() {
        const resp = await request(app).get("/gigs").set("authorization", writerToken);
        expect(resp.body).toEqual(testGigs)
    })
})