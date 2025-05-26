import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const tierValues = {
  IRON: 0,
  BRONZE: 400,
  SILVER: 800,
  GOLD: 1200,
  PLATINUM: 1600,
  EMERALD: 2000,
  DIAMOND: 2400,
  MASTER: 2800,
  GRANDMASTER: 3000,
  CHALLENGER: 3200
};

const divisionValues = {
  IV: 0,
  III: 100,
  II: 200,
  I: 300
};

const PLAYERS = [
  {
    name: "Dogwauwau",
    tag: "EUW",
    startTier: "DIAMOND",
    startDivision: "I",
    startLP: 30
  },
  {
    name: "GottloserEnjoyer",
    tag: "FkY0u",
    startTier: "DIAMOND",
    startDivision: "III",
    startLP: 60
  },
  {
    name: "Norm Alo",
    tag: "0815",
    startTier: "DIAMOND",
    startDivision: "III",
    startLP: 3
  },
  {
    name: "I Am Atomic",
    tag: "KERO",
    startTier: "MASTER",
    startDivision: "I",
    startLP: 97
  },
  {
    name: "misatos toilet",
    tag: "Ink2g",
    startTier: "EMERALD",
    startDivision: "IV",
    startLP: 20
  },
  {
    name: "SHIFT Keks",
    tag: "EUW",
    startTier: "PLATINUM",
    startDivision: "IV",
    startLP: 40
  }
];

const API_BASE = "https://elo-backend.onrender.com";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const results = await Promise.all(
      PLAYERS.map(async (player) => {
        try {
          const res = await fetch(
            `${API_BASE}/api/summoner?name=${encodeURIComponent(player.name)}&tag=${player.tag}&startTier=${player.startTier}&startDivision=${player.startDivision}&startLP=${player.startLP}`
          );
          const json = await res.json();

          return {
            ...json,
            startTier: player.startTier,
            startDivision: player.startDivision,
            startLP: player.startLP,
            netGain: json.netGain ?? "-",
            gamesPlayed: json.gamesPlayed ?? "-"
          };
        } catch (err) {
          return {
            name: `${player.name}#${player.tag}`,
            tier: "-",
            rank: "-",
            lp: "-",
            netGain: "-",
            gamesPlayed: "-",
            startTier: player.startTier,
            startDivision: player.startDivision,
            startLP: player.startLP
          };
        }
      })
    );

    results.sort((a, b) => (b.netGain ?? 0) - (a.netGain ?? 0));
    setData(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🔺 ELO Gain Challenge Leaderboard</h1>

      <button onClick={() => window.location.reload()} style={{ marginBottom: "1rem" }}>🔄 Seite neu laden</button>

      <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
        📅 Die Net Gains gelten für den Zeitraum <strong>ab 22. Mai 2025</strong> bis zum Split-Ende am <strong>11. August 2025</strong>.
      </p>

      <div style={{
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "2rem",
        fontSize: "0.9rem",
        lineHeight: "1.5"
      }}>
        <strong>ℹ️ Berechnungsgrundlage:</strong><br />
        Der LP-Net Gain wird aus einer abstrahierten Score-Berechnung berechnet: Tier + Division + LP.<br />
        Tiers zählen in 400er-Schritten (z. B. DIAMOND = 2400 Punkte), Divisionen in 100er-Schritten (z. B. II = +200), LP werden 1:1 addiert. <br />
        Beispiel: DIAMOND II mit 60 LP → 2400 + 200 + 60 = 2660 Punkte.<br />
        Der Net Gain ist die Differenz zwischen dem aktuellen Wert und dem gespeicherten Startwert vom 22. Mai.
      </div>

      {loading ? (
        <p>Lade Daten...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th>Spieler</th>
              <th>Tier</th>
              <th>Division</th>
              <th>LP</th>
              <th>Start</th>
              <th>Net Gain</th>
              <th>Games Played</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player, i) => (
              <tr key={i} style={i === 0 ? { fontWeight: "bold", backgroundColor: "#fff7dd" } : {}}>
                <td>{player.name} {i === 0 && "⭐"}</td>
                <td>{player.tier}</td>
                <td>{player.rank}</td>
                <td>{player.lp}</td>
                <td>{`${player.startTier} ${player.startDivision} ${player.startLP} LP`}</td>
                <td>{typeof player.netGain === "number" ? `${player.netGain >= 0 ? "+" : ""}${player.netGain}` : "-"}</td>
                <td>{player.gamesPlayed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
