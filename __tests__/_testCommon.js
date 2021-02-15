"use strict";

const db = require("../db.js");
const Application = require("../models/application");
const Gig = require("../models/gig");
const Piece = require("../models/piece");
const Platform = require("../models/platform");
const Portfolio = require("../models/portfolio");
const User = require("../models/user");
const Writer = require("../models/writer");
const { createToken } = require("../helpers/token");

const testGigs = [];
const testApplications = [];
const tokens = []; //writer token idx[0], platform token idx[1]

async function commonBeforeAll() {
    await db.query(`DELETE FROM writers`);
    await db.query(`DELETE FROM platforms`);
    await db.query(`DELETE FROM applications`);
    await db.query(`DELETE FROM gigs`);
    await db.query(`DELETE FROM pieces`);
    await db.query(`DELETE FROM portfolios`);
    await db.query(`DELETE FROM tags`);
    await db.query(`DELETE FROM piece_portfolios`);
    await db.query(`DELETE FROM piece_tags`);
    await db.query(`DELETE FROM gig_tags`);
    await db.query(`DELETE FROM platform_tag_follows`);
    await db.query(`DELETE FROM platform_writer_follows`);
    await db.query(`DELETE FROM writer_platform_follows`);
    await db.query(`DELETE FROM writer_tag_follows`);

    //writer
    const writer = await User.register({email: "maria@gmail.com", 
                        password: "password", 
                        imageUrl: "picture", 
                        address1: "1430 Bilarda Ct.", 
                        address2: null, 
                        city: "Geneva", 
                        state: "Illinois", 
                        postalCode: 60134, 
                        phone: "630-338-5693", 
                        twitterUsername: "tessa",
                        facebookUsername: "tessa",
                        youtubeUsername: "tessa", 
                        firstName: "Maria", 
                        lastName: "Aldapa", 
                        age: 24, 
                        bio: "I am a writer."})

    //platform
    const platform = await User.register({email: "platform@gmail.com", 
                        password: "password", 
                        imageUrl: "platformPic", 
                        address1: "123 Fake Street", 
                        address2: null, 
                        city: "Business", 
                        state: "Corporation", 
                        postalCode: 43253, 
                        phone: "630-338-5543", 
                        twitterUsername: "platform",
                        facebookUsername: "platform",
                        youtubeUsername: "platform",
                        description: "We are a platform",
                        displayName: "The Platform"    
                    });

    tokens[0] = createToken({writerId: writer.writer_id, platformId: null});
    tokens[1] = createToken({writerId: null, platformId:platform.platform_id});

    //gig
    testGigs[0] = await Gig.createGig(platform.platform_id, 
                            {title: 'gig1', 
                            description: 'gig1', 
                            compensation: 50, 
                            isRemote: true, 
                            wordCount: 500});
    testGigs[1] = await Gig.createGig(platform.platform_id, 
                            {title: 'gig2', 
                            description: 'gig2', 
                            compensation: 500, 
                            isRemote: false, 
                            wordCount: 100});

    //portfolio
    const portfolio = await Portfolio.create(writer.writer_id, 'Portfolio');

    //piece
    const piece = await Piece.create(writer.id, 'Piece', 'The text of the piece');

    testApplications[0] = await Application.submitApplication(writer.writer_id, testGigs[0].id, portfolio.id);
    testApplications[1] = await Application.submitApplication(writer.writer_id, testGigs[1].id, portfolio.id);
};

async function commonBeforeEach() {
    await db.query("BEGIN");
}
  
async function commonAfterEach() {
    await db.query("ROLLBACK");
}
  
async function commonAfterAll() {
    await db.end();
}


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testApplications,
    testGigs,
    tokens
};