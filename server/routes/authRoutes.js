import express from "express";
import authController from "../controllers/authController.js";
import checkIsUserAuthenticated from "../middlewares/authMiddleware.js";

import cors from 'cors';
import multer from 'multer';



const router = express.Router(); // Set up a router
const app = express();
const port = 5000;
app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public Routes
router.post("/users/register", authController.userRegistration); // Register route
router.post("/users/login", authController.userLogin); // Login route

// Forget Password Routes
router.post("/forget-password", authController.forgetPassword); // Send reset link
router.post("/forget-password/:id/:token", authController.forgetPasswordEmail); // Reset password using link

// Email Verification
router.get("/verify/:token", authController.saveVerifiedEmail);

// Protected Routes (Accessible only with a valid user token)
router.post(
  "/change-password",
  checkIsUserAuthenticated,
  authController.changePassword
);

// Assessment Route (Protected)
router.post(
  '/assessment',
  checkIsUserAuthenticated,
  authController.predictResult
);
router.post(
  '/assessment2',
  checkIsUserAuthenticated,
  authController.predictResult2
);

// Results Route (Protected)
router.post(
  '/results',
  checkIsUserAuthenticated,
  authController.prevResult
);

// Image Analysis Route
router.post('/analyze-report',
  upload.single('image'),
  authController.ImageAnalysis
);

// ChatBOT
router.post('/chat', authController.ChatBot);

export default router;
