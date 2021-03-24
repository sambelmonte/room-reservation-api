const db = require('../db');

function getUserReservations(username, limit = 10, offset = 0) {
  const dbQuery = `
    SELECT
      rs.id as id,
      rm.name as name,
      UNIX_TIMESTAMP(rs.start_time) as startTime,
      UNIX_TIMESTAMP(rs.end_time) as endTime,
      rs.cancelled as cancelled,
      rs.people_count as people_count
    FROM reservations rs
      INNER JOIN rooms rm
        ON rs.room_id = rm.id
      INNER JOIN regular_users ru
        ON rs.user_id = ru.id
    WHERE ru.username = '${username}'
      AND rm.deleted = 0
    ORDER BY rs.start_time DESC
    LIMIT ${limit}
    OFFSET ${offset};`;

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

function getUserReservationsCount(username) {
  const dbQuery = `
    SELECT COUNT(*) as count
    FROM reservations rs
      INNER JOIN rooms rm
        ON rs.room_id = rm.id
      INNER JOIN regular_users ru
        ON rs.user_id = ru.id
    WHERE ru.username = '${username}'
      AND rm.deleted = 0;`;

  return new Promise((resolve, reject) =>
    db.query(dbQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    })
  );
}

function getReservation(username, roomId) {
  const dbQuery = `
    SELECT
      rs.id as id,
      rm.name as name,
      UNIX_TIMESTAMP(rs.start_time) as startTime,
      UNIX_TIMESTAMP(rs.end_time) as endTime,
      rs.cancelled as cancelled,
      rs.people_count as people_count
    FROM reservations rs
      INNER JOIN rooms rm
        ON rs.room_id = rm.id
      INNER JOIN regular_users ru
        ON rs.user_id = ru.id
    WHERE ru.username = '${username}'
      AND rs.id = ${roomId};`;

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

function getRoomReservations(roomId, startTime = 0, endTime = 0) {
  const dbQuery = `
    SELECT
      rs.id as id,
      rm.name as name,
      UNIX_TIMESTAMP(rs.start_time) as startTime,
      UNIX_TIMESTAMP(rs.end_time) as endTime,
      rs.cancelled as cancelled,
      rs.people_count as people_count
    FROM reservations rs
      INNER JOIN rooms rm
        ON rs.room_id = rm.id
    WHERE rm.id = ${roomId}
      AND rs.cancelled = 0
      AND ((rs.start_time BETWEEN FROM_UNIXTIME(${startTime}) AND FROM_UNIXTIME(${endTime}))
        OR (rs.end_time BETWEEN FROM_UNIXTIME(${startTime}) AND FROM_UNIXTIME(${endTime})));`;

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

function reserveRoom(userId, roomId, startTime, endTime, peopleCount) {
  const dbQuery = `
    INSERT INTO reservations
      (user_id, room_id, start_time, end_time, people_count)
    VALUES (
      ${userId},
      ${roomId},
      FROM_UNIXTIME(${startTime}),
      FROM_UNIXTIME(${endTime}),
      ${peopleCount}
    );`;

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

function cancelReservation(reservationId) {
  const dbQuery = `
    UPDATE reservations
      SET cancelled = 1
      WHERE id = ${reservationId}`;

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
  cancelReservation,
  getReservation,
  getRoomReservations,
  getUserReservations,
  getUserReservationsCount,
  reserveRoom
};