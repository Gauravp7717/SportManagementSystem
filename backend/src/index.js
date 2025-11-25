import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";


const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); 
app.use(cookieParser());


// Test Route
app.get("/healthcheck", (req, res) => res.send("ok"));



//routes import
import userRouter from './routes/user.routes.js'






//routes handling
app.use('/api/v1/users',userRouter)




// Server Start
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port: ${port}`));
