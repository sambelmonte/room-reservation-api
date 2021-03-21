import { query } from '../db';

export function createUser(username, hash) {
  const dbQuery = `
    INSERT
      INTO regular_users
        (username, hash, created_at)
      VALUES
        (${username}, ${hash}, NOW());`;
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

export function getUser(username) {
  const dbQuery = `
    SELECT username, hash
      FROM regular_users
      WHERE username = ${username}
        AND deleted = 0;`;
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
