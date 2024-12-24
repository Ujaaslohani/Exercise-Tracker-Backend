const Exercise = require('../models/Exercise');
const axios = require('axios');
const EXTERNAL_API = 'https://raw.githubusercontent.com/Ujaaslohani/Exercise-Tracker/main/full_calories_burned_activities.json';

const getCaloriesBurned = (caloriesData, weight) => {
  const weights = Object.keys(caloriesData).map((key) => parseInt(key));
  const closestWeight = weights.reduce((prev, curr) =>
    Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev
  );
  return caloriesData[`${closestWeight}_lb`];
};

const addExercise = async (req, res) => {
  const { userId, exercises, weight } = req.body;
  try {
    const externalData = (await axios.get(EXTERNAL_API)).data.activities;

    const exerciseData = exercises.map((exercise) => {
      const activityData = externalData.find((act) => act.activity === exercise.name);
      if (!activityData) throw new Error(`Activity not found: ${exercise.name}`);
      const caloriesPerHour = getCaloriesBurned(activityData.calories_burned, weight);
      const caloriesBurned = (caloriesPerHour / 60) * exercise.duration;
      return { ...exercise, caloriesBurned };
    });

    const record = await Exercise.findOneAndUpdate(
      { userId },
      { $push: { exercises: { $each: exerciseData } } },
      { new: true, upsert: true }
    );

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeExercise = async (req, res) => {
  const { userId, date } = req.body;
  try {
    const result = await Exercise.updateOne(
      { userId },
      { $pull: { exercises: { date: new Date(date) } } }
    );
    res.json({ message: 'Exercises removed', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove exercises' });
  }
};

const getDailyCalories = async (req, res) => {
  const { userId, date } = req.query;
  try {
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const record = await Exercise.findOne({ userId });
    if (!record) return res.status(404).json({ message: 'No exercises found' });

    const totalCalories = record.exercises
      .filter((ex) => ex.date >= start && ex.date < end)
      .reduce((sum, ex) => sum + ex.caloriesBurned, 0);

    res.json({ totalCalories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate daily calories' });
  }
};

const deleteExercise = async (req, res) => {
    const { userId, exerciseId } = req.params;
    try {
      const record = await Exercise.findOne({ userId });
      if (!record) return res.status(404).json({ error: 'No exercises found for user' });
  
      record.exercises = record.exercises.filter(ex => ex._id.toString() !== exerciseId);
      await record.save();
  
      res.json({ message: 'Exercise deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete exercise' });
    }
  };

module.exports = { addExercise, removeExercise, getDailyCalories, deleteExercise};