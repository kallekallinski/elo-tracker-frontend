import './App.css';

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

const PLAYERS = [
  { name: "Dogwauwau", tag: "EUW", startLP: 12 },
  { name: "GottloserEnjoyer", tag: "FkY0u", startLP: 60 },
  { name: "Norm Alo", tag: "0815", startLP: 3 },
  { name: "I Am Atomic", tag: "KERO", startLP: 0 },
  { name: "misatos toilet", tag: "Ink2g", startLP: 20 },
  { name: "SHIFT Keks", tag: "EUW", startLP: 0 }
];

const API_BASE = "https://elo-backend.onrender.com";

// ⏱️ Tagesdaten (Beispielstruktur – du kannst mehr Tage hinzufügen)
const HISTORY = [
  {
    date: "2025-05-21",
    Dogwauwau: 20,
    GottloserEnjoyer: 63,
    "Norm Alo": 3,
    "I Am Atomic": 0,
    "misatos toilet": 22,
    "SHIFT Keks": 0
  },
  {
    date: "2025-05-22",
    Dogwauwau: 28,
    GottloserEnjoyer: 64,
    "Norm Alo": 4,
    "I Am Atomic": 0,
    "misatos toilet": 27,
    "SHIFT Keks": 0
  },
  {
    date: "2025-05-23",
    Dogwauwau: 32,
    GottloserEnjoyer: 64,
    "Norm Alo": 5,
    "I Am Atomic": 0,
    "misatos toilet": 30,
    "SHIFT Keks": 0
  }
];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        PLAYERS.map(async (player) => {
          try {
            const res = await fetch(
              `${API_BASE}/api/summoner?name=${encodeURIComponent(player.name)}&tag=${player.tag}`
            );
            const json = await res.json();
            const netGain = (json.lp ?? 0) - (player.startLP ?? 0);

            return {
              ...json,
              startLP: player.startLP,
              netGain
            };
          } catch (err) {
            return {
              name: `${player.name}#${player.tag}`,
              tier: "-",
              rank: "-",
              lp: "-",
              startLP: player.startLP,
              netGain: "-"
            };
          }
        })
      );

      results.sort((a, b) => (b.netGain ?? 0) - (a.netGain ?? 0));
      setData(results);
      setLoading(false);
    };

    fetchAll();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🔺 ELO Gain Challenge Leaderboard</h1>
      {loading ? (
        <p>Lade Daten...</p>
      ) : (
        <>
  <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
    📅 Die Net Gains gelten für den aktuellen Split und werden bis <strong>11. August 2025</strong> gewertet.
  </p>

  <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Spieler</th>
                <th>Tier</th>
                <th>Division</th>
                <th>LP</th>
                <th>Start</th>
                <th>Net Gain</th>
              </tr>
            </thead>
            <tbody>
              {data.map((player, i) => (
                <tr key={i}>
                  <td>{player.name}</td>
                  <td>{player.tier}</td>
                  <td>{player.rank}</td>
                  <td>{player.lp}</td>
                  <td>{player.startLP}</td>
                  <td>
                    {typeof player.netGain === "number"
                      ? `${player.netGain >= 0 ? "+" : ""}${player.netGain}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: "3rem" }}>📈 Tagesentwicklung (Net Gain)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={HISTORY} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {PLAYERS.map((p, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={p.name}
                  stroke={`hsl(${(i * 60) % 360}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default App;
