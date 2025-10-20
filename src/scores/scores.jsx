import React from 'react';
import './scores.css';
import { data } from 'react-router-dom';
import gameStructure, { game } from '../classes/game';

export function Scores() {

        const loadingScores = [
                    new gameStructure({id: 1, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),
                    new gameStructure({id: 2, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),
                    new gameStructure({id: 3, players: ['Loading...', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'], scores: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], datePlayed: 'Loading...'}),];

        const [loadingError, setLoadingError] = React.useState(false);
        const [scores, setScores] = React.useState(JSON.parse(localStorage.getItem('scores')) || loadingScores);
        const [reload, setReload] = React.useState(0);

        const handleSearch = () => {
            setScores(loadingScores);
            setLoadingError(false);
            setReload(prev => prev + 1);
        };


        React.useEffect(() => {
            // Reset to loading state
            setScores(loadingScores);
            setLoadingError(false);

            // Create a new Promise each time the effect runs
            const randomError = Math.random() < 0.1; // 10% chance of error
            const response = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (randomError) {
                        reject("Failed to fetch scores");
                    } else {

                        if (localStorage.getItem('scores')) {
                            resolve(JSON.parse(localStorage.getItem('scores')));
                        } else {
                            resolve([
                        new gameStructure({id: 1, players: ['James', 'Jeff', 'Mark', 'Davis', 'Tamie', 'Tate'], scores: [87, 80, 65, 60, 55, 54], datePlayed: '01/12/2023'}),
                        new gameStructure({id: 2, players: ['Sam', 'Janese', 'Juan', 'Smitty', 'Karry', 'N/A'], scores: [92, 90, 71, 62, 57, 'N/A'], datePlayed: '02/02/2023'}),
                        new gameStructure({id: 3, players: ['Hannah', 'Bryce', 'Colby', 'Sydnee', 'Faith', 'Carter'], scores: [101, 90, 65, 55, 50, 45], datePlayed: '02/12/2023'})
                        
                    ]);
                    }}
                }, 1000);
            });

            response.then(data => {
                setScores(data);
                localStorage.setItem('scores', JSON.stringify(data));
            }).catch(error => {
                setLoadingError(true);
            });
        }, [reload]);


  return (
    <main className="scores-main">
            <div className="search-area">
                <label htmlFor="searchInput">Search:</label>
                <input id="searchInput" />
                <button onClick={handleSearch}>Search</button>
            </div>
           <table id="scores-table">
                <thead>
                    <tr id="header-row">
                        <th>Game</th>
                        <th>Winner</th>
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
           {loadingError && <p className="error-message">Failed to load scores. Please try again later.</p>}
        </main>
  );
}