import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
    setSummary(""); // Clear previous summary

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
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="text-center text-primary">🔍 Free Text Summarizer</h1>

        <textarea
          className="form-control my-3"
          rows="5"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="✍️ Enter text to summarize..."
        ></textarea>

        <button className="btn btn-success w-100" onClick={summarizeText} disabled={loading}>
          {loading ? "⏳ Summarizing..." : "⚡ Summarize"}
        </button>

        {error && <p className="text-danger mt-3 text-center">{error}</p>}

        {summary && (
          <div className="mt-4 p-3 border rounded bg-light">
            <h2 className="text-success">📜 Summary:</h2>
            <p className="fw-bold">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
