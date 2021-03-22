const { generateHash } = require('../tools/encrypt');
const { createAdminUser } = require('../tools/dbFunctions/user');

const username = 'admin';
const password = '12345';

generateHash(password)
  .then((hash) =>
    createAdminUser(username, hash)
      .then((user) =>
        console.log(`Successfully creating admin account ${username}`)
      )
      .catch((error) => console.log(error))
  );