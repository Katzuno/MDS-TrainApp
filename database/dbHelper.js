var express = require('express');
var dotenv = require('dotenv').config();
var mysql = require('mysql');
var util = require('util');


const server_ip = process.env.SERVER;
const username = process.env.USER;
const pass = process.env.PASSWORD;
const db = process.env.DATABASE;



var dbEngine = mysql.createConnection({
    host: server_ip,
    user: username,
    password: pass,
    database: db
});


var query = util.promisify(dbEngine.query).bind(dbEngine);


module.exports = {
    Connect:
        dbEngine.connect(function (err) {
            if (err) {
                console.warn(err);
            }
            console.log("Succesfully connected to MySQL Database!");
        }),
    Operation:
        async function (query_string) {
            try {
                console.info(query_string);
                return await query(query_string);
            } catch (err) {
                console.info(err);
            }
        }
};
