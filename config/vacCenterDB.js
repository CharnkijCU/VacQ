const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ham12345678",
  database: "vacCenter",
});

module.exports = connection;
