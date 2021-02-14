"use strict";

process.env.NODE_ENV='test';

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/login", function () {
    test("works", async function () {
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
  
   
  });

//   test("unauth with non-existent user", async function () {
//     const resp = await request(app)
//         .post("/auth/token")
//         .send({
//           username: "no-such-user",
//           password: "password1",
//         });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth with wrong password", async function () {
//     const resp = await request(app)
//         .post("/auth/token")
//         .send({
//           username: "u1",
//           password: "nope",
//         });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("bad request with missing data", async function () {
//     const resp = await request(app)
//         .post("/auth/token")
//         .send({
//           username: "u1",
//         });
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request with invalid data", async function () {
//     const resp = await request(app)
//         .post("/auth/token")
//         .send({
//           username: 42,
//           password: "above-is-a-number",
//         });
//     expect(resp.statusCode).toEqual(400);
//   });