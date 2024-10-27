import React, { useState } from 'react';
import { fetchOpenAIResponse } from './OpenAiService';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [references, setReferences] = useState('');

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    const result = await fetchOpenAIResponse(prompt, setResponse, setReferences);
    
    if (result) {
      setResponse(result.choices[0].text);
    }
  };

  return (
    <div>
    <div style={{direction: 'rtl', padding: '10px'}}> 
      <input type="text" value={prompt} onChange={handleInputChange} />
      <button onClick={handleSubmit}>بحث</button>
      <p>النتيجة: {response}</p>
    </div>
    <div style={{color: 'black'}}></div>
    <div style={{direction: 'rtl', padding: '10px'}}> 
      <p>المصادر: {references}</p>
    </div>
    </div>
  );
}

export default App;