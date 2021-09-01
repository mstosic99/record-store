const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
var jwt = require('jsonwebtoken');
const secretKey = "osecamgolasi";

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const bcrypt = require('bcrypt')

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recordstore',
});


const route = express.Router();

const registerScheme = Joi.object().keys({
    username: Joi.string().min(5).max(45).required(),
    password: Joi.string().min(5).max(50).required(),
    name: Joi.string().min(2).max(25),
    lastname: Joi.string().min(2).max(25),
    email: Joi.string().email(),
    phone: Joi.number()
});

const loginScheme = Joi.object().keys({
    username: Joi.string().min(5).max(45).required(),
    password: Joi.string().min(5).max(50).required()
});

const addressScheme = Joi.object().keys({
    address: Joi.string().min(5).max(45).required(),
    zipcode: Joi.number()
});
route.use(express.json());


route.get('/records', (req, res) => {

    pool.query('select * from Records r INNER JOIN Artists a on r.artist_id = a.artist_id', (err, rows) => {
        if (err) {
            res.status(500).send(err.sqlMessage);
        } else
            res.send(rows);
    });
});


route.get('/records/:id', (req, res) => {
    var query = 'select * from Records where record_id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

route.get('/records/sort/:id', (req, res) => {
    if (req.params.id == 1)
        var col = 'title';
    else if (req.params.id == 2)
        var col = 'genre_id';
    else var col = 'price';
    var query = 'select * from Records order by ' + col + ' ASC';
    pool.query(query, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

route.post('/addresses', (req, res) => {
    var token = req.body.token;
    var decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    var query = 'select * from Addresses where user_id = ?'
    let formated = mysql.format(query, [decoded.user_id]);
    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

route.post('/address', (req, res) => {
    let { error } = addressScheme.validate({ address: req.body.address, zipcode: req.body.zipcode });


    if (error)
        res.status(400).send(error.details[0].message);
    else {
        var decoded = jwt.verify(req.body.token, secretKey);
        let query = "insert into Addresses (address, zipcode, user_id) values (?, ?, ?)";
        let formated = mysql.format(query, [req.body.address, req.body.zipcode, decoded.user_id]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from Addresses where address_id=?';
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

route.post('/get_orders', (req, res) => {
    var token = req.body.token;
    var decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    var query = 'select * from Orders where ? = (select a.user_id from Addresses a where a.address_id = ?)' // Test this
    let formated = mysql.format(query, [decoded.user_id, decoded.user_id]);
    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});


route.post('/orders', (req, res) => {
    var orderId = 0;
    let query = "insert into Orders (datetime, status, price, address_id) values (?, ?, ?, ?)"; // ADDRESS PREKO USER_ID
    var token = req.body.token;
    var decoded = jwt.verify(token, secretKey);
    let queryGetUserId = mysql.format("select user_id from Addresses a where a.user_id = ?", parseInt(decoded.user_id));
    pool.query(queryGetUserId, (err, response) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        // if (response.user_id == null)
        //     res.status(400).send("Address provided doesn't match with the current user."); // TEST
    });
    let formated = mysql.format(query, [new Date().toISOString().slice(0, 19).replace('T', ' '), 0, req.body.price, req.body.address_id]);
    pool.query(formated, (err, response) => {
        // if (req.body.address_id == -1)
        // res.status(500).send('Please select address!');
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            query = 'select * from Orders where order_id=?';
            formated = mysql.format(query, [response.insertId]);

            pool.query(formated, (err, rows) => {
                orderId = rows[0].order_id;

                var cart = req.body.cart;
                for (var i = 0; i < cart.length; i++) {
                    let query = "insert into Carts (order_id, record_id, quantity) values (?, ?, ?)";
                    let format = mysql.format(query, [orderId, cart[i].record_id, cart[i].stock]);
                    pool.query(format, (err, response) => {
                        console.log(err);
                    });
                }
            });
            res.send('{}');
        }
    });

});

route.post('/login', jsonParser, (req, res) => {
    let { error } = loginScheme.validate(req.body);
    console.log(req.body.username)
    console.log(req.body.password)
    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        const username = req.body.username;
        const password = req.body.password;

        if (username && password) {
            console.log(username);
            pool.query('SELECT * FROM Users WHERE username = ?', [username],
                (error, results, fields) => {
                    if (results.length == 0)
                        res.status(400).send('Wrong username/password');
                    else {
                        let pass = results[0].password;
                        console.log(results[0]);
                        console.log(pass);
                        if (bcrypt.compare(password, pass)) {
                            console.log("success");
                            var token = jwt.sign({ user_id: results[0].user_id }, secretKey); // CHECK
                            res.send({ 'token': token });
                        } else {
                            res.send({ 'token': '' });
                        }
                        res.end();
                    }

                });
        } else {
            res.send({ 'token': '' });
            res.end();
        }
    }
});

route.post('/register', jsonParser, (req, res) => {
    let { error } = registerScheme.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).send(error.details[0].message);
    } else {
        console.log('here');
        const username = req.body.username;
        const email = req.body.email;
        let password = req.body.password;
        let name = req.body.name;
        let lastname = req.body.lastname;
        let phone = req.body.phone;
        let errors = [];

        //Check required fields
        if (!username || !password) {
            errors.push({ msg: 'Please fill in all the fields' });
            res.send({ message: 'Please fill in all the fields' });
        }
        if (errors.length > 0) {

        } else {
            if (email) {
                bcrypt.hash(password, 5, (err, hash) => {
                    if (err) throw err;
                    password = hash;
                    pool.query('INSERT INTO Users (username, email, password, name, lastname, phone, admin) VALUES ("' + username + '", "' + email + '", "' + password + '","' + name + '", "' + lastname + '", "' + phone + '", 0)', [username, email, password, name, lastname, phone], function(err, result) {
                        console.log(err);
                    });
                });
                res.send({ msg: 'Successful Registration' });
                console.log("Successful Registration");
            } else {
                res.send('Enter Email');
            };
        }
    }

});

route.post('/is_admin', (req, res) => {
    var token = req.body.token;
    console.log(token + ' 113');
    if (token == '')
        res.send(0);
    var decoded = jwt.verify(token, secretKey);
    pool.query('SELECT * FROM Users WHERE user_id= ?', [decoded.user_id],
        (error, results, fields) => {
            console.log('here');
            console.log(results[0].admin);
            res.send(results[0]);

        });
});

route.post('/manage_orders', (req, res) => {
    var token = req.body.token;
    console.log(123);
    res.redirect('http://google.com');
    res.end();
});


module.exports = route;