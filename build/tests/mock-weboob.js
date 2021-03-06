// Generated by CoffeeScript 1.7.1
var accounts, nock, operations, options;

if ((process.env.NODE_ENV == null) || process.env.NODE_ENV === "development") {
  nock = require('nock');
  options = {
    allowUnmocked: true
  };
  accounts = nock('http://localhost:9101', options).persist().log(console.log).defaultReplyHeaders({
    'content-type': 'application/json; charset=utf-8'
  }).filteringPath(/bank\/[a-z]+\//g, 'bank/societegenerale/').filteringRequestBody(function(path) {
    return {
      "login": "12345",
      "password": "54321"
    };
  }).post('/connectors/bank/societegenerale/', {
    "login": "12345",
    "password": "54321"
  }).reply(200, require('./fixtures/weboob/accounts'));
  operations = nock('http://localhost:9101', options).persist().log(console.log).defaultReplyHeaders({
    'content-type': 'application/json; charset=utf-8'
  }).filteringPath(/bank\/[a-z]+\//g, 'bank/societegenerale/').filteringRequestBody(function(path) {
    return {
      "login": "12345",
      "password": "54321"
    };
  }).post('/connectors/bank/societegenerale/history', {
    "login": "12345",
    "password": "54321"
  }).reply(200, require('./fixtures/weboob/operations'));
}
