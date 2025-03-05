import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';


dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API de Atividades de Voluntariado');
});

export default app;