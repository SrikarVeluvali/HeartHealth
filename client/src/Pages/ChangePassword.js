import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "../Services/axiosInterceptor";

const ChangePassword = () => {
  // Extracting id and token from the URL parameters
  const { id, token } = useParams();
  const navigate = useNavigate();

  // State to manage input fields for new password and confirm password
  const [input, setInput] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to change the password using the provided id, token, and input data
      const res = await axios.post(`/api/auth/forget-password/${id}/${token}`, input);

      // If the password is changed successfully, show an alert and navigate to the login page
      if (res.status === 200) {
        alert("Password Changed Successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      // Update UI to show the error message
    }
  };

  // JSX structure for the ChangePassword component
  return (
    <section className="vh-100" style={{ backgroundColor: "#8585cf" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-8 col-lg-10 col-md-12">
            <div className="card shadow-lg p-3 mb-5 bg-white rounded">
              <div className="row g-0">
                <div className="col-md-12">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit}>
                      <div className="text-center mb-4">
                        <i className="fas fa-cubes fa-3x me-2" style={{ color: "#ff6219" }}></i>
                        <span className="h2 fw-bold">Change Password</span>
                      </div>

                      <h5 className="fw-normal mb-4" style={{ letterSpacing: "1px" }}>
                        Type in your new password to change your password.
                      </h5>

                      <div className="mb-4">
                        {/* Input field for new password */}
                        <input
                          type="password"
                          placeholder="Enter New Password"
                          className="form-control form-control-lg mb-4"
                          name="newPassword"
                          value={input.newPassword}
                          onChange={(e) =>
                            setInput({
                              ...input,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                        {/* Input field for confirming the new password */}
                        <input
                          type="password"
                          placeholder="Enter Confirm Password"
                          className="form-control form-control-lg"
                          name="confirmPassword"
                          value={input.confirmPassword}
                          onChange={(e) =>
                            setInput({
                              ...input,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="pt-2 mb-4">
                        {/* Submit button to change the password */}
                        <button className="btn btn-dark btn-lg btn-block" type="submit">
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
