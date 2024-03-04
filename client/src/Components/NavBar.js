import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
export default function NavBar() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };
  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };
  const handleFindCardiologists = async () => {
    try {
      // Use Geolocation API to get user's location
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Construct the Google Maps URL with the obtained location
        const mapsUrl = `https://www.google.co.in/maps/search/cardiologists+or+hospitals+near+me/@${latitude},${longitude},13z/data=!3m1!4b1?entry=ttu`;

        // Redirect the user to the generated Google Maps URL
        window.open(mapsUrl, '_blank');
      });
    } catch (error) {
      console.error('Error finding cardiologists:', error);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light-purple fixed-top" style={{ backgroundColor: '#3f3f83' }}>
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
          💟 Heart Health
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
            <li className="nav-item dropdown ">
              <a className="nav-link dropdown-toggle text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Assessment Forms
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/assessment">Swift </Link></li>
                <li><Link className="dropdown-item" to="/assessment2">Swift 2.0 </Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/results">Previous Results</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/analyse-report">
                Analyse a Medical Report <img src="AI.png" alt="AI" style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/self-assessment">
                Take a Self-Assessment Test <img src="AI.png" alt="AI" style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/chat">
                Talk to our Chatbot <img src="AI.png" alt="AI" style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link text-white" onClick={handleFindCardiologists}>Find nearby cardiologists</button>
            </li>

          </ul>

          <div className="dropdown text-end">
            <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://th.bing.com/th/id/OIP.58z9A9My8wXP8T2pM18stgAAAA?w=238&h=250&rs=1&pid=ImgDetMain" alt="mdo" width="32" height="32" className="rounded-circle" />
            </a>
            <ul className="dropdown-menu text-small">
              <li><Link className="dropdown-item" to="/profile">View Profile</Link></li>
              <li><Link className="dropdown-item" to="/newpassword">Change Password</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" onClick={handleLogout}>Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

  )
}
