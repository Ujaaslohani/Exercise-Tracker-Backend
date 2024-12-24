const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, required: true },
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
