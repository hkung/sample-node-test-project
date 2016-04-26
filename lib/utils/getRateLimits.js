"use strict";

var tokens = require("../../twitterAuthTokens.js");
var twitterOAuth = require("../../lib/twitterOAuth.js");

var client = new twitterOAuth();

client.oauth.get(
  client.baseUrl + "/application/rate_limit_status.json?resources=saved_searches",
  client.token,
  client.secret,
  (err, body, response) => {
    console.log(body);
  }
);
