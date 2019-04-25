var express = require('express');
var router = express.Router();
var db = require('../database/dbHelper');


/* GET users listing. */
router.get('/getUsers', function(req, res) {
    res.header('Content-Type', 'application/json');

    if (req.query.hasOwnProperty('id'))
    {
        console.info('Id=', req.query.id);
        query = db.Operation("SELECT * FROM " + process.env.USERS_TABLE + " WHERE id = " + req.query.id + " LIMIT 1");
    }
    else
    {
        query = db.Operation("SELECT * FROM " + + process.env.USERS_TABLE);
        console.info("Nu exista id, se vor selecta toti");
    }


    query.then(function(result) {
            //console.log("[RESULT] ", result);
            //return result;
            res.send(result);

        },
        function(err) {
            //console.error(err);
            res.send(err);
        }
    );

    console.log('Query still executing...')
});

router.post('/addUser', function(req, res) {
    res.header('Content-Type', 'application/json');

    let query, response;

    var username = req.body.username;
    var pass = req.body.password;
    var role = req.body.role;

    sql_string = "INSERT INTO " + process.env.USERS_TABLE + " (username, password, role) VALUES('" + username + "', '" + pass + "', '" + role + "')";
    query = db.Operation(sql_string);

    query.catch(function(err) {
        //console.error(err);
        response = {"Status": 0, "Desc": err}
        res.send(response);
    });

    query.then(function(result) {
            //console.log("[RESULT] ", result);
            //return result;
            response = {"Status": 1, "Desc": "User inserted succesfully"}
            res.send(response);

        },
        function(err) {
            //console.error(err);
            response = {"Status": 0, "Desc": err}
            res.send(response);
        }

    );

    console.log('Query still executing...')

});

module.exports = router;
