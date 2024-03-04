import React, { useState } from "react";
import axios from "../Services/axiosInterceptor";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  // React hooks to manage state
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the login endpoint
      const response = await axios.post("api/auth/users/login", input);

      // If the login is successful, store user data in local storage and navigate to home
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        navigate("/");
      }
    } catch (error) {
      // If login fails, set an error message
      setError("Invalid Login Details (or) User not registered");
      setShowError(true);
    }
  };

  // JSX structure for the login component
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

      {/* Login Section */}
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            {/* Image Section */}
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src="logon.png" className="img-fluid" alt="Sample image" />
            </div>

            {/* Login Form Section */}
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form onSubmit={handleLogin}>
                <div className="text-center mb-2">
                  <h2 className="mb-5">Login</h2>
                </div>

                {/* Error Alert */}
                {showError && (
                  <div className="alert alert-warning" role="alert">
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example3">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="form3Example3"
                    placeholder="Enter Email"
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
                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="form3Example4">
                    Password
                  </label>
                  <input
                    type="password"
                    id="form3Example4"
                    placeholder="Enter Password"
                    className="form-control form-control-lg"
                    name="password"
                    value={input.password}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Remember Me and Forgot Password Links */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      value=""
                      id="form2Example3"
                    />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>
                  <Link to={"/reset-password"} className="text-body">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button and Registration Link */}
                <div className="text-center text-lg-start">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  >
                    Login
                  </button>
                  <p className="small fw-bold mt-2 pt-1">
                    Don't have an account?{" "}
                    <Link to="/register" className="link-danger">
                      Register here
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

export default Login;
