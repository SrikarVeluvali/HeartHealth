# Heart Health App

Heart Health is a comprehensive MERN (MongoDB, Express.js, React.js, Node.js) application integrated with AI/ML capabilities to predict heart disease risk and provide personalized health recommendations.

## Features

### 1. Heart Disease Prediction
Utilizes machine learning algorithms to assess the risk of heart disease based on user-input health data.

### 2. Dashboard
A user-friendly interface to view health statistics, predictions, and recommendations at a glance.
![image](https://github.com/user-attachments/assets/a1b539b0-4ade-4d5b-9c5b-e9a84d3c5c4f)


### 3. Additional Assessment Forms
- **Health Assessment Forms**: Allows users to input their heart data to follow up with recommendations.
- ![image](https://github.com/user-attachments/assets/842ef18e-df2b-4389-974e-734a7e583f50)
- ![image](https://github.com/user-attachments/assets/d9acea32-81c4-4518-9bd4-938680059180)
- ![image](https://github.com/user-attachments/assets/54c2249e-f909-46b8-8705-f77cbaa9a292)


- **Self-Assessment Form**: Allows users to input their health data for heart disease risk prediction.
- ![image](https://github.com/user-attachments/assets/45a17d7b-aa31-481c-9813-15f0633893de)
- ![image](https://github.com/user-attachments/assets/97d33068-8f2d-4f74-945c-96fc9250f896)

- **Medical Report Analysis**: Upload and analyze medical reports for insights and recommendations.
- ![image](https://github.com/user-attachments/assets/1e0cb980-9c05-4799-933c-2c4e3dbdddfe)

### 4. Find Nearby Cardiologists
Locate and connect with cardiologists in your area for professional medical advice and treatment.

### 5. AI-Powered Recommendations
Leveraging Google's Gemini AI to provide:
- Personalized diet plans
- Tailored exercise routines
- Lifestyle modification suggestions

### 6. Medical Chatbot
An AI-driven chatbot powered by Google's Gemini to answer user queries related to heart health and general medical concerns.
![image](https://github.com/user-attachments/assets/835811a5-1dc5-45b9-8679-03919f15da72)

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
