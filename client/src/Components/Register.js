import React, { useState } from "react";
import axios from "../Services/axiosInterceptor";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordWarning, setPasswordWarning] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setInput({
      ...input,
      password: newPassword,
    });

    let warningMessage = "";
    if (!newPassword.match(/[A-Z]/)) {
      warningMessage += "Password must contain at least 1 capital letter. ";
    }
    if (!newPassword.match(/[!@#$%^&*]/)) {
      warningMessage += "Password must contain at least 1 special character. ";
    }
    if (!newPassword.match(/[0-9]/)) {
      warningMessage += "Password must contain at least 1 number. ";
    }

    setPasswordWarning(warningMessage);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if there's a password warning or if the password is not valid
    if (passwordWarning || !isPasswordValid(input.password)) {
      return;
    }

    try {
      const response = await axios.post("api/auth/users/register", input);
      setRegistrationSuccess(true);

      // If registration is successful, navigate to the login page
      if (response.status === 201) {
        setTimeout(() => {
          setRegistrationSuccess(false);
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Registration failed:", error.response.data.message);
      // Update your UI to show the error message
      alert(error.response.data.message);
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
              <form onSubmit={handleRegister}>
                <div className="text-center mb-2">
                  <h2 className="mb-5">Sign-up</h2>
                </div>

                {/* Password Warning */}
                {passwordWarning && (
                  <div className="alert alert-warning mt-2" role="alert">
                    {passwordWarning}
                  </div>
                )}

                {/* Registration Success Message */}
                {registrationSuccess && (
                  <div className="alert alert-warning mt-2" role="alert">
                    Please Verify your given email address...
                  </div>
                )}

                {/* Full Name Input */}
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    className="form-control form-control-lg"
                    name="name"
                    value={input.name}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Email Input */}
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Valid Email Address"
                    className="form-control form-control-lg"
                    name="email"
                    value={input.email}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Password Input */}
                <div className="form-outline mb-5">
                  <label className="form-label" htmlFor="form3Example4">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    className="form-control form-control-lg"
                    name="password"
                    value={input.password}
                    onChange={handlePasswordChange}
                  />
                </div>

                {/* Register Button and Login Link */}
                <div className="text-center text-lg-start">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  >
                    Register
                  </button>
                  <p className="small fw-bold mt-2 pt-1">
                    Already have an account?{" "}
                    <Link to="/login" className="link-danger">
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
