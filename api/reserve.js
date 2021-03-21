const { Router } = require('express');
const {
  cancelReservation,
  getReservation,
  getRoomReservations,
  getUserReservations,
  getUserReservationsCount,
  reserveRoom
} = require('../tools/dbFunctions/reserve');
const { decryptKey } = require('../tools/encrypt');
const router = Router();

router.get('/', (req, res) => {
  const { username } = decryptKey(req.header.auth);
  const limit = Number(req.query.limit ?? 10);
  const offset = (Number(req.query.page ?? 1) - 1) * limit;

  getUserReservations(username, limit, offset)
    .then((reservations) =>
      getUserReservationsCount(username)
        .then((totalCount) =>
          res.status(200)
            .json({
              reservations,
              totalCount
            })
        )
        .catch((error) => res.status(500).end())
    )
    .catch((error) => res.status(500).end());
});

router.get('/:id', (req, res) => {
  const { username } = decryptKey(req.header.auth);

  getReservation(username, req.params.id)
    .then((reservation) =>
      res.status(200)
        .json(reservation[0])
    )
    .catch((error) => res.status(500).end());
});

router.post('/', (req, res) => {
  let errors = [];
  if (!req.body.roomId) {
    errors.push('roomId is required.');
  } else if (!Number.isInteger(req.body.roomId)) {
    errors.push('roomId should be a number.')
  }

  if (!req.body.startTime) {
    errors.push('startTime is required.');
  } else if (!Number.isInteger(req.body.startTime)) {
    errors.push('startTime should be a number.')
  }

  if (!req.body.endTime) {
    errors.push('endTime is required.');
  } else if (!Number.isInteger(req.body.endTime)) {
    errors.push('endTime should be a number.')
  }

  if (!req.body.peopleCount) {
    errors.push('peopleCount is required.');
  } else if (!Number.isInteger(req.body.peopleCount)) {
    errors.push('peopleCount should be a number.')
  }

  if (errors.length > 0) {
    res.status(400)
      .json({
        message: errors.join(' ')
      });
  }

  const { userId } = decryptKey(req.header.auth);

  getRoomReservations(req.body.roomId, startTime, endTime)
    .then((reservations) => {
      if (reservations.length < 1) {
        res.status(400)
          .json({
            'message': 'Room has already been reserved at the given time.'
          });
      }

      reserveRoom(userId, req.body.roomId, req.body.startTime, req.body.endTime, req.body.peopleCount)
        .then((reservation) =>
          res.status(200)
            .json({
              reservationId: reservation.insertId
            })
        )
        .catch((error) => res.status(500).end());
    })
    .catch((error) => res.status(500).end());
});

router.delete('/:id', (req, res) => {
  cancelReservation(req.params.id)
    .then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).end();
      }

      res.status(200).json({
        'message': 'Reservation cancelled successfully'
      });
    })
    .catch((error) => res.status(500).end());
});

module.exports = router;