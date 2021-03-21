import { Router } from 'express';
import { decryptKey } from '../tools/encrypt';
const router = Router();

router.use('/user', require('./user'));
router.use('/room', auth, require('./room'));
router.use('/reserve', auth, require('./reserve'));

function auth(req, res, next) => {
  if (!req.header.auth) {
    res.status(401)
      .json({
        'message': 'Unauthorized access.'
      });
  }

  const keyData = decryptKey(req.header.auth);
  if (keyData.expiry < Date.now()) {
    res.status(400)
      .json({
        'message': 'Access expired.'
      });
  }

  next();
};

export default router;