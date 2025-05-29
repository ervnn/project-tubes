import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [teks, setTeks] = useState("");
  const [komentar, setKomentar] = useState([]);
  const [statistik, setStatistik] = useState({});

  const fetchKomentar = async () => {
    const res = await axios.get("http://localhost:8080/api/komentar");
    setKomentar(res.data);
  };

  const fetchStatistik = async () => {
    const res = await axios.get("http://localhost:8080/api/statistik");
    // debug console.log("Data statistik terbaru:", res.data);
    setStatistik(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teks.trim()) return;
    await axios.post("http://localhost:8080/api/komentar", { teks });
    setTeks("");
    await fetchKomentar();
    await fetchStatistik();
  };

  const handleDelete = async (index) => {
    // Debug console.log("Menghapus komentar index ke:", index); 
    await axios.delete(`http://localhost:8080/api/komentar/${index}`);
    fetchKomentar();
    fetchStatistik();
  };

  useEffect(() => {
    fetchKomentar();
    fetchStatistik();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Input Komentar</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Tulis komentar..." style={{ width: "80%", padding: 8 }} />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>
          Kirim
        </button>
      </form>

      <h3 style={{ marginTop: 30 }}>Daftar Komentar</h3>
      <ul>
        {komentar.map((k, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <strong>[{k.sentimen}]</strong> {k.teks}
            <button onClick={() => handleDelete(i)} style={{ marginLeft: 10, color: "red" }}>
              Hapus
            </button>
          </li>
        ))}
      </ul>

      <h3>Statistik</h3>
      <ul>
        <li>Positif: {statistik.positif || 0}</li>
        <li>Negatif: {statistik.negatif || 0}</li>
        <li>Netral: {statistik.netral || 0}</li>
      </ul>
    </div>
  );
}

export default App;
