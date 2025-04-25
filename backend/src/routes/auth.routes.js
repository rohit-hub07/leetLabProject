import express from 'express'
import { registerController } from '../controller/user.controller.js';
const authRoutes = express.Router();

authRoutes.get("/register", registerController)

export default authRoutes;