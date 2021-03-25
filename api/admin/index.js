const { Router } = require('express');
const { decryptKey } = require('../../tools/encrypt');
const router = Router();

router.use('/login', require('./login'));
router.use('/room', auth, require('./room'));

function auth(req, res, next) {
  const auth = req.header('adminAuth');

  if (!auth) {
    res.status(401)
      .json({
        'message': 'Unauthorized access.'
      });
  } else {
    const { expiry } = decryptKey(auth, true);
    if (expiry < Date.now()) {
      res.status(400)
        .json({
          'message': 'Access expired.'
        });
    }

    next();
  }
};

module.exports = router;