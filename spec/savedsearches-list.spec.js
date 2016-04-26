"use strict";

var request = require("request");
var savedSearch = require("../lib/models/savedSearchModel.js");
var twitterOAuth = require("../lib/twitterOAuth.js");

describe("GET saved_searches/list", () => {
  var client = new twitterOAuth();

  it("should have a defined twitter client", (done) => {
    expect(client).toBeDefined();
    done();
  });

  it("should return a 403 status code if not authenticated", (done) => {
    request(client.baseUrl + "/saved_searches/list.json", (error, response, body) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it("should return a valid response", (done) => {
    client.GetSavedSearches((error, body, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toBe("application/json;charset=utf-8");
      expect(Object.keys(JSON.parse(body)[0]).sort()).toEqual(savedSearch.savedSearchModel);
      done();
    });
  });

  it("should return a valid response when a request is sent with invalid parameters", (done) => {
    client.oauth.get(
      client.baseUrl + "/saved_searches/list.json?query=hi",
      client.token,
      client.secret,
      (err, body, response) => {
        expect(response.statusCode).toBe(200);
        done();
      }
    );
  });

  it("should block non-GET requests with proper messaging", (done) => {
    client.oauth.post(
      client.baseUrl + "/saved_searches/list.json",
      client.token,
      client.secret,
      null,
      "application/x-www-form-urlencoded",
      (err, body, response) => {
        expect(response.statusCode).toBe(400);
        done();
      }
    );
  });
});
