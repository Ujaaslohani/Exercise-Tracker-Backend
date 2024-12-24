const express = require('express');
const {
  addExercise,
  getUserExercises,
  removeExercise,
  getDailyCalories,
  deleteExercise,
  getExerciseNames, 
} = require('../controller/exerciseController');

const router = express.Router();


router.get('/name', getExerciseNames); 
router.post('/add', addExercise);
router.post('/remove', removeExercise);
router.get('/calories', getDailyCalories);
router.get('/:userId', getUserExercises); 
router.delete('/:userId/:exerciseId', deleteExercise);

module.exports = router;
