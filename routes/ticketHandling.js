var express = require('express');
var router = express.Router();
var db = require('../database/dbHelper');
const jwt = require('jsonwebtoken');
const secret_key = Buffer.from(process.env.SECRET).toString('base64')

/* GET users listing. */


router.post('/addTrip', addAccessControl, verifyToken, function (req, res) {
    res.header('Content-Type', 'application/json');

    jwt.verify(req.token, secret_key, function (err, decode) {
        if (err) {
            res.sendStatus(401);
        } else {
            let query, response;
            if (decode.data.role == 2) // daca este admin
            {
                var train_id = req.body.trainId;
                var dep_date = req.body.departureDate;
                var arr_date = req.body.arrivalDate;
                var arr_loc = req.body.arrivalLoc;
                var arr_station = req.body.arrivalStation;
                var dep_loc = req.body.departureLoc;
                var dep_station = req.body.departureStation;
//INSERT INTO `Trips` (`id`, `train_id`, `departure_date`, `arrival_date`, `arrival_loc`, `arrival_station`, `departure_loc`, `departure_station`, `date_added`)
// VALUES (NULL, '1', '2019-05-15 08:00:00', '2019-05-15 16:00:00', 'Iasi', 'Gara Iasi', 'Bucuresti', 'Gara de Nord', CURRENT_TIMESTAMP);

                sql_string = "INSERT INTO " + process.env.TRIPS_TABLE + " (train_id, departure_date, arrival_date, arrival_loc, arrival_station, departure_loc, departure_station) " +
                    "VALUES(" + train_id + ", '" + dep_date + "', '" + arr_date + "', '" + arr_loc + "', '" + arr_station + "', '" + dep_loc + "', '" + dep_station + "')";
                query = db.Operation(sql_string);

                query.catch(function (err) {
                    //console.error(err);
                    response = {"Status": 0, "Desc": err}
                    res.send(response);
                });

                query.then(function (result) {
                        //console.log("[RESULT] ", result);
                        //return result;
                        response = {"Status": 1, "Desc": "Trip inserted succesfully"}
                        res.send(response);

                    },
                    function (err) {
                        //console.error(err);
                        response = {"Status": 0, "Desc": err}
                        res.send(response);
                    }
                );

                console.log('Query still executing...')
            }
            else
            {
                res.sendStatus(403);
            }
        }
    });
});


router.post('/addTicket', addAccessControl, verifyToken, function (req, res) {
    res.header('Content-Type', 'application/json');

    jwt.verify(req.token, secret_key, function (err, decode) {
        if (err) {
            res.sendStatus(401);
        } else {
            let query, response;
            if (decode.data.role == 2) // daca este admin
            {
                var trip_id = req.body.tripId;
                var ticket_price = req.body.price;
                var ticket_type = req.body.ticketType;
//INSERT INTO `Tickets` (`id`, `trip_id`, `price`, `date_added`, `ticket_type`, `bought_times`) VALUES (NULL, '1', '30', CURRENT_TIMESTAMP, '2', '0');

                sql_string = "INSERT INTO " + process.env.TRIPS_TABLE + " (trip_id, price, ticket_type) " +
                    "VALUES(" + trip_id + ", " + ticket_price + ", '" + ticket_type + "')";
                query = db.Operation(sql_string);

                query.catch(function (err) {
                    //console.error(err);
                    response = {"Status": 0, "Desc": err}
                    res.send(response);
                });

                query.then(function (result) {
                        //console.log("[RESULT] ", result);
                        //return result;
                        response = {"Status": 1, "Desc": "Ticket inserted succesfully"}
                        res.send(response);

                    },
                    function (err) {
                        //console.error(err);
                        response = {"Status": 0, "Desc": err}
                        res.send(response);
                    }
                );

                console.log('Query still executing...')
            }
            else
            {
                res.sendStatus(403);
            }
        }
    });
});


router.post('/addTicketType', addAccessControl, verifyToken, function (req, res) {
    res.header('Content-Type', 'application/json');

    jwt.verify(req.token, secret_key, function (err, decode) {
        if (err) {
            res.sendStatus(401);
        } else {
            let query, response;
            if (decode.data.role == 2) // daca este admin
            {
                var ticket_type_desc = req.body.ticketTypeDesc;
                sql_string = "INSERT INTO " + process.env.TRIPS_TABLE + " (desc) " +
                    "VALUES('" + ticket_type_desc + "')";
                query = db.Operation(sql_string);

                query.catch(function (err) {
                    //console.error(err);
                    response = {"Status": 0, "Desc": err}
                    res.send(response);
                });

                query.then(function (result) {
                        //console.log("[RESULT] ", result);
                        //return result;
                        response = {"Status": 1, "Desc": "Ticket inserted succesfully"}
                        res.send(response);

                    },
                    function (err) {
                        //console.error(err);
                        response = {"Status": 0, "Desc": err}
                        res.send(response);
                    }
                );

                console.log('Query still executing...')
            }
            else
            {
                res.sendStatus(403);
            }
        }
    });
});

router.get('/getTrips', addAccessControl, function (req, res) {
    res.header('Content-Type', 'application/json');

    if (req.query.hasOwnProperty('id')) {
        console.info('Id=', req.query.id);
        query = db.Operation("SELECT * FROM " + process.env.TRIPS_TABLE + " WHERE id = " + req.query.id + " LIMIT 1");
    } else {
        query = db.Operation("SELECT * FROM " + +process.env.TRIPS_TABLE);
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

router.get('/getTickets', addAccessControl, function (req, res) {
    res.header('Content-Type', 'application/json');

    if (req.query.hasOwnProperty('id')) {
        console.info('Id=', req.query.id);
        query = db.Operation("SELECT * FROM " + process.env.TICKETS_TABLE + " WHERE id = " + req.query.id + " LIMIT 1");
    } else {
        query = db.Operation("SELECT * FROM " + +process.env.TICKETS_TABLE);
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

router.get('/getTicketTypes', addAccessControl, function (req, res) {
    res.header('Content-Type', 'application/json');

    if (req.query.hasOwnProperty('id')) {
        console.info('Id=', req.query.id);
        query = db.Operation("SELECT * FROM " + process.env.TKTYPES_TABLE + " WHERE id = " + req.query.id + " LIMIT 1");
    } else {
        query = db.Operation("SELECT * FROM " + +process.env.TKTYPES_TABLE);
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
// Verify Token
    function addAccessControl(req, res, next) {
        var responseSettings = {
            "AccessControlAllowOrigin": req.headers.origin,
            "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
            "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
            "AccessControlAllowCredentials": true
        };
        /**
         * Headers
         */
        res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
        res.header("Access-Control-Allow-Origin", responseSettings.AccessControlAllowOrigin);
        res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
        res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

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

            // Next middleware
            next();
        } else {
            // Forbidden
            var responseSettings = {
                "AccessControlAllowOrigin": req.headers.origin,
                "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
                "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
                "AccessControlAllowCredentials": true
            };
            /**
             * Headers
             */
            res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
            res.header("Access-Control-Allow-Origin", responseSettings.AccessControlAllowOrigin);
            res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
            res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

            res.sendStatus(401);
        }
    }

    module.exports = router;
