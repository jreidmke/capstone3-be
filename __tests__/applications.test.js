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
  testGigs,
  testApplications
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /writers/[writerId]/applications", function() {
    test("Get's all applications by user id", async function() {
        const resp = await request(app).get(`/writers/${testApplications[0].writerId}/applications`).set("authorization", tokens[0]);
        expect(resp.body.apps).toEqual([{id: expect.any(Number),
                                        gigId:  expect.any(Number),
                                        writerId: testApplications[0].writerId,
                                        portfolioId: testApplications[0].portfolioId,
                                        status: 'Pending',
                                        createdAt: expect.any(String),
                                        firstName: expect.any(String),
                                        lastName: expect.any(String),
                                        portfolioTitle: expect.any(String),
                                        platformId: expect.any(Number),
                                        gigTitle: expect.any(String),
                                        platformName: expect.any(String)
                                    }]);
    });
  

    test("Rejects get user apps on bad auth", async function() {
        const resp = await request(app).get(`/writers/${testApplications[0].writerId}/applications`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
});

describe("POST/DELETE /gigs/[gigId]/apply/writers/[writerId]", function() {
    test("Apply to job", async function() {
        const resp = await request(app).post(`/gigs/${testGigs[1].id}/apply/writers/${testApplications[0].writerId}`).send({portfolioId: testApplications[0].portfolioId}).set("authorization", tokens[0]);
        expect(resp.body.applied).toEqual({ gigId: expect.any(Number), writerId: expect.any(Number), portfolioId: expect.any(Number) });
    });

    test("Reject apply to job on bad auth", async function() {
        const resp = await request(app).post(`/gigs/${testGigs[1].id}/apply/writers/${testApplications[0].writerId}`).send({portfolioId: testApplications[0].portfolioId}).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("withdraw application", async function() {
       const resp = await request(app).delete(`/gigs/${testGigs[0].id}/apply/writers/${testApplications[0].writerId}`).set("authorization", tokens[0]);
       expect(resp.body.withdrawnApp).toEqual({ gigId: expect.any(Number), writerId: expect.any(Number)});
    });

    test("Reject withdraw application on bad auth", async function() {
        const resp = await request(app).delete(`/gigs/${testGigs[0].id}/apply/writers/${testApplications[0].writerId}`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
     });

});