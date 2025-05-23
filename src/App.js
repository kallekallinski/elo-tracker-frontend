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
  {
    name: "Dogwauwau",
    tag: "EUW",
    startTier: "DIAMOND",
    startDivision: "III",
    startLP: 30 // 📅 Startwert vom 18. Mai 2025
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
    startDivision: "IV",
    startLP: 3
  },
  {
    name: "I Am Atomic",
    tag: "KERO",
    startTier: "DIAMOND",
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
    startTier: "GOLD",
    startDivision: "IV",
    startLP: 40
  }
];

const API_BASE = "https://elo-backend.onrender.com";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        PLAYERS.map(async (player) => {
          try {
            const res = await fetch(
              `${API_BASE}/api/summoner?name=${encodeURIComponent(player.name)}&tag=${player.tag}&startTier=${player.startTier}&startDivision=${player.startDivision}&startLP=${player.startLP}`
            );
            const json = await res.json();

            return {
              ...json,
              startLP: player.startLP,
              startTier: player.startTier,
              startDivision: player.startDivision
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
                  <td>{`${player.startTier} ${player.startDivision} ${player.startLP} LP`}</td>
                  <td>
                    {typeof player.netGain === "number"
                      ? `${player.netGain >= 0 ? "+" : ""}${player.netGain}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
