import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running...');
});


const PORT = process.env.PORT || '4000';
app.listen(Number(PORT), () => {
  console.log(`Backend running on port ${PORT}`);
});
