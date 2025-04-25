import bcrypt from 'bcryptjs'
import { db } from '../libs/db.js';
import { UserRole } from '../generated/prisma/index.js';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config();

export const registerController = async(req, res) => {
  const { email, password, name} = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: email
    })
    if(existingUser){
      return res.status(400).json({
        message: "User already exists!",
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER
      }
    })
    
    const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, cookieOptions ={
      expiresIn: "7d"
    })

    res.cookie("token", token, cookieOptions={
      httOnly: true,
      sameSite:"strict",
      secure: process.env.Node_ENV !== "devlopment",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
      message: "User created successfully!",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error creating user!",
      error,
      success: false,
    })
  }
}

export const loginController = async(req, res) => {
  
}

export const logoutController = async(req, res) => {
  
}

export const checkController = async(req, res) => {
  
}