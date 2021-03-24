const { Router } = require('express');
const { getRooms } = require('../tools/dbFunctions/room');
const { decryptKey } = require('../tools/encrypt');
const log = require('../tools/log');
const router = Router();

router.get('/', (req, res) => {
  const peopleCount = Number(req.query.people ?? 0);
  const { username } = decryptKey(req.header('auth'));

  getRooms(peopleCount)
    .then((rooms) =>
      res.status(200).json({
        rooms
      })
    )
    .catch((error) => {
      log('GET /room', 'getRooms', username, error);
      res.status(500).end();
    });
});

module.exports = router;