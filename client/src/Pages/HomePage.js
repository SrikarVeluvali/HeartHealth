import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import NavBar from '../Components/NavBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';



const ImageContainer = styled.div`
  display: inline-block;
`;

const HeartbeatImage = styled.img`
  max-width:  200px;
  max-height: 200px;
  object-fit: cover;
`;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDIceResPAczirGngM8x1rqBOw-eJ8qdUo");
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const HomePage = () => {
  // Retrieve user information from local storage
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  // State to store results and loading status
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect to fetch results when the component mounts
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch results from the Express API
        const expressApiUrl = 'http://localhost:9000/api/auth/results';
        const userEmail = localStorage.getItem('email');
        const userToken = localStorage.getItem('token');

        if (userEmail) {
          const expressResponse = await axios.post(
            expressApiUrl,
            { email: userEmail },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          // Set the results in the state
          setResults(expressResponse.data);

        } else {
          console.error('User email not found in local storage');
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        // Set loading to false after fetching results
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // State variables for greeting and fun fact
  const [greeting, setGreeting] = useState('');
  const [funFact, setFunFact] = useState('Loading...');
  const [tips, setTips] = useState([
    "Explore different assessment forms 📝!",
    "Take the Swift forms for faster, accurate results and tracking!",
    "Take the Swift 2.0 form for more casual assessment!",
    "Have a medical report ⚕️? Scan it using our AI and get recomendations and suggestions!",
    "Use our own chatbot 🤖 for any queries related to your heart health!",
    "Go to your Profile to check your heart tracking results 🏃!",
    "Find nearby hospitals and cardiologists for instant help 😷!",
    "Take the Self-Assessment Test for more detailed and personalised results!",
  ]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 6000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [tips]);
  // useEffect to set the greeting and generate a fun fact when the component mounts
  useEffect(() => {
    const currentTime = new Date().getHours();
    setGreeting(currentTime < 12 ? 'Good Morning' : currentTime < 16 ? 'Good Afternoon' : 'Good Evening');
    generateFunFact(); // Call the function to generate and set the fun fact text
  }, []);
  // Function to generate a fun fact using Google Generative AI
  const generateFunFact = async () => {
    const prompt = 'Give me a surprising and unknown fact about the human heart. (1 line only). Dont include information like it beats 100,000 times a day or something common. Show me something that\'s uncommon. The facts should be both theoritical and biological too. ';
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setFunFact(text);
    }
    catch (error) {
      setFunFact('Oops! Something went wrong!');
    }
  };
  // JSX structure for the HomePage component
  return (
    <>
      <style>
        {`
        body {
          padding-top: 40px;
        }

        .greeting-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url("graybg.jpg");
          background-size: cover;
          margin: 0;
        }
        .tips-transition {
          transition: opacity 0.5s ease-in-out; // Add transition for opacity
        }
        .remaining-info-section {
          padding: 50px 0;
        }

        .tips-container {
          width: 100%;
          max-width: 80%; /* Adjust the maximum width as needed */
          margin: 0 auto;
          overflow: hidden;
        }

        .tips-transition {
          transition: opacity 0.5s ease-in-out;
        }

        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .text-container {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .image-container {
          margin-top: 20px; /* Adjust the margin as needed */
        }

        .footer {
          margin-top: 20px; /* Adjust the margin as needed */
        }
      `}
      </style>
      <NavBar />

      {/* Greeting Section */}
      <section className="greeting-section bg-purple text-white p-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-8">
              <div className="card rounded shadow-lg text-center" style={{ backgroundColor: '#333333' }}>
                <div className="card-body p-4 p-lg-5 d-flex align-items-center">
                  <div className="text-container">
                    <h2 className="fw-bold mb-3">
                      {greeting}, {name}!
                    </h2>
                    {results && results.previousResults && results.previousResults.length > 0 && (
                      <div>
                        <Link to="/results" className="result-link" style={{ textDecoration: 'none', color: 'white' }}>
                          <h4>Most Recent Result: <span style={results.previousResults[results.previousResults.length - 1].positive_probability > 70 ? { color: 'red' } : results.previousResults[results.previousResults.length - 1].positive_probability > 40 ? { color: 'yellow' } : { color: 'green' }}>{results.previousResults[results.previousResults.length - 1].positive_probability}%</span></h4>
                        </Link>
                        <ProgressBar
                          variant={results.previousResults[results.previousResults.length - 1].positive_probability > 70 ? "danger" : results.previousResults[results.previousResults.length - 1].positive_probability > 40 ? "warning" : "success"}
                          now={results.previousResults[results.previousResults.length - 1].positive_probability}
                          label={`${results.previousResults[results.previousResults.length - 1].positive_probability}%`}
                          max={100}
                          style={{
                            backgroundColor: '#334444',
                          }}
                          className="mb-2"
                        />
                      </div>
                    )}
                    <hr />
                    <div className="mb-4"></div>
                    <div className="tips-container">
                      <p className="lead tips-transition">
                        {tips.length > 0 && (
                          <b>{tips[currentTipIndex]}</b>
                        )}
                      </p>
                    </div>
                    <hr />
                    <p className="lead">
                      <b>Fun fact: </b>
                      {funFact}
                    </p>
                  </div>
                  <ImageContainer>
                    <HeartbeatImage
                      src="pixelheart.gif"
                      alt="Illustration"
                    />
                  </ImageContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="remaining-info-section additional-content py-5 text-white" style={{ backgroundColor: '#3f3f83' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h3 className="fw-bold mb-4">Discover the Future of Heart Health with Our AI-based App</h3>
              <p>
                Our commitment to your well-being has driven us to enhance our app significantly. Explore the cutting-edge features that make us a leader in heart health management.
              </p>
              <p>
                With the introduction of Swift, our state-of-the-art assessment forms powered by machine learning models, you can now receive near-accurate results tailored to your unique profile. The Swift forms, coupled with our self-assessment tool, offer personalized insights into your heart health, empowering you to make informed decisions for a healthier lifestyle.
              </p>
              <p>
                Our app goes beyond traditional assessments. We've incorporated a revolutionary feature allowing you to upload and analyze any medical report. Uncover trends and gain deeper insights into your health with our comprehensive analysis tool.
              </p>
              <p className="fw-bold mt-3">Meet Our Team:</p>
              <ul>
                {/* Updated list of team members */}
                <li title='Chuuha 🐭'>Aka Meher Archana (22BD1A0541)</li>
                <li title='Unfunny Charan'>Anpur Phani Charan (22BD1A1201)</li>
                <li title='Sai Pratham'>Sesha Sai Pratiek Yeggina (22BD1A1253)</li>
                <li title='Frontend dev'>Siddharth Katrapalli (22BD1A1228)</li>
                <li title='???'>Srikar Veluvali (22BD1A1264)</li>
                <li title='SmashKarts'>U V N Vardhan (22BD1A1262)</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h3 className="fw-bold mb-4">Embark on Your Journey to Heart Wellness</h3>
              <p>
                Begin your path to a healthier heart by taking our revamped comprehensive assessment forms - Swift. These forms, driven by advanced machine learning models, ensure near-accurate results tailored to your individual health profile.
              </p>
              <p>
                Our self-assessment form further adds a personalized touch, providing insights into your health based on your unique lifestyle, habits, and medical history. Your well-being is our priority, and our tools are designed to empower you with the information you need to lead a healthier and happier life.
              </p>
              <p>
                The innovation doesn't stop there. Our app now boasts a groundbreaking Chatbot feature. Engage in conversations ranging from heart health to general health queries. Our Chatbot is your virtual companion, ready to assist you on your journey to well-being.
              </p>
              <p>
                Taking the assessment is simple and confidential. Rest assured, your data is secure, and the results are readily available for your review. We believe that understanding your heart health is the first step towards making informed decisions for a healthier and happier life.
              </p>
            </div>
          </div>
        </div>
      </section>


      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col-md-4 mb-0 text-body-secondary">© Heart Health App By G114</p>

          <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">

          </a>
        </footer>
      </div>

    </>
  );
};

export default HomePage;
