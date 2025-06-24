import React, { useState } from 'react';

import UploadPDF from './UploadPDF';
import AskQuestion from './AskQuestion';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <div
      className="app"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #ddd',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/ailogo.png" alt="AI Logo" style={{ width: 40, height: 40 }} ></img>
          <div style={{ marginLeft: '10px' }}>
            
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>planet</div>
            <div style={{ fontSize: '12px', color: 'green' }}>formerly DPN</div>
          </div>
        </div>
        <UploadPDF setUploadedFile={setUploadedFile} />
      </header>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        {/* Answer content goes here */}
        <AskQuestion file={uploadedFile} />
      </div>
    </div>
  );
}

export default App;
