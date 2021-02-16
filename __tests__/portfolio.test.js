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
        expect(resp.body).toEqual({ error: { message: 'Portfolio: 0 Not Found!', status: 404 } })
    });

    test("throws unauth with no token", async function() {
        const resp = await request(app).get(`/writers/${piecePortfolio[0].writer_id}/portfolios`);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
});

describe("PATCH /writers/[writerId]/portfolios/[portfolioId]", function() {
    test("updates portfolio", async function() {
        const resp = await request(app).patch(`/writers/${piecePortfolio[0].writer_id}/portfolios/${piecePortfolio[1].id}`).send({title: 'Updated Title'}).set("authorization", tokens[0]);
        expect(resp.body.updatedPortfolio).toEqual({
            id: expect.any(Number), 
            writer_id: expect.any(Number), 
            title: 'Updated Title',
            created_at: expect.any(String), 
            updated_at: null
          });
    });

    test("rejects update portfolio on bad auth", async function() {
        const resp = await request(app).patch(`/writers/${piecePortfolio[0].writer_id}/portfolios/${piecePortfolio[1].id}`).send({title: 'Updated Title'}).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects update portfolio on bad json", async function() {
        const resp = await request(app).patch(`/writers/${piecePortfolio[0].writer_id}/portfolios/${piecePortfolio[1].id}`).send({blech: 'Updated Title'}).set("authorization", tokens[0]);
        expect(resp.body).toEqual({ error: { message: 'Must change title!', status: 400 } });
    });

    test("rejects update portfolio if portfolio does not belong to writer", async function() {
        const resp = await request(app).patch(`/writers/${piecePortfolio[0].writer_id}/portfolios/${piecePortfolioAuthCheck[1].id}`).send({title: 'Updated Title'}).set("authorization", tokens[0]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    })
});

describe("DELETE /writers/[writerId]/portfolios/[portfolioId]", function() {
    test("deletes portfolio", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writer_id}/portfolios/${piecePortfolio[1].id}`).set("authorization", tokens[0]);
        expect(resp.body.deleted).toEqual({
            id: expect.any(Number), 
            writer_id: expect.any(Number), 
            title: 'Portfolio',
            created_at: expect.any(String), 
            updated_at: null});
    });

    test("rejects delete on bad auth", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writer_id}/portfolios/${piecePortfolio[1].id}`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects delete on if piece does not belong to writer", async function() {
        const resp = await request(app).delete(`/writers/${piecePortfolio[0].writer_id}/portfolios/${piecePortfolioAuthCheck[1].id}`).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });
});

describe("POST /writers/[writerId]/portfolios/", function() {
    test("creates new portfolio", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writer_id}/portfolios/new`).send({title: 'New Title'}).set("authorization", tokens[0]);
        expect(resp.body.newPortfolio).toEqual({
            id: expect.any(Number), 
            writerid: expect.any(Number), 
            title: 'New Title',
          })
    });

    test("rejects on bad auth", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writer_id}/portfolios/new`).send({title: 'New Title'}).set("authorization", tokens[1]);
        expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects on bad json", async function() {
        const resp = await request(app).post(`/writers/${piecePortfolio[0].writer_id}/portfolios/new`).send({blech: 'New Title'}).set("authorization", tokens[0]);
        expect(resp.body.error).toEqual({ message: 'Must inlude property Title', status: 400 });
    });
});

//add piece to portfolio