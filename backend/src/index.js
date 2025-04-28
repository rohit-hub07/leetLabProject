import express from 'express';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'
import problemRoutes from './routes/problem.routes.js';


dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser())
const port = process.env.PORT || 8080;

app.get("/", (req, res) =>{
  res.send("Hello guys! Welcome to leetlab");
})



app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)


app.listen(port, () => {
  console.log(`App is listening on port: ${port}`)
}) 