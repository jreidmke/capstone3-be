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
} = require("./_testCommon");


