import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./index.css";
import axios from "axios";
import { Link } from 'react-router-dom';

function App() {
  const [teks, setTeks] = useState('');
  const [hasilAnalisis, setHasilAnalisis] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teks.trim()) return;

    await axios.post('http://localhost:8080/api/komentar', { teks });
    setTeks('');
    await fetchKomentarTerakhir();

    window.dispatchEvent(new Event('refreshKomentar'));
  };

  const fetchKomentarTerakhir = async () => {
    try {const res = await axios.get('http://localhost:8080/api/komentar');
    const data = res.data;
    if (data.length > 0) {
      const terakhir = data[data.length - 1];
      setHasilAnalisis(terakhir);
    }
  } catch (error) {
    console.error('Gagal fetch komentar terakhir', error);
  }
  };

  useEffect(() => {
    fetchKomentarTerakhir();
  }, []);

  return (
  <div
  className="container my-5"
  style={{
    background: "linear-gradient(to bottom right, rgba(245, 243, 255, 0.8), rgba(255, 255, 255, 0.8))",
    backdropFilter: "blur(12px)", 
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
    padding: "2rem",
    minHeight: "300px",
  }}
  >
  <h2 className="mb-4 text-dark">Input Komentar</h2>

  <form onSubmit={handleSubmit} className="d-flex mb-4">
    <input
      type="text"
      className="form-control me-3 rounded-pill px-3"
      value={teks}
      onChange={(e) => setTeks(e.target.value)}
      placeholder="Tulis komentar..."
    />
    <button
      type="submit"
      className="btn btn-primary rounded-pill px-4"
      style={{
        backgroundColor: "#38a4f5",
        borderColor: "#38a4f5",
      }}>
      Input
    </button>
  </form>

  {hasilAnalisis && (
    <div className="alert alert-info rounded-3">
      <h5>Hasil Analisis :</h5>
      <p>
        <strong>Komentar:</strong> {hasilAnalisis.teks}
      </p>
      <p>
        <strong>Sentimen:</strong> {hasilAnalisis.sentimen}
      </p>
    </div>
  )}

  <div className="mt-3">
    <Link to="/komentar" style={{ textDecoration: "none" }}>
      <button
        className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2 px-4 py-2">
        Search
        <img
          src="public/assets/img/search.png"
          alt="search"
          style={{ width: "20px", height: "20px" }}
        />
      </button>
    </Link>
  </div>
</div>

  );
}

export default App;
