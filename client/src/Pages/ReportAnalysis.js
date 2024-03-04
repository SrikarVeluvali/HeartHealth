import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import NavBar from '../Components/NavBar';

const ImageAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = async (event) => {
    event.preventDefault();
    setLoading(true);

    const fileInput = event.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    try {
      // Read the uploaded image and set it to state for preview
      const imageDataUrl = await readImageFile(file);
      setUploadedImage(imageDataUrl);

      // Perform image analysis
      const analysisResponse = await analyzeImageOnServer(file);
      setAnalysisResult(analysisResponse);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImageOnServer = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:9000/api/auth/analyze-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      return result.text; // Assuming the API returns the analysis text
    } catch (error) {
      console.error('Error analyzing image:', error);
      return 'Error occurred during analysis: The Image format is not supported. Use PNG / JPEG / JPG';
    }
  };

  const readImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };


  return (
    <div className='container mt-5 bg-dark p-4 rounded'>
      <NavBar />
      <h1 className="text-center mt-5">Analyse your medical reports here</h1>

      <div className="container mt-5">
        <div className="card mb-3">
          <div className="card-body">
            <form onSubmit={handleImageUpload}>
              <div className="mb-3">
                <label htmlFor="imageInput" className="form-label">
                  Choose an image (less than or equal to 4 MB)
                </label>
                <input type="file" className="form-control" id="imageInput" accept="image/*" />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="submit" className="btn btn-outline-success mt-3 mx-auto">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h2 className="mb-3">Uploaded Image:</h2>
            {uploadedImage && (
              <div className="image-container mb-3">
                <a href={uploadedImage} target="_blank" rel="noopener noreferrer">
                  <img src={uploadedImage} alt="Uploaded" style={{ width: '100%', maxWidth: '200px' }} />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h2 className="mb-3">Analysis Result:</h2>
            {loading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="markdown-container">
                <ReactMarkdown>{analysisResult}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;
