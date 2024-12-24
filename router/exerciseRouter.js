const express = require('express');
const {
  addExercise,
  removeExercise,
  getDailyCalories,
  deleteExercise
} = require('../controller/exerciseController');
const router = express.Router();

router.post('/add', addExercise);
router.post('/remove', removeExercise);
router.get('/calories', getDailyCalories);
router.delete('/:userId/:exerciseId', deleteExercise);

module.exports = router;