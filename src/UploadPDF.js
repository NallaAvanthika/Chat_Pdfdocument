import React, { useState } from 'react';
import axios from 'axios';

const UploadPDF = ({ setUploadedFile }) => {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file); // Notify parent
    setFileName(file.name); // Save filename locally
    setError(null); // Clear any previous errors

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://127.0.0.1:8000/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload successful');
    } catch (err) {
      setError('Error uploading file: ' + err.message);
      console.error('Upload failed:', err);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* File Name */}
      {fileName && (
        <span style={{ fontSize: '14px', color: '#333' }}>{fileName}</span>
      )}

      {/* Error Message */}
      {error && (
        <span style={{ fontSize: '14px', color: 'red' }}>{error}</span>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        accept=".pdf"
        id="upload-pdf-input"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <button
        style={{
          backgroundColor: '#fff',
          border: '1px solid #333',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById('upload-pdf-input').click()}
      >
        Upload PDF
      </button>
    </div>
  );
};

export default UploadPDF;