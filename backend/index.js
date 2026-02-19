import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";
dotenv.config();

// auth
import authRoutes from './routes/auth.route.js';

// item
import itemRoutes from './routes/item.route.js'

const app = express();
const PORT = process.env.PORT;

app.use(
    cors({
        origin: process.env.DEVELOPMENT_FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));


// auth
app.use('/api/v1/auth' , authRoutes);

// Item - secondary entity
app.use('/api/v1/item' , itemRoutes);


app.listen(PORT, () => console.log(`app listening at PORT:${PORT}`));