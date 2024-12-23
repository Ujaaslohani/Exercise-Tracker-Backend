const express = require('express');
const connectDB = require('./database/connection');
const userRouter = require('./router/userRouter');
const exerciseRouter = require('./router/exerciseRouter');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api/users', userRouter);
app.use('/api/exercises', exerciseRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});