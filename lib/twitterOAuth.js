"use strict";

var oauth = require("oauth");
var queryString = require("querystring");
var tokens = require("../twitterAuthTokens.js");

function twitterOAuth () {
  this.token = tokens.token,
  this.secret = tokens.secret,
  this.baseUrl = "https://api.twitter.com/1.1",
  this.oauth = new oauth.OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    tokens.consumerKey,
    tokens.consumerSecret,
    "1.0A",
    null,
    "HMAC-SHA1"
  );
}

twitterOAuth.prototype.CreateSavedSearch = function (query, callback) {
  this.oauth.post(
    this.baseUrl + "/saved_searches/create.json" + query,
    tokens.token,
    tokens.secret,
    null,
    "application/x-www-form-urlencoded",
    (err, body, response) => {
      callback(err, body, response);
    }
  );
};

twitterOAuth.prototype.DestroySavedSearch = function (id) {
  if(!id){
    return;
  }

  this.oauth.post(
    this.baseUrl + "/saved_searches/destroy/" + id + ".json",
    tokens.token,
    tokens.secret,
    null,
    "application/x-www-form-urlencoded",
    (err, body, response) => {
      if (err || response.statusCode !== 200) {
        console.log(err);
      }
    }
  );
}

twitterOAuth.prototype.GetSavedSearches = function (callback) {
  this.oauth.get(
    this.baseUrl + "/saved_searches/list.json",
    tokens.token,
    tokens.secret,
    (err, body, response) => {
      callback(err, body, response);
    }
  );
}

twitterOAuth.prototype.BuildQueryString = function (value) {
    if (value) {
        return "?" + queryString.stringify({ query: value });
    }
    return "";
};

module.exports = twitterOAuth;
