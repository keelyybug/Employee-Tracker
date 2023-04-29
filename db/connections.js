const mysql = require('mysql2')

const connection = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'rootroot',
      database: 'employees'
    },
    console.log(`Connected to the employees database.`)
  );

  connection.connect(function (err){
    if (err) throw err;
  });

  module.exports = connection;