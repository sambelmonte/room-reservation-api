const { createConnection } = require('mysql');
const config = require('../config/db.json');

const con = createConnection(config);
con.connect(function(error){
  if (error) throw error;
});

module.exports = con;