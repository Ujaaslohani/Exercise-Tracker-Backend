const express = require('express');
const { register, login, deleteUser } = require('../controller/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/:userId', deleteUser);

module.exports = router;