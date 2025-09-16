import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import apiRouter from './routes/api.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/collabspace')
  .then(()=> {
    console.log('Mongo connected');
    app.listen(PORT, ()=> console.log(`Backend listening ${PORT}`));
  })
  .catch(err => {
    console.error('DB error', err);
    process.exit(1);
  });
