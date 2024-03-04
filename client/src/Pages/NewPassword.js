import React, { useState } from 'react';
import axios from "../Services/axiosInterceptor";
import { useNavigate } from 'react-router-dom';

export default function NewPassword() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const [input, setInput] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(input.newPassword)) {
      setError("Password must contain one capital letter, one number, and one special character.");
      return;
    }

    const response = await axios.post("api/auth/change-password", input, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    alert(response.data.message);

    if (response.status === 200) {
      handleLogout();
    }
  };

  return (
    <section className="change-password-section py-5 bg-gray text-black">
      <div className="container">
        <div className="row card">
          <div className="card-body col-md-6 offset-md-3 text-center">
            <h2 className='mb-4'>Change Your Password</h2>

            {/* Display error message */}
            {error && (
              <div className="alert alert-warning" role="alert">
                {error}
              </div>
            )}

            {/* Form for changing the password */}
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter New Password"
                  className="form-control form-control-lg"
                  name="newPassword"
                  value={input.newPassword}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
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
              <div className="mb-4">
                {/* Button to submit the password change form */}
                <button className="btn btn-success btn-lg btn-block" type="submit">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
