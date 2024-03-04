import React, { useState } from 'react';
import axios from 'axios';
import { Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import NavBar from '../Components/NavBar';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  margin-left: 2rem;
  margin-right:2rem;
  margin-top:4rem;
`;

const Form = styled.form`
  background: #343a40; /* Dark background color */
  padding: 2rem;
  border-radius: 0.5em;
`;

const Title = styled.h2`
  margin-top: 1.5rem;
  text-align: center;
  color: white;
`;

const SubmitButton = styled.button`
  color: white;
  padding: 0.7em 1.7em;
  font-size: 18px;
  border-radius: 0.5em;
  background: #3f3f83;
  cursor: pointer;
  border: 1px solid #6464b4;
  transition: all 0.3s;
  box-shadow: 6px 6px 12px #6464b4, -6px -6px 12px #6464b4;
  margin: 30px auto; /* Center the button */
  display: block; /* Make it a block element to center it horizontally */
  width: fit-content; /* Make the button width fit its content */

  &:hover {
    background: #6464b4;
  }
`;


const LoadingModal = styled(Modal)`
  .modal-body {
    text-align: center;
  }
`;

const ResultContainer = styled.div`
  margin-top: 1rem;
`;

const ResultText = styled.p`
  color: white;

  .highlight-text {
    font-weight: bold;
  }
`;

const AlertMessage = styled.div`
  background-color: #dc3545;
  color: white;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 0.5em;
`;

const GeneratedTextTitle = styled.h4`
  color: #007bff;
`;

const ActionButton = styled.button`
  margin-right: 1rem;
`;
const AssessmentForm = () => {
  // State to manage form data, prediction, loading, and modal visibility
  const [formData, setFormData] = useState({
    age: null,
    alc: null,
    bmi: null,
    dia: null,
    diff: null,
    frt: null,
    veg: null,
    gen: null,
    hbp: null,
    hch: null,
    phy: null,
    sex: null,
    smk: null,
    srk: null,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const customPropertyLabels = {
    age: 'Age',
    alc: 'Do you consume more amounts of alcohol?',
    bmi: 'Body Mass Index',
    dia: 'Select your stage of Diabetes',
    diff: 'Did you notice any Difference In Walking?',
    frt: 'Do you consume Fruits?',
    veg: 'Do you consume Vegetables?',
    gen: 'General Health on Scale of 1 to 5',
    hbp: 'Do you have High BP?',
    hch: 'Do you have High Cholesterol?',
    phy: 'Do you concentrate on Physical Exercise often?',
    sex: 'Sex (M/F)',
    smk: 'Do you Smoke?',
    srk: 'History of having stroke?',
  };
  const customCategoricalMappings = {
    sex: { 0: 'Female', 1: 'Male' },
    alc: { 0: 'No', 1: 'Yes' },
    dia: { 0: 'No / Only during pregnancy', 1: 'Pre-diabetes / Borderline diabetes', 2: 'Yes' },
    diff: { 0: 'No', 1: 'Yes' },
    frt: { 0: 'No', 1: 'Yes' },
    veg: { 0: 'No', 1: 'Yes' },
    hbp: { 0: 'No', 1: 'Yes' },
    hch: { 0: 'No', 1: 'Yes' },
    phy: { 0: 'No', 1: 'Yes' },
    smk: { 0: 'No', 1: 'Yes' },
    srk: { 0: 'No', 1: 'Yes' },
  };
  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert the value to a number if it's not null
    const numericValue = parseFloat(value);

    setFormData({ ...formData, [name]: numericValue });
  };


  // State to manage prediction data
  const [predictionData, setPredictionData] = useState({
    positiveProbability: null,
    negativeProbability: null,
    generatedText: null,
  });

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API endpoint and user information from local storage
      const apiUrl = 'http://localhost:9000/api/auth/assessment2';
      const userEmail = localStorage.getItem('email');
      const userToken = localStorage.getItem('token');

      // Convert form data to numeric values
      const numericFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
      );

      if (userEmail) {
        // Make a POST request to the assessment endpoint
        const response = await axios.post(apiUrl, { ...numericFormData, email: userEmail }, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        // Set the prediction data in the state and show the modal
        setPredictionData({
          positiveProbability: response.data.positive_probability,
          negativeProbability: response.data.negative_probability,
          generatedText: response.data.generated_text,
        });
        setShowModal(true);
      } else {
        console.error('User email not found in local storage');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleFindCardiologists = async () => {
    try {
      // Use Geolocation API to get user's location
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Construct the Google Maps URL with the obtained location
        const mapsUrl = `https://www.google.co.in/maps/search/cardiologists+near+me/@${latitude},${longitude},13z/data=!3m1!4b1?entry=ttu`;

        // Redirect the user to the generated Google Maps URL
        window.open(mapsUrl, '_blank');
      });
    } catch (error) {
      console.error('Error finding cardiologists:', error);
    }
  };
  // Function to close the result modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // JSX structure for the assessment form component
  return (
    <Container>
      <NavBar />
      <Form onSubmit={handleSubmit}>
        <Title>Assessment Form <br />Swift 2.0 </Title>

        {/*FORM FIELDS*/}
        <div className="row g-3">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <select
                id="age"
                name="age"
                className="form-control"
                onChange={handleChange}
                required
              >
                <option value="">Select Age Range</option>
                <option value="1">18-24</option>
                <option value="2">25-31</option>
                <option value="3">32-38</option>
                <option value="4">39-45</option>
                <option value="5">46-52</option>
                <option value="6">53-59</option>
                <option value="7">60-66</option>
                <option value="8">67-73</option>
                <option value="9">74-80</option>
                <option value="10">81-87</option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="gen">How do you rate your General Health?<br /> {formData.gen ?
                (formData.gen === 1 ? 'Best 😁' :
                  formData.gen === 2 ? 'Good 😊' :
                    formData.gen === 3 ? 'Average 😐' :
                      formData.gen === 4 ? 'Bad ☹️' :
                        'Worst 😭') : 'Slide the ball left or right'}</label>
              <input
                type="range"
                id="gen"
                name="gen"
                min="1"
                max="5"
                step="1"
                defaultValue={3}
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="bmi">Body Mass Index (BMI)</label>
              <input
                type="number"
                id="bmi"
                name="bmi"
                className="form-control"
                onChange={handleChange}
                min={18.5}
                max={39.9}
                step={0.1}
                required
              />
            </div>
          </div>

          {Object.keys(customCategoricalMappings).map((key) => (
            <div key={key} className="form-group col-md-4">
              <label>{customPropertyLabels[key]}</label>
              <div>
                {Object.entries(customCategoricalMappings[key]).map(
                  ([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        required
                        className='m-2'
                      />
                      {label}
                    </label>
                  )
                )}
              </div>
            </div>

          ))}
        </div>





        {/* Submit button */}
        <SubmitButton type="submit">Submit</SubmitButton>
      </Form>

      {/* Loading Spinner Modal */}
      <LoadingModal show={loading} onHide={() => { }} backdrop="static" keyboard={false}>
        <Modal.Body>
          <Spinner animation="border" role="status" />
          <p>Loading...</p>
        </Modal.Body>
      </LoadingModal>
      {/* Prediction Result Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Heart Health Prediction Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AlertMessage role="alert">
            <strong>Warning!</strong> The following results are generated by a Machine Learning Model and may not be accurate. For more reliable results, consult a doctor or cardiologist.
          </AlertMessage>
          <ResultContainer>
            <ResultText>
              Based on the assessment, there is a chance of{" "}
              <span className="highlight-text font-weight-bold" style={{ fontSize: '25px' }}>{predictionData.positiveProbability}%</span> that you may have heart disease.
            </ResultText>
          </ResultContainer>
          {/* Display generated recommendations */}
          <div className="mt-4">
            <GeneratedTextTitle className="text-primary">Recommendations and Next Steps:</GeneratedTextTitle>
            <ReactMarkdown>{predictionData.generatedText}</ReactMarkdown>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* Link to view previous results */}
          {predictionData && predictionData.positiveProbability > 50 && (
            <ActionButton type="button" className="btn btn-danger" onClick={handleFindCardiologists}>
              ⚠️ Find Cardiologists nearby
            </ActionButton>
          )}
          <Link to="/results">
            <ActionButton className="btn btn-secondary">View Previous Results</ActionButton>
          </Link>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AssessmentForm;