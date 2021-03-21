const { Router } = require('express');
const { getRooms } = require('../tools/dbFunctions/room');
const router = Router();

router.get('/', (req, res) => {
  const peopleCount = Number(req.query.people ?? 0);

  getRooms(peopleCount)
    .then((rooms) =>
      res.status(200).json({
        rooms
      })
    );
});

module.exports = router;