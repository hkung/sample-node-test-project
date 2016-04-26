"use strict";

var tokens = require("../../twitterAuthTokens.js");
var twitterOAuth = require("../../lib/twitterOAuth.js");

var client = new twitterOAuth();
var testQuery = "a";
for (let i = 0; i < 130; i++) {
  testQuery += "a";
}

console.log("Restoring account...");

client.GetSavedSearches((error, body, response) => {
  if(!error && body) {
    let queries = JSON.parse(body);
    for (let obj of queries) {
      if (obj.query == "baseball" || obj.query == testQuery) {
        client.DestroySavedSearch(obj.id_str);
      }
    }
  }
});

console.log("Account restored.")
