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
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/pieces/${piecePortfolio[0].id}`).set("authorization", tokens[0]);
        expect(resp.body.piece).toEqual({
            id: expect.any(Number),
            writer_id: expect.any(Number),
            title: 'Piece',
            text: 'The text of the piece',
            created_at: expect.any(String),
            updated_at: null,
            tags: [{ title: 'cooking', id: 1 }, { title: 'food', id: 2 }]
          });
    });

    test("throws unauth with no token", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/pieces`);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
});

describe("POST/DELETE /writers/[writerId]/pieces/[pieceId]/tags/[tagId]", function() {
    test("add piece to tag", async function() {
      const resp = await request(app).post(`/writers/${piecePortfolio[0].writer_id}/pieces/${piecePortfolio[0].id}/tags/3`).set("authorization", tokens[0]);
      expect(resp.body.newTag).toEqual({ pieceid: expect.any(Number), tagid: 3 });
    });

    test("rejects add piece tag with bad auth", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writer_id}/pieces/${piecePortfolio[0].id}/tags/2`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
    
      test("delete piece tag", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writer_id}/pieces/${piecePortfolio[0].id}/tags/2`).set("authorization", tokens[0]);
        expect(resp.body.removedTag).toEqual({ pieceid: expect.any(Number), tagid: 2 });
    });
    
      test("rejects delete piece tag with bad auth", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writer_id}/pieces/${piecePortfolio[0].id}/tags/2`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
  
  });


  
