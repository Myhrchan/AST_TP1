"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var app = express();
var port = process.env.PORT || '8080';
app.get('/', function (req, res) {
    res.write('Hello world');
    res.send();
});
app.get('/metrics', function (req, res) {
    metrics_1.MetricsHandler.get(function (err, result) {
        if (err)
            throw err;
        if (result == undefined) {
            res.write('no result');
            res.send();
        }
        else
            res.json(result);
    });
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
