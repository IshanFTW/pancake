import express from 'express'
import rootRouter from './routes/index'
import cors from 'cors';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', rootRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });