var express = require('express');
var router = express.Router();
var db = require('../database/dbHelper');

/* GET users listing. */
router.get('/getUsers', function(req, res) {
  res.header('Content-Type', 'application/json');

    let query;

    if (req.query.hasOwnProperty('id')) {
        console.info('Id=', req.query.id);
        query = db.Operation("SELECT * FROM Users WHERE id = " + req.query.id + " LIMIT 1");
    } else {
        query = db.Operation("SELECT * FROM Users");
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

module.exports = router;
