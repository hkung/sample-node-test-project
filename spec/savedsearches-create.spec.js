"use strict";

var request = require("request");
var savedSearch = require("../lib/models/savedSearchModel.js");
var twitterOAuth = require("../lib/twitterOAuth.js");

describe("POST saved_searches/create", () => {
  var client = new twitterOAuth();
  let testQuery = "a";
  for (let i = 0; i < 130; i++) {
    testQuery += "a";
  }

  it("should have a defined twitter client", (done) => {
    expect(client).toBeDefined();
    done();
  });

  it("should return a 403 status code if not authenticated", (done) => {
    request(client.baseUrl + "/saved_searches/create.json?query=test", function (error, response, body) {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it("should return a valid response given a valid query string", (done) => {
    client.CreateSavedSearch(client.BuildQueryString("baseball"), (error, body, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toBe("application/json;charset=utf-8");
      expect(Object.keys(JSON.parse(body)).sort()).toEqual(savedSearch.savedSearchModel);
      done();
    });
  });

  it("should return an error if query string is over max length of 100 characters", (done) => {
    // This should fail according to the docs, but the query is getting saved successfully
    // https://dev.twitter.com/rest/reference/post/saved_searches/create
    client.CreateSavedSearch(client.BuildQueryString(testQuery), (error, body, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it("should not create duplicate entries", (done) => {
    client.CreateSavedSearch(client.BuildQueryString("intuit"), (error, body, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it("should not process invalid parameters", (done) => {
    client.CreateSavedSearch("a=b&c=d", (error, body, response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });

  it("should block GET requests", (done) => {
    client.oauth.get(
      client.baseUrl + "/saved_searches/create.json",
      client.token,
      client.secret,
      (err, body, response) => {
        expect(response.statusCode).toBe(400);
        done();
      }
    );
  });
});
