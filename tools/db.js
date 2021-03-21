import { createConnection } from 'mysql';
import { db } from '../config/db.json';

var con = createConnection(db);
con.connect(function(err){
  if (err) throw err;
  console.log("DB connected!");
})

export default con;