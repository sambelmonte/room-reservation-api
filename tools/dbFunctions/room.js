const db = require('../db');

function getRooms() {
  const dbQuery = `
    SELECT id, name
      FROM rooms
      WHERE deleted = 0;`;
  
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

function addRoom(adminId, name) {
  const dbQuery = `
    INSERT
      INTO rooms
        (name, created_by, created_at)
      VALUES
        ('${name}', ${adminId}, NOW())`;
  
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