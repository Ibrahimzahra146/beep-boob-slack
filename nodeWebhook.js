'use strict';


const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');
const request = require('request');
const JSONbig = require('json-bigint');
const async = require('async');

const REST_PORT = (process.env.PORT || 5000);
const sessionIds = new Map();
const app = express();
app.use(bodyParser.text({ type: 'application/json' }));


app.post('/webhook/', (req, res) => {
    try {
        var data = JSONbig.parse(req.body);
        data=data.result.action;
        var result={"speech":data};
       return result;
    } catch (err) {
        return res.status(400).json({
            status: "error",
            error: err
        });
    }

});

app.listen(REST_PORT, () => {
    console.log('Rest service ready on port ' + REST_PORT);
});

