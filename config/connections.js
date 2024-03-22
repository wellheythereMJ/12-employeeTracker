const mysql = require('mysql2');
// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: "It'sUp2You",
    database: 'employee_db'
  },

);

module.exports = connection;