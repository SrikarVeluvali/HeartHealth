# Heart Health App

Heart Health is a comprehensive MERN (MongoDB, Express.js, React.js, Node.js) application integrated with AI/ML capabilities to predict heart disease risk and provide personalized health recommendations.

## Features

### 1. Heart Disease Prediction
Utilizes machine learning algorithms to assess the risk of heart disease based on user-input health data.

### 2. Dashboard
A user-friendly interface to view health statistics, predictions, and recommendations at a glance.

### 3. Additional Assessment Forms
- **Self-Assessment Form**: Allows users to input their health data for heart disease risk prediction.
- **Medical Report Analysis**: Upload and analyze medical reports for insights and recommendations.

### 4. Find Nearby Cardiologists
Locate and connect with cardiologists in your area for professional medical advice and treatment.

### 5. AI-Powered Recommendations
Leveraging Google's Gemini AI to provide:
- Personalized diet plans
- Tailored exercise routines
- Lifestyle modification suggestions

### 6. Medical Chatbot
An AI-driven chatbot powered by Google's Gemini to answer user queries related to heart health and general medical concerns.

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI/ML**: Custom machine learning models for heart disease prediction
- **AI Integration**: Google's Gemini AI for personalized recommendations and chatbot functionality

## Setup Instructions

To set up the project locally, follow these steps:

1. **Clone the Repository**  
   Clone the project using:
   ```bash
   git clone https://github.com/SrikarVeluvali/HeartHealth.git
   ```

2. **Navigate to the Data Folder**  
   Go to the `data` folder in the local repository:
   ```bash
   cd HeartHealth/data
   ```

3. **Run the Jupyter Notebooks**  
   Execute the two notebook files in the `data` folder. This will generate two joblib files.

4. **Move Joblib Files**  
   Paste the generated joblib files into the `app` folder.

5. **Create Environment Variables**  
   Create `.env` files in both the `client` and `server` folders. 

6. **Add Environment Variables**  
   Add the following variables in both `.env` files:
   ```plaintext
   GEMINI_API=your_gemini_api_key_here
   MONGO_DB_URL=your_mongodb_url_here
   ```

7. **Update Flask App**  
   In the Flask app, replace the `MONGO_DB_URL` and `GEMINI_API` with the values from your `.env` files.

8. **Run the Application**  
   Open three terminal windows:
   - In the first terminal, run the Flask server:
     ```bash
     flask run
     ```
   - In the second terminal, run the Express server:
     ```bash
     npm run server
     ```
   - In the third terminal, run the React application:
     ```bash
     npm start
     ```

Now you're good to go! You can access the Heart Health App and start exploring its features.
