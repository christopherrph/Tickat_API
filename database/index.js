const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'chris',
    password: 'password',
    database: 'tickat',
    port: 3306,
    multipleStatements: true
});

module.exports = db;