const { Router } = require('express');
const { getAdminUser } = require('../../tools/dbFunctions/user');
const { checkPassword, encryptKey } = require('../../tools/encrypt');
const log = require('../../tools/log');
const router = Router();

router.post('/', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400)
      .json({
        message: 'Missing credentials.'
      })
  };

  getAdminUser(req.body.username)
    .then((user) => {
      if (user.length === 0) {
        res.status(404).end();
      }

      checkPassword(req.body.password, user[0].hash)
        .then((isPasswordCorrect) => {
          if(isPasswordCorrect) {
            res.status(200)
              .json({
                key: encryptKey(user[0].id, req.body.username, true)
              });
          } else {
            res.status(400)
              .json({
                message: 'Wrong password.'
              });
          }
        });
    })
    .catch((error) => {
      log('POST /admin/login', 'getAdminUser', req.body.username, error);
      res.status(500).end();
    });
});

module.exports = router;