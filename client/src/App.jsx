import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarizeText = async () => {
    if (!inputText.trim()) {
      setError("⚠️ Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await axios.post("http://localhost:8000/api/summarize", { text: inputText });
      setSummary(response.data.summary);
    } catch (error) {
      setError("❌ Failed to summarize. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid h-100 w-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-4 w-100 mx-auto" style={{ maxWidth: "1200px" }}>
        <h1 className="text-center text-primary mb-4">🔍 Free Text Summarizer</h1>

        <textarea
          className="form-control mb-3"
          rows="6"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="✍️ Enter text here..."
          style={{ resize: "none", border: "2px solid #007bff", borderRadius: "10px" }}
        ></textarea>

        <button
          className="btn btn-primary w-100 fw-bold py-2"
          onClick={summarizeText}
          disabled={loading}
        >
          {loading ? (
            <span>
              ⏳ Summarizing... <span className="spinner-border spinner-border-sm"></span>
            </span>
          ) : (
            "⚡ Summarize"
          )}
        </button>

        {error && <p className="text-danger mt-3 text-center">{error}</p>}

        {summary && (
          <div className="mt-4 p-3 border rounded bg-white text-dark shadow-sm">
            <h2 className="text-success">📜 Summary:</h2>
            <p className="fw-bold">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
