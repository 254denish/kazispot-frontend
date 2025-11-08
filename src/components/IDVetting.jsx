import { useState } from "react";
import "../App.css";

export default function IDVetting({ userRole, onVettingSuccess, onBack, onRestart }) {
  const [idNumber, setIdNumber] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Submitting ID...");

    const formData = new FormData();
    formData.append("idNumber", idNumber);
    formData.append("idFile", idFile);

    try {
      const res = await fetch("http://localhost:3000/api/id-verification", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSubmitted(true);
        setMessage("✅ Your ID has been submitted for verification.");
        setTimeout(() => onVettingSuccess(true), 1500);
      } else {
        setMessage("❌ Failed to submit ID. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error submitting ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="logo-text">ID Vetting</h1>
      <p className="header-text">
        Please enter your ID number and upload a valid document to continue.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="Enter your National ID Number"
            className="auth-input"
            required
          />
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setIdFile(e.target.files[0])}
            className="auth-input"
            required
          />
          <button
            type="submit"
            className="submit-button"
            style={{ backgroundColor: loading ? "#999" : "#005A9C" }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      ) : (
        <p className="message-success">
          ✅ Your ID has been submitted for verification. We’ll notify you once it’s reviewed.
        </p>
      )}

      {message && (
        <p className={`message-area ${message.startsWith("❌") ? "message-error" : "message-success"}`}>
          {message}
        </p>
      )}

      {/* Navigation Buttons */}
      <div style={{ marginTop: "2rem" }}>
        {onBack && (
          <button className="nav-button" onClick={onBack}>
            ← Back
          </button>
        )}
        {onRestart && (
          <button className="nav-button" onClick={onRestart} style={{ marginLeft: "1rem" }}>
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
