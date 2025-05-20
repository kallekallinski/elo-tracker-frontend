import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const summoners = [
    "Dogwauwau#EUW",
    "GottloserEnjoyer#FkYou",
    "Norm Alo#0815",
    "KERO#EUW",
    "misatos toilet#lnk2g",
    "SHIFT Keks#EUW"
  ];

  const fetchData = async () => {
    setLoading(true);
    const results = await Promise.all(
      summoners.map(async (fullName) => {
        const [name, tag] = fullName.split("#");
        const res = await fetch(`http://localhost:3001/api/summoner?name=${name}&tag=${tag}`);
        return await res.json();
      })
    );
    setData(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🔺 ELO Gain Challenge Tracker</h1>
      {loading && <p>Lade Daten...</p>}
      {!loading &&
        data.map((player, i) => (
          <div key={i} style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>{player.name}</h2>
            <p>
              <strong>Tier:</strong> {player.tier} {player.rank}
            </p>
            <p>
              <strong>LP:</strong> {player.lp}
            </p>
          </div>
        ))}
    </div>
  );
}

export default App;
