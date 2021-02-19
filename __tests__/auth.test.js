"use strict";

process.env.NODE_ENV='test';

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/login", function () {
    test("works", async function () {
      console.log(process.env.NODE_ENV);
      const resp = await request(app)
          .post("/auth/login")
          .send({
            email: "maria@gmail.com",
            password: "password",
          });
      expect(resp.body).toEqual({
        "token": expect.any(String),
      });
    });
  
    test("unauth with non-existent user", async function () {
      const resp = await request(app)
          .post("/auth/login")
          .send({
            email: "no-such-user",
            password: "password1",
          });
      expect(resp.statusCode).toEqual(401);
    });

    test("unauth with wrong password", async function () {
      const resp = await request(app)
          .post("/auth/login")
          .send({
            email: "maria@gmail.com",
            password: "nope",
          });
      expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing data", async function () {
      const resp = await request(app)
          .post("/auth/login")
          .send({
            email: "maria@gmail.com",
          });
      expect(resp.statusCode).toEqual(400);
    });
});

describe("POST /auth/register", function() {
    test("works for writer", async function() {
      const resp = await request(app)
                          .post("/auth/register")
                          .send({
                            email: "jreid@gmail.com",
                            password: "password",
                            imageUrl: "picture", 
                            address1: "1430 Bilarda Ct.", 
                            address2: null, 
                            city: "Geneva", 
                            state: "IL", 
                            postalCode: 60134, 
                            phone: "630-338-5693", 
                            twitterUsername: "tessa",
                            facebookUsername: "tessa",
                            youtubeUsername: "tessa", 
                            firstName: "James", 
                            lastName: "Reid", 
                            age: 24, 
                            bio: "I am a writer."});
          expect(resp.statusCode).toEqual(201);
          expect(resp.body).toEqual({
            "token": expect.any(String),
          });                    
    });
    test("works for platform", async function() {
      const resp = await request(app)
                          .post("/auth/register")
                          .send({
                            email: "new-platform@gmail.com",
                            password: "password",
                            imageUrl: "picture", 
                            address1: "1430 Bilarda Ct.", 
                            address2: null, 
                            city: "Geneva", 
                            state: "IL", 
                            postalCode: 60134, 
                            phone: "630-338-5693", 
                            twitterUsername: "platform",
                            facebookUsername: "platform",
                            youtubeUsername: "platform", 
                            displayName: "The New Platform",
                            description: "This is a new platform"});
          expect(resp.statusCode).toEqual(201);
          expect(resp.body).toEqual({
            "token": expect.any(String),
          });       
    });
    test("rejects with duplicate email", async function() {
      const resp = await request(app)
                          .post("/auth/register")
                          .send({
                            email: "platform@gmail.com",
                            password: "password",
                            imageUrl: "picture", 
                            address1: "1430 Bilarda Ct.", 
                            address2: null, 
                            city: "Geneva", 
                            state: "IL", 
                            postalCode: 60134, 
                            phone: "630-338-5693", 
                            twitterUsername: "platform",
                            facebookUsername: "platform",
                            youtubeUsername: "platform", 
                            displayName: "The Platform",
                            description: "This is a new platform"});
          expect(resp.statusCode).toEqual(400); 
    });
    test("rejects with null required fields", async function() {
            const resp = await request(app)
                          .post("/auth/register")
                          .send({
                            email: null,
                            password: null,
                            imageUrl: "picture", 
                            address1: null, 
                            address2: null, 
                            city: "Geneva", 
                            state: "IL", 
                            postalCode: 60134, 
                            phone: "630-338-5693", 
                            twitterUsername: "platform",
                            facebookUsername: "platform",
                            youtubeUsername: "platform", 
                            displayName: "The Platform",
                            description: "This is a new platform"});
          expect(resp.statusCode).toEqual(400);
    })
});
