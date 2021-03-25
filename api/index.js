const { Router } = require('express');
const { decryptKey } = require('../tools/encrypt');
const router = Router();

router.use('/admin', require('./admin/index'));
router.use('/user', require('./user'));
router.use('/room', auth, require('./room'));
router.use('/reserve', auth, require('./reserve'));

function auth(req, res, next) {
  const auth = req.header('auth');

  if (!auth) {
    res.status(401)
      .json({
        'message': 'Unauthorized access.'
      });
  } else {
    const { expiry } = decryptKey(auth);
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