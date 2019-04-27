var express = require('express');
var router = express.Router();
var db = require('../database/dbHelper');
const jwt = require('jsonwebtoken');
const secret_key = Buffer.from(process.env.SECRET).toString('base64')
/* GET users listing. */
router.get('/getUsers', addAccessControl, function (req, res) {
    res.header('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.query.hasOwnProperty('id')) {
        console.info('Id=', req.query.id);
        query = db.Operation("SELECT id, username, role, created_at FROM " + process.env.USERS_TABLE + " WHERE id = " + req.query.id + " LIMIT 1");
    } else {
        query = db.Operation("SELECT id, username, role, created_at FROM " + +process.env.USERS_TABLE);
        console.info("Nu exista id, se vor selecta toti");
    }


    query.then(function (result) {
            //console.log("[RESULT] ", result);
            //return result;
            res.send(result);

        },
        function (err) {
            //console.error(err);
            res.send(err);
        }
    );

    console.log('Query still executing...')
});

router.get('/getUserId', addAccessControl, verifyToken, function (req, res) {
    jwt.verify(req.token, secret_key, function (err, decode) {
        if (err) {
            res.sendStatus(401);
        } else {

           // res.send(decode);
            res.header('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            if (decode.data.hasOwnProperty('username')) {
                console.info('Username=', decode.data.username);
                query = db.Operation("SELECT id FROM " + process.env.USERS_TABLE + " WHERE username = '" + decode.data.username + "' LIMIT 1");
                query.then(function (result) {
                        //console.log("[RESULT] ", result);
                        //return result;
                        res.send(result[0]);

                    },
                    function (err) {
                        //console.error(err);
                        res.send(err);
                    }
                );

            } else {
                response = {"Error": "Username not specified"};
                res.send(response);
            }
            console.log('Query still executing...')

        }
    });
});

router.get('/getUsers', addAccessControl, function (req, res) {
    res.header('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.query.hasOwnProperty('id')) {
        console.info('Id=', req.query.id);
        query = db.Operation("SELECT * FROM " + process.env.USERS_TABLE + " WHERE id = " + req.query.id + " LIMIT 1");
    } else {
        query = db.Operation("SELECT * FROM " + +process.env.USERS_TABLE);
        console.info("Nu exista id, se vor selecta toti");
    }


    query.then(function (result) {
            //console.log("[RESULT] ", result);
            //return result;
            res.send(result);

        },
        function (err) {
            //console.error(err);
            res.send(err);
        }
    );

    console.log('Query still executing...')
});


router.post('/addUser', addAccessControl,  function (req, res) {
    res.header('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    let query, response;

    var username = req.body.username;
    var pass = req.body.password;
    var role = req.body.role;

    sql_string = "INSERT INTO " + process.env.USERS_TABLE + " (username, password, role) VALUES('" + username + "', '" + pass + "', '" + role + "')";
    query = db.Operation(sql_string);

    query.catch(function (err) {
        //console.error(err);
        response = {"Status": 0, "Desc": err}
        res.send(response);
    });

    query.then(function (result) {
            //console.log("[RESULT] ", result);
            //return result;
            response = {"Status": 1, "Desc": "User inserted succesfully"}
            res.send(response);

        },
        function (err) {
            //console.error(err);
            response = {"Status": 0, "Desc": err}
            res.send(response);
        }
    );

    console.log('Query still executing...')

});


router.post('/validateUser', addAccessControl, function (req, res) {
    res.header('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    let query, response;

    var username = req.body.username;
    var pass = req.body.password;

    sql_string = "SELECT id, role FROM " + process.env.USERS_TABLE + " WHERE username = '" + username + "' AND password = '" + pass + "' LIMIT 1";
    query = db.Operation(sql_string);

    query.catch(function (err) {
        //console.error(err);
        response = {"Status": 0, "Desc": err};
        res.send(response);
    });

    query.then(function (result) {
            //console.log("[RESULT] ", result);
            //return result;
            if (result.length > 0) {
                data = {"Status": 1, "id": result[0].id, "username": username, "role": result[0].role};
                jwt.sign({data}, secret_key, {expiresIn: '2d'}, (err, token) => {
                    res.json({
                        token
                    });
                });
            } else {
                response = {"Status": 0, "Desc": "Username or password is not correct"};
                res.send(response);
            }


        },
        function (err) {
            //console.error(err);
            response = {"Status": 0, "Desc": err}
            res.send(response);
        }
    );

    console.log('Query still executing...')

});

// Verify Token
function addAccessControl(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Next middleware
        next();
    } else {
        // Forbidden
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.sendStatus(401);
    }
}

module.exports = router;
