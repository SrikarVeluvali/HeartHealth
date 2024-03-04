import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';
import NavBar from '../Components/NavBar';
import styled from 'styled-components';
import ProgressBar from 'react-bootstrap/ProgressBar';

// Styled components
const AccordionContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;
const NewButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background-color: rgb(27, 27, 27);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition-duration: 0.3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.11);

  &:hover {
    background-color: rgb(150, 94, 255);
    transition-duration: 0.3s;
  }

  .svgIcon {
    fill: rgb(255, 255, 255);
    animation: slide-in-top 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .icon2 {
    width: 18px;
    height: 5px;
    border-bottom: 2px solid rgb(235, 235, 235);
    border-left: 2px solid rgb(235, 235, 235);
    border-right: 2px solid rgb(235, 235, 235);
  }

  .tooltip {
    position: absolute;
    right: -105px;
    opacity: 0;
    background-color: rgb(12, 12, 12);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition-duration: 0.2s;
    pointer-events: none;
    letter-spacing: 0.5px;

    &:before {
      position: absolute;
      content: "";
      width: 10px;
      height: 10px;
      background-color: rgb(12, 12, 12);
      background-size: 1000%;
      background-position: center;
      transform: rotate(45deg);
      left: -5%;
      transition-duration: 0.3s;
    }

    @keyframes slide-in-top {
      0% {
        transform: translateY(-10px);
        opacity: 0;
      }

      100% {
        transform: translateY(0px);
        opacity: 1;
      }
    }
  }
`;
const AccordionToggle = styled.div`
  cursor: pointer;
  padding: 10px;
  background-color: #3f3f83; /* Toggle background color */
  color: #fff;
  border-radius: 12px 12px 12px 12px;
`;

const Container = styled.div`
  margin-top: 5rem;
`;

const ResultsContainer = styled.div`
  background: #2d3238; /* Dark background color */
  padding: 2rem;
  border-radius: 0.5em; /* Fade-in animation */
`;

const ResultCard = styled.div`
  background: #25282c; /* Card background color */
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3f3f83; /* Header background color */
  border-radius: 12px 12px 12px 12px;
  margin:15px;
  padding: 15px;
  font-size: 16px;
`;

const DownloadButton = styled.button`
  border-radius: 12px 12px 12px 12px;
  display: block;
  padding: 10px;
  font-weight: bold;
  background-color: #6868b1; /* Button background color */
  border: none; /* Remove default button border */
  transition: background-color 0.3s ease-in-out;
  margin-bottom:25px;
  &:hover {
    background-color: #58587e;
  }
`;

const CardBody = styled.div`
  padding: 20px;
`;

const ProbabilityText = styled.h3`
  margin-bottom: 15px;
  color: #6bd4f0; /* Accent color */
`;

const SuggestionsContainer = styled.div`
  margin-top: 20px;
`;

const NoResultsMessage = styled.p`
  text-align: center;
  color: #a8a8a8; /* Subdued text color */
  margin-top: 2rem;
  font-size: 1.2rem;
`;

const ResultsPage = () => {
  // State to store results and loading status
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
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
  // Function to toggle accordion content
  const toggleAccordion = (index) => {
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  // Function to render user input details
  const renderUserInput = (userInput) => {
    const inputProperties = Object.entries(userInput);

    const defpropertyLabels = {
      age: 'Age',
      sex: 'Sex',
      cp: 'Chest Pain Type',
      thal: 'Thal',
      ca: 'Number of Major Vessels (0-3) Colored by Flourosopy',
      slope: 'Slope of the Peak Exercise ST Segment',
      oldpeak: 'ST Depression Induced by Exercise Relative to Rest',
      exang: 'Exercise Induced Angina',
      thalach: 'Maximum Heart Rate Achieved',
      restecg: 'Resting Electrocardiographic Results',
      fbs: 'Fasting Blood Sugar greater than 120 mg/dl',
      chol: 'Serum Cholestoral (mg/dl)',
      trestbps: 'Resting Blood Pressure (mm Hg)'
    };
    const customPropertyLabels = {
      age: 'Age',
      alc: 'Heavy Alcohol Consumption',
      bmi: 'Body Mass Index',
      dia: 'Diabetes',
      diff: 'Difference In Walking',
      frt: 'Fruits',
      veg: 'Vegetables',
      gen: 'General Health on Scale of 1 to 5',
      hbp: 'High BP',
      hch: 'High Cholesterol',
      phy: 'Physical Exercise',
      sex: 'Sex',
      smk: 'Smoker',
      srk: 'History of having stroke',
    };
    const propertyLabels = Object.keys(defpropertyLabels).every(
      (key) => key in userInput
    )
      ? defpropertyLabels
      : customPropertyLabels;
    // Map for categorical values
    const defaultCategoricalMappings = {
      sex: { 0: 'Female', 1: 'Male' },
      cp: { 0: 'Typical Angina', 1: 'Atypical Angina', 2: 'Non-Anginal Pain', 3: 'Asymptomatic' },
      restecg: { 0: 'Normal', 1: 'ST-T Wave Abnormality', 2: 'Probable/Definite LVH' },
      exang: { 0: 'No', 1: 'Yes' },
      slope: { 0: 'Upsloping', 1: 'Flat', 2: 'Downsloping' },
      thal: { 0: 'Normal', 1: 'Fixed Defect', 2: 'Reversible Defect' },
      fbs: { 0: 'No', 1: 'Yes' }
    };
    const customCategoricalMappings = {
      age: {
        1: "18-24",
        2: "25-31",
        3: "32-38",
        4: "39-45",
        5: "46-52",
        6: "53-59",
        7: "60-66",
        8: "67-73",
        9: "74-80",
        10: "81-87"
      },
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
    const categoricalMappings = Object.keys(defaultCategoricalMappings).every(
      (key) => key in userInput
    )
      ? defaultCategoricalMappings
      : customCategoricalMappings;
    const formNumber = Object.keys(defaultCategoricalMappings).every(
      (key) => key in userInput
    )
      ? 1
      : 2;
    return (
      <div>
        <h6 className="mt-2">User Input (Form {formNumber}):</h6>
        <table className="table">
          <tbody>
            {inputProperties.map(([property, value]) => (
              <tr key={property}>
                <td>
                  <strong>{propertyLabels[property]}</strong>
                </td>
                <td>
                  {/* Check if the property has a categorical mapping */}
                  {categoricalMappings[property] ? (
                    categoricalMappings[property][value]
                  ) : (
                    // Display numeric values as is for non-categorical properties
                    value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  // Function to handle download click
  const handleDownloadClick = (result, index) => {
    // Reference to the card element
    const cardElement = document.getElementById(`resultCard_${result.id}_${index}`);

    // Use html2canvas to capture the entire card content as an image
    html2canvas(cardElement, { scrollY: -window.scrollY }).then((canvas) => {
      // Callback function to handle PDF generation
      const generatePDF = (canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // Use jsPDF to convert the image to a PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

        // Save the PDF with a unique name based on the result id
        pdf.save(`result_${result.id}.pdf`);
      };

      generatePDF(canvas);
    });
  };





  // JSX structure for rendering the component
  return (
    <Container>
      <NavBar />
      <ResultsContainer>
        <h1 className="text-center m-4">Previous Assessment Results</h1>
        <p className="text-center m-4">Click on a Result tab to view or download your previous result.</p>
        {loading ? (
          // Display a loading spinner while fetching results
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : results && results.previousResults && results.previousResults.length > 0 ? (
          // Display previous results if available
          <div className="row row-cols-1 row-cols-sm g-4">
            {results.previousResults.map((result, index) => (
              <ResultCard key={index} id={`resultCard_${result.id}_${index}`}>
                <CardHeader onClick={() => toggleAccordion(index)}>
                  <span style={{ fontSize: '24px', fontWeight: 'bolder' }}>Result ({index + 1})</span>
                </CardHeader>
                <AccordionContent isOpen={openAccordionIndex === index}>
                  <CardBody>
                    <NewButton onClick={() => handleDownloadClick(result, index)}>
                      {/* Add your SVG icon and tooltip elements here */}
                      <svg className="svgIcon" viewBox="0 0 256 256" height="32" width="38" xmlns="http://www.w3.org/2000/svg">
                        <path d="M74.34 85.66a8 8 0 0 1 11.32-11.32L120 108.69V24a8 8 0 0 1 16 0v84.69l34.34-34.35a8 8 0 0 1 11.32 11.32l-48 48a8 8 0 0 1-11.32 0ZM240 136v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h52.4a4 4 0 0 1 2.83 1.17L111 145a24 24 0 0 0 34 0l23.8-23.8a4 4 0 0 1 2.8-1.2H224a16 16 0 0 1 16 16" fill="currentColor"></path>
                      </svg>
                      <span className="icon2"></span>
                      <span className="tooltip">Download</span>
                    </NewButton>
                    <ProbabilityText>Heart Disease Probability: {result.positive_probability}%</ProbabilityText>
                    <ProgressBar
                      variant={result.positive_probability > 70 ? "danger" : result.positive_probability > 40 ? "warning" : "success"}
                      now={result.positive_probability}
                      label={`${result.positive_probability}%`}
                      max={100}
                      style={{
                        backgroundColor: 'gray',
                        margin: '2%',
                      }}
                      className="mb-2"
                    />
                    {/* Render user input details */}
                    {renderUserInput(result.user_input)}

                    {/* Display generated text suggestions if available */}
                    {result.generated_text && (
                      <SuggestionsContainer>
                        <h4 className="text-white">Suggestions:</h4>
                        <ReactMarkdown>{result.generated_text}</ReactMarkdown>
                      </SuggestionsContainer>
                    )}
                  </CardBody>
                </AccordionContent>
              </ResultCard>
            ))}
          </div>
        ) : (
          // Display a message if no previous results are available
          <NoResultsMessage>No previous results available.</NoResultsMessage>
        )}
      </ResultsContainer>
    </Container>
  );
};

export default ResultsPage;