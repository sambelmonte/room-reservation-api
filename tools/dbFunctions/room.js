const db = require('../db');

function getRooms(peopleCount = 0) {
  let peopleCountQuery = '';
  if (peopleCount > 0) {
    peopleCountQuery = `
      AND max_capacity >= ${peopleCount}
    `;
  }
  const dbQuery = `
    SELECT id, name, max_capacity
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

function addRoom(adminId, name, maxCapacity) {
  const dbQuery = `
    INSERT
      INTO rooms
        (name, created_by, created_at, max_capacity)
      VALUES
        ('${name}', ${adminId}, NOW(), ${maxCapacity})`;
  
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

function deleteRoom(roomId) {
  const dbQuery = `
    UPDATE rooms
      SET deleted = 1
      WHERE id = ${roomId}`;

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

module.exports = {
  addRoom,
  deleteRoom,
  getRooms
};