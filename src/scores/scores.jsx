import React from 'react';
import './scores.css';
import { data } from 'react-router-dom';
import gameStructure, { game } from '../classes/game';
import {globalStatsDisplay} from '../classes/globalStats';
import randomGameAdder from './randomGameAdd';

export function Scores() {


        const [globalStats, setGlobalStats] = React.useState(() => { 
            const stored = localStorage.getItem('globalStats');
            return stored ? JSON.parse(stored) : null;
        });
        const loadingScores = [
                    new gameStructure({id: 1, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),
                    new gameStructure({id: 2, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),
                    new gameStructure({id: 3, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),];

        const [loadingError, setLoadingError] = React.useState(false);
        const [scores, setScores] = React.useState(JSON.parse(localStorage.getItem('scores')) || loadingScores);
        const [reload, setReload] = React.useState(0);

        


        React.useEffect(() => {
            // Reset to loading state
            setScores(loadingScores);
            setLoadingError(false);

            if (!localStorage.getItem('globalStats')) {
                setGlobalStats({totalPlayers: 0, totalGamesPlayed: 0, averageScore: 0, updatedAt: new Date()});
                localStorage.setItem('globalStats', JSON.stringify({totalPlayers: 0, totalGamesPlayed: 0, averageScore: 0, updatedAt: new Date()}));
            }
            // Create a new Promise each time the effect runs
            const randomError = Math.random() < 0.1; // 10% chance of error
            const response = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (randomError) {
                        reject("Failed to fetch scores");
                    } else {

                        if (localStorage.getItem('scores')) {
                            resolve(JSON.parse(localStorage.getItem('scores')));
                        }
                    }
                }, 1000);
            });

            response.then(data => {
                setScores(data);
                localStorage.setItem('scores', JSON.stringify(data));
            }).catch(error => {
                setLoadingError(true);
            });
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

            // Start the simulator (only once due to singleton pattern)
            randomGameAdder.start();

            window.addEventListener('storage', handleStorageChange);
            return () => {
                window.removeEventListener('storage', handleStorageChange);
                // Stop simulator when component unmounts
                randomGameAdder.stop();
            };
        }, [loadingError]);


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
                            {game(gameData)}
                        </React.Fragment>
                    ))}
                </tbody>
           </table>
           {loadingError && <div><p className="error-message">Failed to load scores. Please try again later.</p> <button onClick={() => setReload(reload + 1)}>Retry</button></div>}
           {globalStats && globalStatsDisplay(globalStats)}
        </main>
  );
}