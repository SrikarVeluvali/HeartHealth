from flask import Flask, request, jsonify
import numpy as np
from joblib import load
from pymongo import MongoClient
from bson import json_util
import google.generativeai as genai

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("YOUR_MONGODB_CONNECTION_CODE")
db = client["predictions"]
collection = db["user_predictions"]

# Configure Generative AI
genai.configure(api_key="GEMINI_API_KEY")
model = genai.GenerativeModel('gemini-pro')

@app.route("/predict", methods=["POST"])
def predict2():
    """
    Endpoint for making predictions based on user input.

    Expects a JSON payload with user data, including an email address.

    Returns a JSON response containing user input, prediction probabilities,
    and generated text using Generative AI.
    """
    data = request.json
    email_address = data.get("email")
    data.pop("email")

    # Existing prediction code
    test_np_input = np.array([list(data.values())])
    log_reg = load("LogisticRegression.joblib")
    user_prediction = log_reg.predict_proba(test_np_input)

    result = {
        "user_input": data,
        "positive_probability": round(user_prediction[0][1] * 100, 2),
        "negative_probability": round(user_prediction[0][0] * 100, 2),
    }

    # Generate text using generative AI
    formData = ", ".join([f"{key}: {value}" for key, value in data.items()])
    positive_percentage = result["positive_probability"]
    prompt = f"{formData} Given the heart health details provided, including the patient's age, sex, chest pain type, resting blood pressure, serum cholesterol, fasting blood sugar, resting electrocardiographic results, maximum heart rate achieved, exercise-induced angina, ST depression induced by exercise, slope of the peak exercise ST segment, number of major vessels colored by fluoroscopy, and thal, the calculated probability of heart disease is {positive_percentage}%. The %'s of the risk are analysed as follows: 0-30% means the patient is safe. 30%-60% means the patient has medium risk, and 60% to 100% means that the patient has higher chance of getting a heart disease. (In your diet report, dont mention the percentages anywhere, just mention the level of risk where the user falls into.). Now, analyse the data and provide the user with proper diet plan. Give the diet plan and exercise plan accordingly to the values the user entered. Give the result in this format: Diet Plans: (4-5 points based on the given values) Exercise Plans: (4-5 points based on given values) Lifestyle Changes: (4-5 points based on given values)."

    response = model.generate_content(prompt)
    generated_text = response.text

    result["generated_text"] = generated_text

    # Store the result in MongoDB
    if email_address:
        result["email"] = email_address

        # Retrieve existing user document
        user_doc = collection.find_one({"email": email_address})

        # If user exists, update the "previousResults" array
        if user_doc and "previousResults" in user_doc:
            user_doc["previousResults"].append(result)
            collection.update_one({"email": email_address}, {"$set": {"previousResults": user_doc["previousResults"]}})
        else:
            # If user doesn't exist or doesn't have "previousResults" array, create a new user document
            collection.insert_one({"email": email_address, "previousResults": [result]})

    return json_util.dumps(result)

@app.route("/predict2", methods=["POST"])
def predict():
    """
    Endpoint for making predictions based on user input.

    Expects a JSON payload with user data, including an email address.

    Returns a JSON response containing user input, prediction probabilities,
    and generated text using Generative AI.
    """
    data = request.json
    email_address = data.get("email")
    data.pop("email")

    # Reorder input data for the random forest classifier
    ordered_data = {
        "hbp": data["hbp"],
        "hch": data["hch"],
        "bmi": data["bmi"],
        "smk": data["smk"],
        "srk": data["srk"],
        "dia": data["dia"],
        "phy": data["phy"],
        "frt": data["frt"],
        "veg": data["veg"],
        "alc": data["alc"],
        "gen": data["gen"],
        "diff": data["diff"],
        "sex": data["sex"],
        "age": data["age"]
    }

    # Existing prediction code
    test_np_input = np.array([list(ordered_data.values())])
    rfclf = load("RandomForestClassifier2.joblib")
    user_prediction = rfclf.predict_proba(test_np_input)

    result = {
        "user_input": ordered_data,
        "positive_probability": round(user_prediction[0][1] * 100, 2),
        "negative_probability": round(user_prediction[0][0] * 100, 2),
    }

    # Generate text using generative AI
    formData = ", ".join([f"{key}: {value}" for key, value in ordered_data.items()])
    positive_percentage = result["positive_probability"]
    prompt = f"Generate a result in this format: Diet Plans: (4-5 points) Exercise Plans: (4-5 points) Lifestyle Changes: (4-5 points). These points should be inclined to a heart patient."

    response = model.generate_content(prompt)
    generated_text = response.text

    result["generated_text"] = generated_text

    # Store the result in MongoDB
    if email_address:
        result["email"] = email_address

        # Retrieve existing user document
        user_doc = collection.find_one({"email": email_address})

        # If user exists, update the "previousResults" array
        if user_doc and "previousResults" in user_doc:
            user_doc["previousResults"].append(result)
            collection.update_one({"email": email_address}, {"$set": {"previousResults": user_doc["previousResults"]}})
        else:
            # If user doesn't exist or doesn't have "previousResults" array, create a new user document
            collection.insert_one({"email": email_address, "previousResults": [result]})

    return json_util.dumps(result)

@app.route("/previous_results", methods=["POST"])
def get_previous_results():
    """
    Endpoint for retrieving previous prediction results based on an email address.

    Expects a JSON payload with an email address.

    Returns a JSON response containing previous results or an error message.
    """
    data = request.json
    email_address = data.get("email")
    if email_address:
        user_doc = collection.find_one({"email": email_address}, {"_id": 0})
        if user_doc:
            return jsonify(user_doc)
        else:
            return jsonify({"message": "No results found for the given email"}), 404
    else:
        return jsonify({"message": "Email parameter is missing"}), 400

if __name__ == "__main__":
    app.run(debug=True)
