import React from 'react';
import './leaderboard.css';
import { globalStatsDisplay } from '../classes/globalStats';

export function Leaderboard({userName}) {
  

    const [globalStats, setGlobalStats] = React.useState(() => {
        const stored = localStorage.getItem('globalStats');
        return stored ? JSON.parse(stored) : null;
    });

    const [loadingError, setLoadingError] = React.useState(false);
    const [lastLoadTime, setLastLoadTime] = React.useState(localStorage.getItem('leaderboardLastLoadTime') || '');
    const [leaderboardData, setLeaderboardData] = React.useState([
        {name: 'Loading...', position: '1st', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: 'Loading...', position: '2nd', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: 'Loading...', position: '3rd', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: 'Loading...', position: '4th', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: 'Loading...', position: '5th', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: `${userName} (You)`, position: 'Loading', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
    ]);

    React.useEffect(() => {
        // In a real application, you might fetch leaderboard data from an API here
            // Simulated original data fetch
            reloadData();

            if (!localStorage.getItem('globalStats')) {
                setGlobalStats({totalPlayers: 0, totalGamesPlayed: 0, averageScore: 0, updatedAt: new Date()});
                localStorage.setItem('globalStats', JSON.stringify({totalPlayers: 0, totalGamesPlayed: 0, averageScore: 0, updatedAt: new Date()}));
            }

    }, []);

    async function reloadData() {
        setLoadingError(false);
        setLeaderboardData([
        {name: 'Loading...', position: '1st', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: 'Loading...', position: '2nd', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: 'Loading...', position: '3rd', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: 'Loading...', position: '4th', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: 'Loading...', position: '5th', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},
        {name: `${userName} (You)`, position: 'Loading', gamesWon: 'N/A', gamesLost: 'N/A', avgScore: 'N/A'},]);

        // Simulate data fetch
            fetch('/api/leaderboard')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch leaderboard');
                    }
                    return response.json();
                })
                .then((data) => {
                    setLeaderboardData(data);
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
                <tr>
                    <td>Name</td>
                    <td>Position</td>
                    <td>Games Won</td>
                    <td>Games Lost</td>
                    <td>Avg Score</td>
                </tr>
                
                {leaderboardData.map((player, index) => (
                    <tr key={index}>
                        <td>{player.name}</td>
                        <td>{player.position}</td>
                        <td>{player.gamesWon}</td>
                        <td>{player.gamesLost}</td>
                        <td>{player.avgScore}</td>
                </tr>
                ))}
           </table>
            {loadingError && <div><p className="error">Error loading leaderboard data. Please try again later.</p><button onClick={reloadData}>Retry</button></div>}

           <h3>Global Stats</h3>
           {globalStats && globalStatsDisplay(globalStats)}
        </main>
  );
}