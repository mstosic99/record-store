const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
let jwt = require('jsonwebtoken');
const secretKey = "osjecamgolasiispodhaljine";

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const bcrypt = require('bcrypt')

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop_v3',
});


const route = express.Router();

const registerSchema = Joi.object().keys({
    username: Joi.string().min(5).max(40).required(),
    password: Joi.string().min(5).max(15).required(),
    name: Joi.string().min(2).max(20),
    lastname: Joi.string().min(2).max(20),
    email: Joi.string().email(),
    phone: Joi.number()
});

const loginSema = Joi.object().keys({
    username: Joi.string().min(5).max(40).required(),
    password: Joi.string().min(5).max(15).required()
});

const addressSchema = Joi.object().keys({
    address: Joi.string().min(5).max(40).required(),
    zipcode: Joi.number()
});
route.use(express.json());


route.get('/products', (req, res) => {

    pool.query('select * from Products p INNER JOIN Manifacturer m on p.manifacturer_id = m.manifacturer_id WHERE p.stock > 0', (err, rows) => {
        if (err) {
            res.status(500).send(err.sqlMessage); // Greska servera
        } else
            res.send(rows);
    });
});


route.get('/products/:id', (req, res) => {
    var query = 'select * from Products where product_name=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

route.get('/products/sort/:id', (req, res) => {
    if (req.params.id == 1)
        var col = 'product_name';
    else if (req.params.id == 2)
        var col = 'category_id';
    else var col = 'price';
    var query = 'select * from Products order by ' + col + ' ASC';
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
    let { error } = addressSchema.validate({ address: req.body.address, zipcode: req.body.zipcode });


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
    var query = 'select * from Orders where user_id = ?'
    let formated = mysql.format(query, [decoded.user_id]);
    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});


route.post('/orders', (req, res) => {
    var orderId = 0;
    let query = "insert into Orders (user_id, datetime, status, price, address_id) values (?, ?, ?, ?, ?)";
    var token = req.body.token;
    var decoded = jwt.verify(token, secretKey);
    let formated = mysql.format(query, [parseInt(decoded.user_id), new Date().toISOString().slice(0, 19).replace('T', ' '), 0, req.body.price, req.body.address_id]);
    pool.query(formated, (err, response) => {
        if (req.body.address_id == -1)
            res.status(500).send('Please select address!');
        else if (err)
            res.status(500).send(err.sqlMessage);
        else {
            query = 'select * from Orders where order_id=?';
            formated = mysql.format(query, [response.insertId]);

            pool.query(formated, (err, rows) => {
                orderId = rows[0].order_id;

                var cart = req.body.cart;
                for (var i = 0; i < cart.length; i++) {
                    let query = "insert into Carts (order_id, product_id, quantity) values (?, ?, ?)";
                    let format = mysql.format(query, [orderId, cart[i].product_id, cart[i].stock]);
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
    let { error } = loginSema.validate(req.body);
    console.log(req.body.username)
    console.log(req.body.password)
    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        const username = req.body.username;
        const password = req.body.password;

        if (username && password) {
            pool.query('SELECT * FROM Users WHERE username = ?', [username],
                (error, results, fields) => {
                    if (results.length == 0)
                        res.status(400).send('Wrong user/password');
                    else {
                        pass = results[0].password;
                        console.log(results[0]);
                        console.log(pass);
                        if (bcrypt.compareSync(password, pass)) {
                            console.log("success");
                            var token = jwt.sign({ user_id: results[0].user_id }, secretKey);
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
    let { error } = registerSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).send(error.details[0].message);
    } else {
        console.log('here');
        const username = req.body.username;
        const email = req.body.email;
        var password = req.body.password;
        var name = req.body.name;
        var lastname = req.body.lastname;
        var phone = req.body.phone;
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
                res.send({ msg: 'uspesna registracija' });
                console.log("uspesna registracija");
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