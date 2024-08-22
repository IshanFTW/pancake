import express from 'express'
import rootRouter from './routes/index'
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', rootRouter);

