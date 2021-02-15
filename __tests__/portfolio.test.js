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
  piecePortfolio
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /writers/[writerId]/portfolios", function() {
    test("get by writer id", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/portfolios`).set("authorization", tokens[0]);
        expect(resp.body.portfolios).toEqual([
            {
              id: expect.any(Number),
              writer_id: expect.any(Number),
              title: 'Portfolio',
              created_at: expect.any(String),
              updated_at: null
            }
          ]);
    }); 

    test("get portfolio by id", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/portfolios/${piecePortfolio[1].id}`).set("authorization", tokens[0]);
        expect(resp.body.portfolio).toEqual({created_at: expect.any(String), 
                                             id: expect.any(Number), 
                                             pieces: [], 
                                             title: "Portfolio", 
                                             updated_at: null, 
                                             writer_id: expect.any(Number)});
    });

    test("throws not found error on bad id", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/portfolios/0`).set("authorization", tokens[0]);
        console.log(resp.body);
        expect(resp.body).toEqual({ error: { message: 'Portfolio: 0 Not Found!', status: 404 } })
    });

    test("throws unauth with no token", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/portfolios`);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
});

//update

//delete

//update

//add/delete tag