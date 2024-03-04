import React, { useState } from "react";
import axios from "../Services/axiosInterceptor";
import { useNavigate, Link } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  // State to manage the email input and success message
  const [email, setEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the server to initiate the forget password process
      await axios.post("/api/auth/forget-password", { email }, { timeout: 10000 });

      // Update state to indicate success
      setRequestSent(true);
    } catch (error) {
      console.error("Error submitting forget password request:", error.message);
      // Update UI to show the error message
    }
  };
  // JSX structure for the registration component
  return (
    <>
      {/* Global Styles */}
      <style>
        {`
          .divider:after,
          .divider:before {
            content: "";
            flex: 1;
            height: 1px;
            background: #eee;
          }
          
          .h-custom {
            height: calc(100% - 73px);
          }
          
          @media (max-width: 450px) {
            .h-custom {
              height: 100%;
            }
          }

          /* Custom Color Theme */

          .bg-primary {
            background-color: #8585cf;
          }

          .btn-primary {
            background-color: #8585cf;
            border-color: #8585cf;
          }

          .btn-primary:hover {
            background-color: #6d6da9;
            border-color: #6d6da9;
          }

          .link-danger {
            color: #8585cf;
          }
          .bg-purple{
            background-color:#6d6da9
          }
        `}
      </style>

      {/* Registration Section */}
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            {/* Image Section */}
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src="logon.png" className="img-fluid" alt="Sample image" />
            </div>

            {/* Registration Form Section */}


            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              {requestSent ? (
                <><span className="h2 fw-light">Password Reset Request sent to {email}.</span>
                  <div className="text-center mt-5">
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>
                      Go to Login
                    </button>
                  </div></>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="text-center mb-2">
                    <h2 className="mb-5">Forgot Password?</h2>
                    <h5 className="fw-normal mb-4" style={{ letterSpacing: "1px" }}>
                      Type your email here so we can help you with your problem.
                    </h5>
                    <p>We will send you an email with a password setup link. Follow the instructions there to reset your password.</p>
                  </div>


                  {/* Full Name Input */}
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example3">
                      Full Name
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="form-control form-control-lg"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Register Button and Login Link */}
                  <div className="text-center text-lg-start">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    >
                      Send Verification Link
                    </button>
                  </div>
                </form>
              )}


            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;
