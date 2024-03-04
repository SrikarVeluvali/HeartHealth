import React, { useState } from 'react';
import { Form, Col, Row, Container, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import ReactMarkdown from 'react-markdown';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const AssessmentForm = () => {
  const [Result, setResult] = useState('...');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const generateResult = async () => {
    setLoading(true);
    const prompt = `
    Assessment for ${formData.name} (${formData.age} years old, ${formData.gender}):
    Patient Overview:
    - Lifestyle: ${formData.physicalActivity}, Smoker: ${formData.smoke}, Fruits and Vegetables: ${formData.fruitsVegetables}, High-fat Processed Foods: ${formData.highFatProcessedFoods}
    - Medical History: Family History of Heart Disease: ${formData.familyHistoryHeartDisease}, Diagnosed Diabetes: ${formData.diagnosedDiabetes}
    
    - Symptoms: Chest Pain: ${formData.chestPain}, Shortness of Breath: ${formData.shortOfBreath}
    - Blood Pressure: (Known?): ${formData.knowBloodPressure}
    - Weight: ${formData.currentWeight},Height: ${formData.currentHeight}, Cholesterol Levels: (Known?): ${formData.knowCholesterolLevels}
    - Stress Level (1-10): ${formData.stressLevel}, Alcohol Consumption: ${formData.alcoholConsumption}
    - Sleep Hours: ${formData.sleepHours}, Dizziness or Fainting: ${formData.dizzinessFainting}
    - Checkup Frequency: ${formData.checkupFrequency}, Taking Medications: ${formData.takingMedications}

    Given the user's responses, the assessment indicates a potential risk of heart-related problems.    
    Using the above information solely as the center of information, recommend a diet plan or changes in lifestyle to keep a healthy lifestyle or improve his lifestyle. Give around 10-20 points in change in lifestyle and balanced diet.

    Mention at the end that "This assessment is based solely on the information provided in the health assessment form, and a comprehensive examination by a healthcare professional is crucial for accurate diagnosis and tailored recommendations".
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setResult(text);
    setLoading(false);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    physicalActivity: '',
    smoke: '',
    fruitsVegetables: '',
    highFatProcessedFoods: '',
    familyHistoryHeartDisease: '',
    diagnosedDiabetes: '',
    chestPain: '',
    shortOfBreath: '',
    knowBloodPressure: '',
    currentWeight: '',
    knowCholesterolLevels: '',
    stressLevel: '',
    alcoholConsumption: '',
    sleepHours: '',
    dizzinessFainting: '',
    checkupFrequency: '',
    takingMedications: '',
    additionalComments: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    generateResult();
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Container className="container mt-5 bg-dark p-4 rounded">
      <NavBar />
      <h2 className="mt-3 mx-auto text-center">Self Assessment Form </h2>
      <h2 className="mb-4">Personal Information:</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Age:</Form.Label>
              <Form.Control
                type="text"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Gender:</Form.Label>
              <Form.Control
                type="text"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <h2 className="mt-4">Diet:</h2>
        <Form.Group>
          <Form.Label>How would you describe your daily physical activity?</Form.Label>
          <Form.Control
            type="text"
            value={formData.physicalActivity}
            onChange={(e) => handleChange('physicalActivity', e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Do you smoke? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.smoke}
            onChange={(e) => handleChange('smoke', e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>How often do you consume fruits and vegetables?</Form.Label>
          <Form.Control
            type="text"
            value={formData.fruitsVegetables}
            onChange={(e) => handleChange('fruitsVegetables', e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>How often do you eat high-fat or processed foods?</Form.Label>
          <Form.Control
            type="text"
            value={formData.highFatProcessedFoods}
            onChange={(e) => handleChange('highFatProcessedFoods', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Medical History:</h2>
        <Form.Group>
          <Form.Label>Do you have a family history of heart disease? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.familyHistoryHeartDisease}
            onChange={(e) => handleChange('familyHistoryHeartDisease', e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Have you been diagnosed with diabetes? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.diagnosedDiabetes}
            onChange={(e) => handleChange('diagnosedDiabetes', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Symptoms:</h2>
        <Form.Group>
          <Form.Label>Do you experience chest pain or discomfort? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.chestPain}
            onChange={(e) => handleChange('chestPain', e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Do you often feel short of breath, even at rest? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.shortOfBreath}
            onChange={(e) => handleChange('shortOfBreath', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Blood Pressure:</h2>
        <Form.Group>
          <Form.Label>Do you know your current blood pressure? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.knowBloodPressure}
            onChange={(e) => handleChange('knowBloodPressure', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Weight:</h2>
        <Form.Group>
          <Form.Label>What is your current weight?</Form.Label>
          <Form.Control
            type="text"
            value={formData.currentWeight}
            onChange={(e) => handleChange('currentWeight', e.target.value)}
          />
        </Form.Group>
        <h2 className="mt-4">Height:</h2>
        <Form.Group>
          <Form.Label>What is your current height?</Form.Label>
          <Form.Control
            type="text"
            value={formData.currentHeight}
            onChange={(e) => handleChange('currentHeight', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Cholesterol Levels:</h2>
        <Form.Group>
          <Form.Label>Do you know your cholesterol levels? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.knowCholesterolLevels}
            onChange={(e) => handleChange('knowCholesterolLevels', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Stress Level:</h2>
        <Form.Group>
          <Form.Label>How would you rate your stress level on a scale of 1 to 10? (1 being low, 10 being high)</Form.Label>
          <Form.Control
            type="text"
            value={formData.stressLevel}
            onChange={(e) => handleChange('stressLevel', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Alcohol Consumption:</h2>
        <Form.Group>
          <Form.Label>How often do you consume alcoholic beverages?</Form.Label>
          <Form.Control
            type="text"
            value={formData.alcoholConsumption}
            onChange={(e) => handleChange('alcoholConsumption', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Sleep Patterns:</h2>
        <Form.Group>
          <Form.Label>How many hours of sleep do you typically get per night?</Form.Label>
          <Form.Control
            type="text"
            value={formData.sleepHours}
            onChange={(e) => handleChange('sleepHours', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Physical Symptoms:</h2>
        <Form.Group>
          <Form.Label>Have you experienced dizziness or fainting spells? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.dizzinessFainting}
            onChange={(e) => handleChange('dizzinessFainting', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Regular Checkups:</h2>
        <Form.Group>
          <Form.Label>How often do you visit your healthcare provider for checkups?</Form.Label>
          <Form.Control
            type="text"
            value={formData.checkupFrequency}
            onChange={(e) => handleChange('checkupFrequency', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Medication:</h2>
        <Form.Group>
          <Form.Label>Are you currently taking any medications? (Yes/No)</Form.Label>
          <Form.Control
            type="text"
            value={formData.takingMedications}
            onChange={(e) => handleChange('takingMedications', e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-4">Additional Comments:</h2>
        <Form.Group>
          <Form.Label>Is there anything else you would like to share about your health that might be relevant?</Form.Label>
          <Form.Control
            as="textarea"
            value={formData.additionalComments}
            onChange={(e) => handleChange('additionalComments', e.target.value)}
          />
        </Form.Group>

        <button
          type="submit"
          onClick={generateResult}
          className="mt-5 mx-auto"
          style={{
            color: 'white',
            padding: '0.7em 1.7em',
            fontSize: '18px',
            borderRadius: '0.5em',
            background: '#3f3f83',
            cursor: 'pointer',
            border: '1px solid #6464b4',
            transition: 'all 0.3s',
            boxShadow: '6px 6px 12px #6464b4, -6px -6px 12px #6464b4',
          }}
        >
          Submit
        </button>


      </Form>
      <Modal show={loading} onHide={() => { }} backdrop="static" keyboard={false}>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-2">Please wait, generating result...</p>
        </Modal.Body>
      </Modal>

      {/* Result Modal */}
      <Modal show={showModal} onHide={handleClose} centered dialogClassName="custom-modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Assessment Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <strong>Warning:</strong> This assessment is AI-generated, and some facts might contain inaccuracies or faults. Consult a nearby doctor or cardiologist for detailed checkup.
          </Alert>
          <ReactMarkdown>{Result}</ReactMarkdown>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AssessmentForm;
