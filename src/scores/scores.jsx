import React from 'react';
import './scores.css';
import { data } from 'react-router-dom';
import gameStructure, {game} from '../classes/game';
import {globalStatsDisplay} from '../classes/globalStats';
import randomGameAdder from './randomGameAdd';

export function Scores() {


        const [globalStats, setGlobalStats] = React.useState(() => { 
            const stored = localStorage.getItem('globalStats');
            return stored ? JSON.parse(stored) : null;
        });
        // const loadingScores = [
        //             new gameStructure({id: 1, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),
        //             new gameStructure({id: 2, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),
        //             new gameStructure({id: 3, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),];

        const [loadingError, setLoadingError] = React.useState(false);
        const [scores, setScores] = React.useState(() => {
            const stored = localStorage.getItem('scores');
            return stored ? JSON.parse(stored) : [];
        });
        const [reload, setReload] = React.useState(0);

        


        React.useEffect(() => {
            // Reset error state
            setLoadingError(false);

            if (!localStorage.getItem('globalStats')) {
                setGlobalStats({totalPlayers: 0, totalGamesPlayed: 0, averageScore: 0, updatedAt: new Date()});
                localStorage.setItem('globalStats', JSON.stringify({totalPlayers: 0, totalGamesPlayed: 0, averageScore: 0, updatedAt: new Date()}));
            }

            // Fetch scores from the API

        }, [reload]);

        // Start the game simulator and listen for storage changes
        React.useEffect(() => {
            const handleStorageChange = () => {
                // Only update scores if we're not in an error state
                if (!loadingError) {
                    const updatedScores = localStorage.getItem('scores');
                    if (updatedScores) {
                        setScores(JSON.parse(updatedScores));
                        // Update global stats from localStorage (already calculated by addGame)
                        const updatedGlobalStats = localStorage.getItem('globalStats');
                        if (updatedGlobalStats) {
                            setGlobalStats(JSON.parse(updatedGlobalStats));
                        }
                    }
                }
            };

            fetchScores();
            

            // Start the simulator (only once due to singleton pattern)
            // randomGameAdder.start();

            // window.addEventListener('storage', handleStorageChange);
            // return () => {
            //     window.removeEventListener('storage', handleStorageChange);
            //     // Stop simulator when component unmounts
            //     randomGameAdder.stop();
            // };
        }, [loadingError]);

        async function fetchScores() {
                await fetch('/api/scores')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch scores');
                    }
                    return response.json();
                })
                .then((data) => {
                    setScores(data);
                    localStorage.setItem('scores', JSON.stringify(data));
                })
                .catch(error => {
                    console.error('Error fetching scores:', error);
                    setLoadingError(true);
                    // Fallback to localStorage if API fails
                    const localScores = localStorage.getItem('scores');
                    if (localScores) {
                        setScores(JSON.parse(localScores));
                    }
                });
            }


  return (
    <main className="scores-main">
            <h2>Game Scores</h2>
           <table id="scores-table">
                <thead>
                    <tr id="header-row">
                        <th>Game</th>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Player 3</th>
                        <th>Player 4</th>
                        <th>Player 5</th>
                        <th>Player 6</th>
                        <th>Date Played</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((gameData) => (
                        <React.Fragment key={gameData.id}>
                            {gameData && game(gameData)}
                        </React.Fragment>
                    ))}
                </tbody>
           </table>
           {loadingError && <div><p className="error-message">Failed to load scores. Please try again later.</p> <button onClick={() => setReload(reload + 1)}>Retry</button></div>}
           {globalStats && globalStatsDisplay(globalStats)}
        </main>
  );
}