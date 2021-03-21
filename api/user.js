import { Router } from 'express';
import { checkPassword, encryptKey, generateHash } from '../tools/encrypt';
import { createUser, getUser } from '../tools/dbFunctions/user';
const router = Router();

router.post('/new', (req, res) => {
  const errors = [];

  if (!req.body.username) {
    errors.push('Username is required.')
  } else if (req.body.username.match(/^[0-9a-zA-Z_]+$/)) {
    errors.push('Characters in a username should be alphanumeric or underscore.')
  } else if (req.body.username.length > 32) {
    errors.push('Username should not exceed 32 characters.')
  }

  if (!req.body.password) {
    errors.push('Password is required.')
  } else if (req.body.password.match(/^[0-9a-zA-Z]+$/)) {
    errors.push('Password should be alphanumeric.')
  }

  if(errors.length > 0) {
    res.status(400).json({
      message: errors.join(' ')
    });
  }

  generateHash(req.body.password)
    .then((hash) =>
      createUser(username, hash)
        .then((user) =>
          res.status(200)
            .json({
              userId: user.insertId
            })
        )
        .catch((error) => res.status(500).end())
    );
});

router.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400)
      .json({
        message: 'Missing credentials.'
      })
  };

  getUser(req.body.username)
    .then((user) => {
      if (user.length === 0) {
        res.status(404).end();
      }

      checkPassword(req.body.password, user[0].hash)
        .then((isPasswordCorrect) => {
          if(isPasswordCorrect) {
            res.status(200)
              .json({
                key: encryptKey(user[0].id, req.body.username)
              });
          } else {
            res.status(400)
              .json({
                message: 'Wrong password.'
              });
          }
        });
    })
    .catch((error) => res.status(500).end());
});

export default router;