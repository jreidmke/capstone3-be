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
  piecePortfolio
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /writers/[writerId]/pieces", function() {
    test("get by writer id", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/pieces`).set("authorization", tokens[0]);
        expect(resp.body.pieces).toEqual([{
              id: expect.any(Number),
              writer_id: expect.any(Number),
              title: 'Piece',
              text: 'The text of the piece',
              created_at: expect.any(String),
              updated_at: null
            }]);
    });
    
    test("throws not found error on bad id", async function() {
        const resp = await request(app).get(`/writers/0/pieces`).set("authorization", tokens[0]);
        expect(resp.body).toEqual({ error: { message: 'Writer: 0 Not Found!', status: 404 } })
    });

    test("get piece by id", async function() {
        console.log(piecePortfolio[0].id)
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/pieces/${piecePortfolio[0].id}`).set("authorization", tokens[0]);
        expect(resp.body.piece).toEqual({
            id: expect.any(Number),
            writer_id: expect.any(Number),
            title: 'Piece',
            text: 'The text of the piece',
            created_at: expect.any(String),
            updated_at: null,
            tags: []
          });
    });

    test("throws unauth with no token", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/pieces`);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

})
