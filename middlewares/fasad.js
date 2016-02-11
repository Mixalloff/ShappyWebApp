
var request = require('request');
var server = "http://ec2-54-200-218-253.us-west-2.compute.amazonaws.com:8080";

var execute = function(data,cb) {
    request(data,function(error,response, body) {
        body = JSON.parse(body);
        if (response.statusCode!=200) {
            body.status = response.statusCode;
            cb(body);
        }
        else {
             cb(null,body);
        }
    })
};
    module.exports = {

     checkToken:  function(data,cb) {
         execute({
             url: server + "/company/companies/me",
             qs: {token: data},
             method: 'GET'
         },cb);
    },

     auth: function(data,cb) {
        execute({
            url: server + "/company/authorize",
            method: 'POST',
            form: {
                login: data.login,
                password: data.password
            }
        },cb);
    },

    getStocks: function(data,cb) {
    execute({
        url: server + "/company/stocks/me",
        method: "GET",
        qs: {token: data}
    },cb);
    },

    getCountStocksPerDate: function(data,cb) {
        execute({
            url: server + "/company/stats/stocksperdate",
            method: "GET",
            qs: {token: data}
        },cb);
    },

    getStatsForStock: function(data,cb) {
        execute({
            url: server + "/company/stats/usersperstock",
            method: "GET",
            qs: {id: data.id, token: data.token}
        },cb);
    },
    getNumberOfSubsribitions: function(data,cb) {
        execute({
            url: server + "/company/stats/countperstock",
            method: "GET",
            qs: {token: data}
        },cb);
    },

    getStockInfo: function(data,cb) {
        execute({
            url: server + "/company/stocks/info",
            method: "GET",
            qs: {id: data.id, token: data.token}
        },cb);
    },

    getCategories: function(cb) {
        execute({
            url: server + "/company/categories/all",
            method: "GET"
        }, cb);
    },
    getStockFunnel: function(data,cb) {
        execute({
            url: server + "/company/stats/stockinfo",
            method: "GET",
            qs: {id: data.id, token: data.token}
        },cb);
    }

};