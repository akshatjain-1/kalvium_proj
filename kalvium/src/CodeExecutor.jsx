// src/CodeExecutor.js

import React, { useState } from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ace';
import './App.css';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';

//log the output status


const CodeExecutor = () => {
    const [language, setLanguage] = useState('javascript');
    const [script, setScript] = useState('');
    const [output, setOutput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/execute/', {
                language,
                script,
            });
            console.log('API Response:', response.data);
            setOutput(response.data.output);
        } catch (error) {
            console.error('Error executing in the scripts')
            setOutput('Error executing the script.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Language:
                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            {/* Add more languages as needed */}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Script:
                        <AceEditor
                            mode={language}
                            theme="github"
                            value={script}
                            onChange={setScript}
                            name="script-editor"
                            editorProps={{ $blockScrolling: true }}
                            height="300px"
                            width="100%"
                        />
                    </label>
                </div>
                <button type="submit">Execute</button>
            </form>
            {output && (
                <div>
                    <h2>Output:</h2>
                    <pre>{output}</pre>
                </div>
            )}
        </div>
    );
};

export default CodeExecutor;