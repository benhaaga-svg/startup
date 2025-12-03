import React from 'react';
import './leaderboard.css';
import { globalStatsDisplay } from '../classes/globalStats';

export function Leaderboard({userName, globalStatsProp} ) {
  



    const [loadingError, setLoadingError] = React.useState(false);
    const [lastLoadTime, setLastLoadTime] = React.useState(localStorage.getItem('leaderboardLastLoadTime') || '');
    const [leaderboardData, setLeaderboardData] = React.useState({ players: [] });



    React.useEffect(() => {
        // In a real application, you might fetch leaderboard data from an API here
            // Simulated original data fetch
            getLeaderboard();

            if (!localStorage.getItem('globalStats')) {
                setGlobalStats({totalPlayers: 0, totalGamesPlayed: 0, averageScore: 0, updatedAt: new Date()});
                localStorage.setItem('globalStats', JSON.stringify({totalPlayers: 0, totalGamesPlayed: 0, averageScore: 0, updatedAt: new Date()}));
            }

    }, []);


    async function getLeaderboard() {
        await fetch('/api/leaderboard')
                .then ((response) => response.json())
                .then ((data) => {
                    setLeaderboardData(data)
                    localStorage.setItem('leaderboardData', JSON.stringify(data));
                    setLastLoadTime(new Date().toISOString());
                    localStorage.setItem('leaderboardLastLoadTime', new Date().toISOString());
                })
                .catch((error) => {
                    console.error('Error fetching leaderboard data:', error);
                    setLoadingError(true);
                });
    }


    return (
    <main className="leaderboard-main">
              <h2>Leaderboard</h2>
           <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Games Won</th>
                        <th>Games Lost</th>
                        <th>Avg Score</th>
                    </tr>
                </thead>

                
                <tbody>
                    {leaderboardData.players.map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                            <td>{player.gamesWon}</td>
                            <td>{player.gamesLost}</td>
                            <td>{player.avgScore}</td>
                        </tr>
                    ))}
                </tbody>
           </table>
            {loadingError && <div><p className="error">Error loading leaderboard data. Please try again later.</p><button onClick={reloadData}>Retry</button></div>}

           <h3>Global Stats</h3>
           {globalStatsProp && globalStatsDisplay(globalStatsProp)}
        </main>
  );
}