import express, { Request, Response, Application, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('This is automation pipeline');
});

// Healthcheck endpoint
app.get('/status', (req: Request, res: Response) => {
    res.status(200).json(
        {
            status: "Ok",
            timestamp: new Date().toISOString()
        }
    )
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})


app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});