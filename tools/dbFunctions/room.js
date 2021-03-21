const db = require('../db');

function getRooms(peopleCount = 0) {
  let peopleCountQuery = '';
  if (peopleCount > 0) {
    peopleCountQuery = `
      AND max_capacity >= ${peopleCount}
    `;
  }
  const dbQuery = `
    SELECT name, max_capacity
      FROM rooms
      WHERE deleted = 0
      ${peopleCountQuery};`;
  
  return new Promise((resolve, reject) =>
    db.query(dbQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  );
}

module.exports = { getRooms };