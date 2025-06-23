import express from 'express';
import { connectDB } from './DB/connectDB.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();
const PORT =process.env.PORT||5050;
const app = express();

const __dirname=path.resolve();
app.use(cors({origin:"http://localhost:5173",credentials:true}));

app.use(express.json());
app.use(cookieParser());




app.use("/api/auth",authRoutes);

if(process.env.NODE_ENV=="production"){
  app.use(express.static(path.join(__dirname,"/frontend/dist")));

  app.get(/.*/,(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
  })
}

app.listen(PORT, () => {
    connectDB();
  console.log('Server is running on port',{PORT});
});


