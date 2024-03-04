import React, { useState } from 'react';
import axios from 'axios';
import { Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import NavBar from '../Components/NavBar';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  margin-top: 5rem;
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
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const apiUrl = 'http://localhost:9000/api/auth/assessment';
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
        <Title>Assessment Form<br />Swift </Title>

        <div className="row g-3">
          {/* Form input fields */}
          <div className="col-md-4">
            <label htmlFor="age" className="form-label">
              Age (years)
            </label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min={1}
              max={100}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="sex" className="form-label">
              Sex
            </label>
            <select
              className="form-select"
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Sex</option>
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="cp" className="form-label">
              Chest Pain Type
            </label>
            <select
              className="form-select"
              id="cp"
              name="cp"
              value={formData.cp}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Chest Pain Type</option>
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="trestbps" className="form-label">
              Resting Blood Pressure (mm Hg)
            </label>
            <input
              type="number"
              className="form-control"
              id="trestbps"
              name="trestbps"
              value={formData.trestbps}
              onChange={handleChange}
              min={90}
              max={250}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="chol" className="form-label">
              Serum Cholestoral (mg/dl)
            </label>
            <input
              type="number"
              className="form-control"
              id="chol"
              name="chol"
              value={formData.chol}
              onChange={handleChange}
              min={100}
              max={580}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="fbs" className="form-label">
              Fasting Blood Sugar greater than 120 mg/dl
            </label>
            <select
              className="form-select"
              id="fbs"
              name="fbs"
              value={formData.fbs}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="restecg" className="form-label">
              Resting Electrocardiographic Results
            </label>
            <select
              className="form-select"
              id="restecg"
              name="restecg"
              value={formData.restecg}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="0">Normal</option>
              <option value="1">ST-T Wave Abnormality</option>
              <option value="2">Probable/Definite Left Ventricular Hypertrophy</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="thalach" className="form-label">
              Maximum Heart Rate Achieved
            </label>
            <input
              type="number"
              className="form-control"
              id="thalach"
              name="thalach"
              value={formData.thalach}
              onChange={handleChange}
              min={60}
              max={210}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="exang" className="form-label">
              Exercise Induced Angina
            </label>
            <select
              className="form-select"
              id="exang"
              name="exang"
              value={formData.exang}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="oldpeak" className="form-label">
              ST Depression Induced by Exercise Relative to Rest
            </label>
            <input
              type="number"
              className="form-control"
              id="oldpeak"
              name="oldpeak"
              value={formData.oldpeak}
              onChange={handleChange}
              min={0.0}
              max={7.0}
              step={0.1}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="slope" className="form-label">
              Slope of the Peak Exercise ST Segment
            </label>
            <select
              className="form-select"
              id="slope"
              name="slope"
              value={formData.slope}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Slope</option>
              <option value="0">Upsloping</option>
              <option value="1">Flat</option>
              <option value="2">Downsloping</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="ca" className="form-label">
              Number of Major Vessels (0-3) Colored by Flourosopy
            </label>
            <input
              type="number"
              className="form-control"
              id="ca"
              name="ca"
              value={formData.ca}
              onChange={handleChange}
              min={0}
              max={3}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="thal" className="form-label">
              Thal
            </label>
            <select
              className="form-select"
              id="thal"
              name="thal"
              value={formData.thal}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Thal</option>
              <option value="0">Normal</option>
              <option value="1">Fixed Defect</option>
              <option value="2">Reversible Defect</option>
            </select>
          </div>
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