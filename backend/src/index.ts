import express, {Express, Request, Response} from 'express';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response)=>{
    res.send('Hello, this is Express');
});

app.listen(port, ()=> {
console.log(`[Server]: I am running at https://localhost:${port}`);
});