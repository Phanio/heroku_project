var express = require('express');
var router = express.Router();

const UserController = require('../controllers/user.controller.js');
const userController = new UserController();
async function isAuthenticated (req, res, next) {
  if (req.session.userId) {
    console.log('session', req.session.userId);
    console.log('dd', next);
    next(); // appeler next() appelle la prochaine fonction dans la liste des middlewares
    return;
  }
  res.status(401).send('unauthorized(1)');
}

router.post('/signin',isAuthenticated, userController.create);
router.post('/login',isAuthenticated, userController.postLogin);
router.get('/', userController.getUsers);

module.exports = router;