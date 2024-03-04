import mongoose from "mongoose";

// Define the schema for the user model
const authSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
});

// Create the user model based on the schema
const authModel = mongoose.model("user", authSchema);

export default authModel;
