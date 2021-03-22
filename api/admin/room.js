const { Router } = require('express');
const { addRoom, getRooms, deleteRoom } = require('../../tools/dbFunctions/room');
const { decryptKey } = require('../../tools/encrypt');
const router = Router();

router.get('/', (req, res) => {
  const peopleCount = Number(req.query.people ?? 0);

  getRooms(peopleCount)
    .then((rooms) =>
      res.status(200).json({
        rooms
      })
    )
    .catch((error) => res.status(500).end());
});

router.post('/', (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push('name is required.')
  }

  if (!req.body.maxCapacity) {
    errors.push('maxCapacity is required.')
  } else if (!Number.isInteger(req.body.maxCapacity)) {
    errors.push('maxCapacity should be a number.')
  } else if (req.body.maxCapacity <= 0) {
    errors.push('maxCapacity should be at least 1.')
  }

  if (errors.length > 0) {
    res.status(400)
      .json({
        message: errors.join(' ')
      });
  } else {
    const { userId } = decryptKey(req.header('adminAuth'), true);
  
    addRoom(userId, req.body.name, req.body.maxCapacity)
      .then((room) =>
        res.status(200)
          .json({
            roomId: room.insertId
          })
      )
      .catch((error) => res.status(500).end());
  }
});

router.delete('/:id', (req, res) => {
  deleteRoom(req.params.id)
    .then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).end();
      }

      res.status(200).json({
        'message': 'Room deleted successfully'
      });
    })
    .catch((error) => res.status(500).end());
});

module.exports = router;