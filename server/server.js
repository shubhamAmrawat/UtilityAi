import express from 'express'; 
import dotenv from 'dotenv'; 
import cors from 'cors'; 
import routes from './routes/index.js'
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
//load env variables 
dotenv.config(); 
connectDb(); 


const PORT = process.env.PORT || 5000; 

const app = express(); 
app.use(cors()); 
app.use(express.json()); 
app.use(cookieParser()); 


app.get('/', (req, res) => {
  res.send("API is running");
});

app.use('/api/v1', routes); 

app.listen(PORT, () => {
  console.log(`Server is listening and running on port ${PORT}`);
})