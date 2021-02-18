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
  piecePortfolio,
  piecePortfolioAuthCheck
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /writers/[writerId]/pieces", function() {
    test("get by writer id", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writerId}/pieces`).set("authorization", tokens[0]);
        expect(resp.body.pieces).toEqual([{
              id: expect.any(Number),
              writerId: expect.any(Number),
              title: 'Piece',
              text: 'The text of the piece',
              createdAt: expect.any(String),
              updatedAt: null
            }]);
    });
    
    test("throws not found error on bad id", async function() {
        const resp = await request(app).get(`/writers/0/pieces`).set("authorization", tokens[0]);
        expect(resp.body).toEqual({ error: { message: 'Writer: 0 Not Found!', status: 404 } })
    });

    test("get piece by id", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}`).set("authorization", tokens[0]);
        expect(resp.body.piece).toEqual({
            id: expect.any(Number),
            writerId: expect.any(Number),
            title: 'Piece',
            text: 'The text of the piece',
            createdAt: expect.any(String),
            updatedAt: null,
            tags: [{ title: 'cooking', id: 1 }, { title: 'food', id: 2 }]
          });
    });

    test("throws unauth with no token", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writerId}/pieces`);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
});

describe("PATCH /writers/[writerId]/piece/[pieceId]", function() {
    test("updates piece", async function() {
        const resp = await request(app).patch(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}`)
                                            .send({title: "New Title", text: "New Text"})
                                            .set("authorization", tokens[0]);
        expect(resp.body.updatedPiece).toEqual({
            id: expect.any(Number),
            writerId: expect.any(Number),
            title: 'New Title',
            text: 'New Text',
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          })
    });

    test("rejects update with bad auth", async function() {
        const resp = await request(app).patch(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}`)
                                        .send({title: "New Title", text: "New Text"})
                                        .set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects update if piece does not belong to writer", async function() {
        const resp = await request(app).patch(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolioAuthCheck[0].id}`)
                                        .send({title: "New Title", text: "New Text"})
                                        .set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects update with bad json", async function() {
        const resp = await request(app).patch(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}`)
                                        .send({blah: "New Title", blech: "New Text"})
                                        .set("authorization", tokens[0]);
        expect(resp.body.error).toEqual({
            message: [
              'instance is not allowed to have the additional property "blah"',
              'instance is not allowed to have the additional property "blech"'
            ],
            status: 400
          })
    })                                  
});

//create piece
describe("POST /writers/[writerId]/pieces", function() {
    test("can post new piece", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writerId}/pieces/new`)
                                            .send({title: "New Title", text: "New Text"})
                                            .set("authorization", tokens[0]);
        expect(resp.body.newPiece).toEqual({
            id: expect.any(Number),
            writerId: expect.any(Number),
            title: 'New Title',
            text: 'New Text',
            createdAt: expect.any(String)
        });
    });
    test("rejects post new piece with bad auth", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writerId}/pieces/new`)
                                            .send({title: "New Title", text: "New Text"})
                                            .set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
    
    test("rejects post new piece with bad json", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writerId}/pieces/new`)
                                            .send({blah: "New Title", blech: "New Text"})
                                            .set("authorization", tokens[0]);
        expect(resp.body.error).toEqual({
            message: [
              'instance requires property "title"',
              'instance requires property "text"',
              'instance is not allowed to have the additional property "blah"',
              'instance is not allowed to have the additional property "blech"'
            ],
            status: 400
          }
      )
    });
});

describe("DELETE /writers/[writerId]/pieces/[pieceId]", function() {
    test("delete piece", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}`).set("authorization", tokens[0]);
        expect(resp.body.deletedPiece).toEqual({
            id: expect.any(Number),
            writer_id: expect.any(Number),
            title: 'Piece',
            text: 'The text of the piece',
            created_at: expect.any(String),
            updated_at: null
        });
    });

    test("rejects delete piece on bad auth", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects delete if piece doesn't belong to author", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolioAuthCheck[0].id}`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
});

describe("POST/DELETE /writers/[writerId]/pieces/[pieceId]/tags/[tagId]", function() {
    test("add piece to tag", async function() {
      const resp = await request(app).post(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}/tags/3`).set("authorization", tokens[0]);
      expect(resp.body.newTag).toEqual({ pieceId: expect.any(Number), tagId: 3 });
    });

    test("rejects add piece tag with bad auth", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}/tags/2`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects add piece tag if piece doesn't belong to writer", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolioAuthCheck[0].id}/tags/2`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
    
    test("delete piece tag", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}/tags/2`).set("authorization", tokens[0]);
        expect(resp.body.removedTag).toEqual({ pieceId: expect.any(Number), tagId: 2 });
    });
    
    test("rejects delete piece tag with bad auth", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolio[0].id}/tags/2`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects delete piece tag if piece doesn't belong to writer", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writerId}/pieces/${piecePortfolioAuthCheck[0].id}/tags/2`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
});


  
