const express = require('express');
const {
  addExercise,
  removeExercise,
  getDailyCalories,
} = require('../controller/exerciseController');
const router = express.Router();

router.post('/add', addExercise);
router.post('/remove', removeExercise);
router.get('/calories', getDailyCalories);

module.exports = router;