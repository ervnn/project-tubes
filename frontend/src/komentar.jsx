import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function KomentarPage() {
  const [komentar, setKomentar] = useState([]);
  const [pencarian, setPencarian] = useState('');
  const [sort, setSort] = useState('');
  const [statistik, setStatistik] = useState({ positif: 0, negatif: 0, netral: 0 });
  // const [refresh, setRefresh] = useState(0);

  // const refreshData = () => setRefresh(prev => prev + 1);

  const fetchKomentar = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/komentar/search', {
        params: { keyword: pencarian, sort },
      });
      setKomentar(res.data);
    } catch (error) {
      console.error('Gagal fetch komentar:', error);
    }
  };

  const fetchStatistik = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/statistik');
    setStatistik({
      positif: res.data.Positif,
      negatif: res.data.Negatif,
      netral: res.data.Netral,
    });
  } catch (error) {
    console.error('Gagal fetch statistik:', error);
  }
};


  const handleSearch = () => {
    fetchKomentar();
    fetchStatistik();
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`http://localhost:8080/api/komentar/${index}`);
      await fetchKomentar();
      await fetchStatistik();
    } catch (error) {
      console.log('Gagal hapus komentar:', error);
    }
  };

  useEffect(() => {
    fetchKomentar();
    fetchStatistik();
  },[sort]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchKomentar();
      fetchStatistik();
    };
    // window.addEventListener('refreshKomentar', handleRefresh);
    // return () => {
    //   window.removeEventListener('refreshKomentar', handleRefresh);
    // };
  }, []);
    

  return  (
    <div
      className="container my-5 p-4 rounded-4 shadow"
      style={{
        maxWidth: '900px',
        background: 'linear-gradient(to bottom right, #fdfdfd, #f3f4f6)',
        backgroundColor: '#f5f3ff',
        border: '1px solid #e0e0e0',
        opacity: 0.97,
      }}
    >
      <h2 className="mb-4 text-dark fw-bold">Daftar Komentar</h2>

      {komentar.length === 0 && (
        <p className="text-danger">Tidak ada komentar</p>
      )}

      <div className="mb-3 row">
        <div className="col-md-5 mb-2">
          <input
            type="text"
            className="form-control rounded-pill px-3"
            placeholder="Cari komentar..."
            value={pencarian}
            onChange={(e) => setPencarian(e.target.value)}
          />
        </div>

        <div className="col-auto mb-2">
          <button
            onClick={handleSearch}
            className="btn rounded-pill px-4 text-white"
            style={{
              backgroundColor: '#6366f1',
              borderColor: '#6366f1',
            }}
          >
            Cari
          </button>
        </div>

        <div className="col-md-4 mb-2">
          <select
            className="form-select rounded-pill px-3"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="sentimen">By Sentimen</option>
            <option value="panjang">By Panjang</option>
          </select>
        </div>
      </div>

      <ul className="list-group mb-4">
        {komentar.map((k, i) => {
          let warna = 'text-secondary';
          if (k.sentimen === 'positif') warna = 'text-success';
          else if (k.sentimen === 'negatif') warna = 'text-danger';

          return (
            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong className={warna}>
                  [{k.sentimen.charAt(0).toUpperCase() + k.sentimen.slice(1)}]
                </strong>{' '}
                {k.teks}
              </span>
              <button 
                onClick={() => handleDelete(i)} className="btn btn-sm btn-danger rounded-pill px-3">
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      <h4 className="mb-3 text-dark">Statistik Komentar</h4>
      <ul className="list-group mb-4">
        <li className="list-group-item">Positif: {statistik.positif}</li>
        <li className="list-group-item">Netral : {statistik.netral}</li>
        <li className="list-group-item">Negatif: {statistik.negatif}</li>
      </ul>

      <Link to="/">
        <button className="btn btn-outline-secondary rounded-pill px-4">
          Kembali
        </button>
      </Link>
    </div>
  );
}

export default KomentarPage;
