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
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /gigs", function() {
    test("works for logged in user", async function() {
        const resp = await request(app).get("/gigs").set("authorization", tokens[0]);
        expect(resp.body.gigs).toEqual([
          {
            id: expect.any(Number),
            platformId: expect.any(Number),
            title: 'gig1',
            description: 'gig1',
            compensation: '50.00',
            isRemote: true,
            wordCount: 500,
            isActive: true
          },
          {
            id: expect.any(Number),
            platformId: expect.any(Number),
            title: 'gig2',
            description: 'gig2',
            compensation: '500.00',
            isRemote: false,
            wordCount: 100,
            isActive: true
          }])
    });

    test("throws error for non-logged in user", async function() {
      const resp = await request(app).get("/gigs");
      expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("works with one query param filtering", async function() {
      const resp = await request(app).get("/gigs?minWordCount=300").set("authorization", tokens[0]);
      expect(resp.body.gigs).toEqual([
        {
          id: expect.any(Number),
          platformId: expect.any(Number),
          title: 'gig1',
          description: 'gig1',
          compensation: '50.00',
          isRemote: true,
          wordCount: 500,
          isActive: true
        }]);
    });

    test("works with two query param filtering", async function() {
      const resp = await request(app).get("/gigs?minWordCount=300&isRemote=false").set("authorization", tokens[0]);
      expect(resp.body).toEqual({gigs: []});
    });

    test("gets gig by id", async function() {
      const resp = await request(app).get(`/gigs/${testGigs[0].id}`).set("authorization", tokens[0]);
      expect(resp.body.gig).toEqual(    {
        id: expect.any(Number),
        platformId: expect.any(Number),
        title: 'gig1',
        description: 'gig1',
        compensation: '50.00',
        isRemote: true,
        wordCount: 500,
        isActive: true,
        tags: [ { title: 'cooking', id: 1 }, { title: 'food', id: 2 } ]
      })
    });

    test("throws error if gig id not found", async function() {
      const resp = await request(app).get("/gigs/0").set("authorization", tokens[0]);
      expect(resp.body).toEqual({ error: { message: 'Gig: 0 Not Found!', status: 404 } });
    });
  });

  describe("PATCH /platforms/[platformId]/gigs/[gigId]", function() {
    test("updates a gig", async function() {
      const resp = await request(app).patch(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}`).send({title: 'gig3'}).set("authorization", tokens[1]);
      expect(resp.body.updatedGig).toEqual({
        id: expect.any(Number),
        platformId: expect.any(Number),
        title: 'gig3',
        description: 'gig1',
        compensation: '50.00',
        isRemote: true,
        wordCount: 500,
        isActive: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    test("rejects update if not auth", async function() {
      const resp = await request(app).patch(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}`).send({title: 'gig3'}).set("authorization", tokens[0]);
      expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects update gig with bad json", async function() {
      const resp = await request(app).patch(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}`).send({blah: null}).set("authorization", tokens[1]);
      expect(resp.body).toEqual({
        error: {
          message: [
            'instance is not allowed to have the additional property "blah"'
          ],
          status: 400
        }
      });
    });
});

describe("POST /platforms/[platformId]/gigs/new", function() {
    test("create a gig", async function() {
      const resp = await request(app).post(`/platforms/${testGigs[0].platformId}/gigs/new`).send({
        "title": "The New Gig",
        "description": "You gotta clean our tables. They are filthy.",
        "compensation": 25.00,
        "isRemote": true,
        "wordCount": 1000,
        "isActive": true
      }).set("authorization", tokens[1]);
      expect(resp.body.newGig).toEqual({
        id: expect.any(Number),
        title: 'The New Gig',
        description: 'You gotta clean our tables. They are filthy.',
        compensation: '25.00',
        platformId: expect.any(Number),
        isRemote: true,
        wordCount: 1000,
        isActive: true
      })
    });

    test("rejects new gig if not auth", async function() {
      const resp = await request(app).post(`/platforms/${testGigs[0].platformId}/gigs/new`).send({
        "title": "The New Gig",
        "description": "You gotta clean our tables. They are filthy.",
        "compensation": 25.00,
        "isRemote": true,
        "wordCount": 1000,
        "isActive": true
      }).set("authorization", tokens[0]);
      expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
    });

    test("rejects new gig with bad json", async function() {
      const resp = await request(app).post(`/platforms/${testGigs[0].platformId}/gigs/new`).send({blah: null}).set("authorization", tokens[1]);
      expect(resp.body).toEqual({
        error: {
          message: [
            'instance requires property "title"',
            'instance requires property "description"',
            'instance requires property "compensation"',
            'instance requires property "isRemote"',
            'instance requires property "wordCount"',
            'instance requires property "isActive"',
            'instance is not allowed to have the additional property "blah"'
          ],
          status: 400
        }
      }
  )});
});

describe("POST/DELETE /platforms/[platformId]/gigs/[gigId]/tags", function() {
  test("add gig to tag", async function() {
    const resp = await request(app).post(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}/tags/3`).set("authorization", tokens[1]);
    expect(resp.body.newTag).toEqual({ gigId: expect.any(Number), tagId: expect.any(Number) });
  });

  test("rejects add gig tag with bad auth", async function() {
    const resp = await request(app).post(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}/tags/3`).set("authorization", tokens[0]);
    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  });

  test("delete gig tag", async function() {
    const resp = await request(app).delete(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}/tags/2`).set("authorization", tokens[1]);
    expect(resp.body.removedTag).toEqual({ gigId: expect.any(Number), tagId: expect.any(Number) });
  });

  test("rejects delete gig tag with bad auth", async function() {
    const resp = await request(app).delete(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}/tags/2`).set("authorization", tokens[0]);
    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  });
});

describe("DELETE /platforms/[platformId]/gigs/[gigId]", function() {
  test("deletes gig", async function() {
    const resp = await request(app).delete(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}`).set("authorization", tokens[1]);
    expect(resp.body.deletedGig).toEqual({compensation: "50.00",
                                          created_at: expect.any(String), 
                                          description: "gig1",
                                          id: expect.any(Number),  
                                          is_active: true, 
                                          is_remote: true, 
                                          platform_id: expect.any(Number),
                                          title: "gig1", 
                                          updated_at: null, 
                                          word_count: 500})
  });
  test("rejects delete gig with bad auth", async function() {
    const resp = await request(app).delete(`/platforms/${testGigs[0].platformId}/gigs/${testGigs[0].id}`).set("authorization", tokens[0]);
    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  })
})