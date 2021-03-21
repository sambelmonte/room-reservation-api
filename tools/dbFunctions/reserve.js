import { query } from '../db';

export function getUserReservations(username, limit = 10, offset = 0) {
  const dbQuery = `
    SELECT
      rm.name as name,
      rs.start_time as startTime,
      rs.end_time as endTime,
      rs.cancelled as cancelled,
      rs.people_count as people_count
    FROM reservations rs
      INNER JOIN rooms rm
        WHERE rs.room_id = rm.id
      INNER JOIN regular_users ru
        WHERE rs.user_id = ru.id
    WHERE ru.username = ${username}
      AND rm.deleted = 0
    LIMIT ${limit}
    OFFSET ${offset};`;

  return new Promise((resolve, reject) =>
    query(dbQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  );
}

export function getUserReservationsCount(username) {
  const dbQuery = `
    SELECT COUNT(*) as count
    FROM reservations rs
      INNER JOIN rooms rm
        WHERE rs.room_id = rm.id
      INNER JOIN regular_users ru
        WHERE rs.user_id = ru.id
    WHERE ru.username = ${username}
      AND rm.deleted = 0;`;

  return new Promise((resolve, reject) =>
    query(dbQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.count);
      }
    })
  );
}

export function getReservation(username, roomId) {
  const dbQuery = `
    SELECT
      rm.name as name,
      rs.start_time as startTime,
      rs.end_time as endTime,
      rs.cancelled as cancelled,
      rs.people_count as people_count
    FROM reservations rs
      INNER JOIN rooms rm
        WHERE rs.room_id = rm.id
      INNER JOIN regular_users ru
        WHERE rs.user_id = ru.id
    WHERE ru.username = ${username}
      AND rs.id = ${roomId};`;

  return new Promise((resolve, reject) =>
    query(dbQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  );
}

export function getRoomReservations(roomId, startTime = 0, endTime = 0) {
  const dbQuery = `
    SELECT
      rm.name as name,
      rs.start_time as startTime,
      rs.end_time as endTime,
      rs.cancelled as cancelled,
      rs.people_count as people_count
    FROM reservations rs
      INNER JOIN rooms rm
        WHERE rs.room_id = rm.id
    WHERE rm.id = ${roomId}
      AND (rs.start_time BETWEEN ${startTime} AND ${endTime}
        OR rs.end_time BETWEEN ${startTime} AND ${endTime});`;

  return new Promise((resolve, reject) =>
    query(dbQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  );
}

export function reserveRoom(userId, roomId, startTime, endTime, peopleCount) {
  const dbQuery = `
    INSERT INTO reservations
      (user_id, room_id, start_time, end_time, people_count)
    VALUES (
      ${userId},
      ${roomId},
      ${startTime},
      ${endTime},
      ${peopleCount}
    );`;

  return new Promise((resolve, reject) =>
    query(dbQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  );
}

export function cancelReservation(reservationId) {
  const dbQuery = `
    UPDATE reservations
      SET cancelled = 1
      WHERE id = ${reservationId}`;

  return new Promise((resolve, reject) =>
    query(dbQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  );
}