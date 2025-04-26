import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { db } from "../libs/db.js";
dotenv.config();

const isAuthenticated = async(req, res, next) => {
  try {
    const token = req.cookies?.token;
  if(!token){
    return res.status(401).json({
      message: "Please login!",
    })
  }

  // console.log("Auth middle token: ", token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  // console.log("Decoded value: ", decoded);

  const user = await db.user.findUnique({
    where: {
      id: decoded.id
    },
    select: {
      id: true,
      image: true,
      name: true,
      role: true,
      email: true
    }
  })
  if(!user){
    return res.status(401).json({
      message: "User not found",
    })
  }
  req.user = user;

  // console.log(`Req.user: ${req.user}`)
  next();
  } catch (error) {
    res.status(401).json({
      message: "Please login first!",
      error,
    })
  }
}

export default isAuthenticated;