import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../Components/NavBar';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import ProgressBar from 'react-bootstrap/ProgressBar';
function App() {
    const name = localStorage.getItem("name");
    const userToken = localStorage.getItem('token');
    const decodedToken = jwt_decode(userToken);
    const userEmail = decodedToken.email;
    const user = {
        fullName: name,
        email: userEmail,
    };
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const calculateAverage = (property) => {
        const total = results.previousResults.reduce((sum, result) => sum + result.user_input[property], 0);
        const average = total / results.previousResults.length;
        return average.toFixed(2);
    };


    const renderUpDownIndicator = (currentValue, previousValue) => {
        if (currentValue > previousValue) {
            return <span style={{ color: 'green' }}> UP ({currentValue - previousValue})</span>;
        } else if (currentValue < previousValue) {
            return <span style={{ color: 'red' }}> DOWN ({-currentValue + previousValue})</span>;
        }
        // If values are equal or cannot determine the trend
        return <span style={{ color: 'gray' }}> NULL (0)    </span>;;
    };
    return (
        <>
            <NavBar />
            <div className="container col" style={{ marginTop: '40px' }}>
                <div className="card bg-dark p-4 rounded">
                    <div className="card-header bg-dark text-white p-3">
                        <h1 className='text-center'>{user.fullName}'s Profile</h1>
                    </div>
                    <div className="card-body">
                        <p className="card-text"><strong>Full Name:</strong> {user.fullName}</p>
                        <p className="card-text"><strong>Email:</strong> {user.email}</p>
                    </div>
                </div>
                <div className="card bg-dark mt-4 rounded">
                    <div className="card-header bg-dark text-white p-3">
                        <h2 className="text-center m-4">Result Tracker</h2>

                    </div>

                    {results.previousResults &&
                        results.previousResults.map((result, index) => {
                            // Check if the required fields are present in the current result
                            if (
                                result.user_input?.trestbps !== undefined &&
                                result.user_input?.chol !== undefined &&
                                result.user_input?.thalach !== undefined
                            ) {
                                return (
                                    <div key={index} className="col card">
                                        <div
                                            className="p-3 card-body"
                                            id={`resultCard_${result.id}_${index}`}
                                        >
                                            <div className="card-header text-white d-flex justify-content-between align-items-center m-2" style={{ borderRadius: '8px 8px 8px 8px' }}>
                                                <span>Result {index + 1}</span>
                                                <h3 className="">
                                                    Heart Disease Probability:{' '}
                                                    {result.positive_probability >= 10
                                                        ? result.positive_probability.toFixed(2)
                                                        : '0' + result.positive_probability}%
                                                </h3>
                                            </div>

                                            <div className="m-3">
                                                <h6>Blood Pressure (mm Hg): {result.user_input?.trestbps}
                                                </h6>
                                                <ProgressBar
                                                    variant=""
                                                    now={result.user_input?.trestbps}
                                                    max={200}
                                                    label={`${result.user_input?.trestbps} mm Hg`}
                                                    style={{
                                                        backgroundColor: 'gray',
                                                    }}
                                                    className="mb-2"
                                                />
                                            </div>
                                            <div className="m-3">
                                                <h6>Serum Cholesterol (mg/dl): {result.user_input?.chol}
                                                </h6>
                                                <ProgressBar
                                                    variant=""
                                                    now={result.user_input?.chol}
                                                    max={400}
                                                    label={`${result.user_input?.chol} mg/dl`}
                                                    style={{
                                                        backgroundColor: 'gray',
                                                    }}
                                                />
                                            </div>
                                            <div className="m-3">
                                                <h6>Maximum Heart Rate Achieved: {result.user_input?.thalach}
                                                </h6>
                                                <ProgressBar
                                                    variant=""
                                                    now={result.user_input?.thalach}
                                                    max={200} // Adjust the max value based on your preference
                                                    label={`${result.user_input?.thalach}`}
                                                    style={{
                                                        backgroundColor: 'gray',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}

                </div>
            </div>
        </>
    );
}

export default App;
