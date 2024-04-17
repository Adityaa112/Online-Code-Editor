// OnlineCodeEditor.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './codeEditor.css';

function OnlineCodeEditor({ username }) {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(50);

    const handleCompile = async () => {
        // Code for compilation
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(
                'https://judge0-ce.p.rapidapi.com/submissions',
                {
                    language_id: selectedLanguage,
                    source_code: btoa(code),
                    stdin: ''
                },
                {
                    params: {
                        base64_encoded: true,
                        fields: '*'
                    },
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': '30c4ac4686msh1d7332481c60724p19b820jsn171de0552844',
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    }
                }
            );

            const token = response.data.token;

            if (!token) {
                throw new Error('Token not received');
            }

            checkSubmissionStatus(token);
        } catch (error) {
            setError(error.message || 'An error occurred during compilation and execution');
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    return (
        <>
            <header>
                <div className="space">
                    <h1><b>Online Code Editor</b></h1>
                    {username && <p>Welcome, {username}!</p>}
                </div>
                <div className="navbar">
                    <button className="btn run-btn" onClick={handleCompile} disabled={loading}><i className="fas fa-play"></i> RUN Code</button>
                    <div className="select-container">
                        <p>Language:</p>
                        <select className="select" onChange={handleLanguageChange} value={selectedLanguage}>
                            <option value={50}>C</option>
                            <option value={54}>C++</option>
                            <option value={62}>Java</option>
                            <option value={71}>Python</option>
                        </select>
                    </div>
                </div>
            </header>
            <main>
                <div className="code-editor">
                    <SyntaxHighlighter
                        language="java" // Change language as needed
                        style={materialDark}
                    >
                        {code}
                    </SyntaxHighlighter>
                    <textarea
                        id="code-area"
                        placeholder="Write your code here..."
                        value={code}
                        onChange={handleCodeChange}
                    />
                </div>
                <div className="output-window">
                    <div id="output-header">Output</div>
                    {error && <div className="error-message">{error}</div>}
                    <textarea id="output-area" readOnly value={output}></textarea>
                </div>
            </main>
        </>
    );
}

export default OnlineCodeEditor;
