import authModel from "../models/authModel.js";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import axios from 'axios';
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jwt from "jsonwebtoken";
import { sendEmailtoUser } from "../config/emailTemplate.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
class AuthController {

  // User Registration
  static userRegistration = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      // Check if required fields are provided
      if (name && email && password) {
        const isUser = await authModel.findOne({ email: email });
        if (isUser) {
          return res.status(400).json({ message: "User Already Exists" });
        } else {
          // Password Hashing
          const genSalt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(password, genSalt);

          // Generate Token
          const secretKey = "HeartHealthProjectKMIT";
          const token = jwt.sign({ email: email }, secretKey, { expiresIn: "5m" });
          const link = `http://localhost:9000/api/auth/verify/${token}`
          sendEmailtoUser(link, email);
          // Save the user to MongoDB
          const newUser = authModel({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
          });

          const resUser = await newUser.save();
          if (resUser) {
            return res
              .status(201)
              .json({ message: "Registered Successfully", user: resUser });
          }
        }
      } else {
        return res.status(400).json({ message: "All fields are required" });
      }
    } catch (error) {
      console.error("Error during registration:", error.message);
      return res.status(400).json({ message: error.message });
    }
  };

  // User Login
  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (email && password) {
        const isUser = await authModel.findOne({ email: email });
        if (isUser) {
          const isVerifiedProfile = await authModel.findById(isUser._id);

          if (isVerifiedProfile.isVerified) {
            if (
              email === isUser.email &&
              (await bcryptjs.compare(password, isUser.password))
            ) {
              // Generate token
              const token = jwt.sign(
                { userID: isUser._id, email: isUser.email },
                "HeartHealthProjectKMIT",
                {
                  expiresIn: "2d",
                }
              );
              return res
                .status(200)
                .json({
                  message: "Login Successfully",
                  token,
                  name: isUser.name,
                  email: isUser.email,
                });
            } else {
              return res.status(400).json({ message: "Invalid Credentials!" });
            }
          } else {
            return res.status(400).json({ message: "Email verification is still pending!" });
          }

        } else {
          return res.status(400).json({ message: "User Not Registered!!" });
        }
      } else {
        return res.status(400).json({ message: "All fields are required" });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // Change Password
  static changePassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    try {
      if (newPassword === confirmPassword) {
        const genSalt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, genSalt);
        await authModel.findByIdAndUpdate(req.user._id, {
          password: hashedPassword,
        });
        return res
          .status(200)
          .json({ message: "Password Changed Successfully" });
      } else {
        return res
          .status(400)
          .json({ message: "Password and Confirm Password do not match" });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // Forgot Password
  static forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
      if (email) {
        const isUser = await authModel.findOne({ email: email });
        if (isUser) {
          // Generate token
          const secretKey = isUser._id + "HeartHealthProjectKMIT";
          const token = jwt.sign({ userID: isUser._id }, secretKey, {
            expiresIn: "5m",
          });

          const link = `http://localhost:3000/user/reset/${isUser._id}/${token}`;

          // Email sending
          const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Password Reset Request`,
            text: `
            <!doctype html>
            <html lang="en-US">
            
            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Reset Password Email Template</title>
                <meta name="description" content="Reset Password Email Template.">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>
            
            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <!--100% body table-->
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                                
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                        requested to reset your password</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                        We cannot simply send you your old password. A unique link to reset your
                                                        password has been generated for you. To reset your password, click the
                                                        following link and follow the instructions.
                                                    </p>
                                                    <a href=${link}
                                                        style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                        Password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                               
                            </table>
                        </td>
                    </tr>
                </table>
                <!--/100% body table-->
            </body>
            
            </html>`,
            html: `
            <!doctype html>
            <html lang="en-US">
            
            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Reset Password Email Template</title>
                <meta name="description" content="Reset Password Email Template.">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>
            
            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <!--100% body table-->
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                               
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                        requested to reset your password</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                        We cannot simply send you your old password. A unique link to reset your
                                                        password has been generated for you. To reset your password, click the
                                                        following link and follow the instructions.
                                                    </p>
                                                    <a href="${link}"
                                                        style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                        Password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                               
                            </table>
                        </td>
                    </tr>
                </table>
                <!--/100% body table-->
            </body>
            
            </html>`,
          };

          transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(400).json({ message: "Error" });
            }
            return res.status(200).json({ message: "Email Sent" });
          });
        } else {
          return res.status(400).json({ message: "Invalid Email" });
        }
      } else {
        return res.status(400).json({ message: "Email is required" });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // Reset Password via Email Link
  static forgetPasswordEmail = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const { id, token } = req.params;

    try {
      if (newPassword && confirmPassword && id && token) {
        const isUser = await authModel.findById(id);

        if (!isUser) {
          return res.status(404).json({ message: "User not found" });
        }

        // Token Verification for expiry
        const secretKey = isUser._id + "HeartHealthProjectKMIT";
        try {
          const isValid = await jwt.verify(token, secretKey);

          if (isValid) {
            // Password Hashing
            const genSalt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(newPassword, genSalt);

            // Update the user's password
            const isSuccess = await authModel.findByIdAndUpdate(isUser._id, {
              $set: {
                password: hashedPassword,
              },
            });

            if (isSuccess) {
              return res.status(200).json({ message: "Password Changed Successfully!" });
            }
          } else {
            return res.status(400).json({ message: "Link Expired!" });
          }
        } catch (error) {
          return res.status(400).json({ message: "Invalid token" });
        }
      } else {
        return res.status(400).json({ message: "All fields are required!" });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // Verify Email
  static saveVerifiedEmail = async (req, res) => {
    const { token } = req.params;
    try {
      if (token) {
        // token verify
        const secretKey = "HeartHealthProjectKMIT";
        const isEmailVerified = await jwt.verify(token, secretKey);
        if (isEmailVerified) {
          const getUser = await authModel.findOne({
            email: isEmailVerified.email,
          });

          const saveEmail = await authModel.findByIdAndUpdate(getUser._id, {
            $set: {
              isVerified: true,
            },
          });

          if (saveEmail) {
            return res
              .status(200)
              .json({ message: "Email Verification Success" });
          }

          //
        } else {
          return res.status(400).json({ message: "Link Expired" });
        }
      } else {
        return res.status(400).json({ message: "Invalid URL" });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // Predict Result
  static predictResult = async (req, res) => {
    try {
      const userData = req.user;

      // Prepare the data to be sent to Flask
      const assessmentData = {
        email: userData.email,
        ...req.body, // Add other form fields sent by the React app
      };

      // Send the assessment data to Flask
      const flaskResponse = await axios.post(
        'http://127.0.0.1:5000/predict',
        assessmentData
      );

      // Handle the Flask response (e.g., store it in MongoDB)
      // console.log(flaskResponse.data);

      res.status(200).json(flaskResponse.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Predict Result 2
  static predictResult2 = async (req, res) => {
    try {
      const userData = req.user;

      // Prepare the data to be sent to Flask
      const assessmentData = {
        email: userData.email,
        ...req.body, // Add other form fields sent by the React app
      };

      // Send the assessment data to Flask
      const flaskResponse = await axios.post(
        'http://127.0.0.1:5000/predict2',
        assessmentData
      );

      // Handle the Flask response (e.g., store it in MongoDB)
      // console.log(flaskResponse.data);

      res.status(200).json(flaskResponse.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Previous Results
  static prevResult = async (req, res) => {
    try {
      const userData = req.user;

      // Prepare the data to be sent to Flask
      const assessmentData = {
        email: userData.email
      };

      // Send the assessment data to Flask
      const flaskResponse = await axios.post(
        'http://127.0.0.1:5000/previous_results',
        assessmentData
      );

      // Handle the Flask response (e.g., store it in MongoDB)
      // console.log(flaskResponse.data);

      res.status(200).json(flaskResponse.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Report Analysis
  static ImageAnalysis = async (req, res) => {
    const { buffer, mimetype } = req.file;

    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimetype,
      },
    };

    const generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: 200,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = `Imagine you are a doctor. I will give you a medical report as an image. You have to take a look at the report properly. Take a note of the values in the report properly.
    
    Now, tell me what all the parameters in the patient's report mean and if they are in a proper range. Give the result in this format, with content in '()' showing what to do:
    ----
    # Report Analysis for {patientName}'s Report
    ## Details:
    - (Detail 1)
    - (Detail 2)
    - (Detail 3)

    ## Report Parameters:
    - (1st parameter: it's meaning and it's value in the report)
    - (2nd parameter: it's meaning and it's value in the report)
    - (3rd parameter: it's meaning and it's value in the report)
    - (4th parameter: it's meaning and it's value in the report)
    - (5th parameter: it's meaning and it's value in the report)

    ## Summary:
    (Summary of the report in 3-4 lines briefly.)
    ----
    
    The details tab should contain the details of the patient, date, and hospital in which the report is recorded, if there are any, if there are none, you can skip them. The Report parameters tab should contain all the report parameter values and their meanings. The summary tab should explain the report carefully and tell the patient about their health.

    If the given image contains any other stuff rather than the medical reports, reject the generation of a report for that image and say 'There's no medical report in the given image. Failed to generate a valid response.'. Give the report result in simple terminology. Give a detailed report.`;

    try {
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      res.json({ text });
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: 'Failed to analyze image', details: error.message });
    }
  }

  // Chatbot
  static ChatBot = async (req, res) => {
    const { userInput, chatHistory } = req.body;
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ];
    const generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: 200,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' }, safetySettings);
    const chat = model.startChat({ history: chatHistory });
    try {
      const result = await chat.sendMessageStream(userInput);
      const response = await result.response;
      const text = response.text();
      res.json({ text });
    } catch (error) {
      console.error('Error processing:', error);
      const warningMessage = 'The following prompt contains hate speech. Please refrain from using hate speech during our conversations.';
      res.status(200).json({ text: warningMessage });
    }
  }

}

export default AuthController;
