import express from 'express';
import cors from "cors"
import "dotenv/config";
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';


const app = express();
const port = process.env.PORT || 3001;

await connectDB();

const corsOptions = {
    origin:process.env.TRUSTED_ORIGINS?.split(',') || ['http://localhost:5173'],
    credentials: true,
}

app.use(express.json());
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send('Server is Live!');
});
app.use('/api/users',userRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}); 