import { useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";

import { CODE_SNIPPETS } from "./constants";
import { Editor } from "@monaco-editor/react";
// For C, C++

const App = () => {
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const editorRef = useRef();
  const [value, setValue] = useState("");

  const supportedLanguages = {
    C: "c",
    CPP: "cpp",
    PYTHON: "python",
    JAVA: "java",
    JAVASCRIPT: "nodejs", // Change 'javascript' to 'nodejs' here
    RUBY: "ruby",
    SQLITE3: "sqlite3",
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  const runCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/execute/", {
        language: language === "javascript" ? "nodejs" : language, // Map 'javascript' to 'nodejs' if selected
        script,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error executing the script.");
    }
  };

  const getCodeMirrorMode = (language) => {
    switch (language) {
      case "javascript":
        return "javascript";
      case "python":
        return "python";
      case "cpp":
        return "text/x-c++src";
      default:
        return "javascript";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <h1 className="text-2xl">Code Editor</h1>
        <div>
          <select
            className="mr-4 p-2 bg-gray-700 text-white rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {Object.keys(supportedLanguages).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700"
            onClick={runCode}
          >
            Run
          </button>
        </div>
      </header>
      <div className="flex flex-1 pl-4 pt-1 border-gray-600 rounded overflow-clip">
        <div className="flex-1 border-r border-gray-700 rounded overflow-clip">
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="99%"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <textarea
              className="w-full h-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
              placeholder="Enter input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex-1 p-4 flex flex-col">
            <pre className="flex-1 bg-gray-800 text-white p-2 rounded overflow-auto border border-gray-700">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
