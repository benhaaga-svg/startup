import React from 'react';
import './scores.css';
import { data } from 'react-router-dom';

export function Scores() {

        const loadingScores = [
                    {game: 1, winner: 'Loading...', score: "N/A", player2: 'N/A', score2: "N/A", player3: 'N/A', score3: "N/A", player4: 'N/A', score4: "N/A", player5: 'N/A', score5: "N/A", player6: 'N/A', score6: "N/A", datePlayed: 'Loading...'},
                    {game: 2, winner: 'Loading...', score: "N/A", player2: 'N/A', score2: "N/A", player3: 'N/A', score3: "N/A", player4: 'N/A', score4: "N/A", player5: 'N/A', score5: "N/A", player6: 'N/A', score6: "N/A", datePlayed: 'Loading...'},
                    {game: 3, winner: 'Loading...', score: "N/A", player2: 'N/A', score2: "N/A", player3: 'N/A', score3: "N/A", player4: 'N/A', score4: "N/A", player5: 'N/A', score5: "N/A", player6: 'N/A', score6: "N/A", datePlayed: 'Loading...'}]

        const [loadingError, setLoadingError] = React.useState(false);
        const [scores, setScores] = React.useState(loadingScores);
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
                        resolve([
                        {game: 1, winner: 'James', score: 87, player2: 'Jeff', score2: 80, player3: 'Mark', score3: 65, player4: 'Davis', score4: 60, player5: 'Tamie', score5: 55, player6: 'Tate', score6: 54, datePlayed: '01/12/2023'},
                        {game: 2, winner: 'Sam', score: 92, player2: 'Janese', score2: 90, player3: 'Juan', score3: 71, player4: 'Smitty', score4: 62, player5: 'Karry', score5: 57, player6: 'N/A', score6: 'N/A', datePlayed: '02/02/2023'},
                        {game: 3, winner: 'Hannah', score: 101, player2: 'Bryce', score2: 90, player3: 'Colby', score3: 65, player4: 'Sydnee', score4: 55, player5: 'Faith', score5: 50, player6: 'Carter', score6: 45, datePlayed: '02/12/2023'}
                    ]);
                    }
                }, 1000);
            });

            response.then(data => {
                setScores(data);
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
                <tr id="header-row">
                    <td>Game</td>
                    <td>Winner</td>
                    <td>Player 2</td>
                    <td>Player 3</td>
                    <td>Player 4</td>
                    <td>Player 5</td>
                    <td>Player 6</td>
                    <td>Date Played</td>
                </tr>
                <tr id="player1">
                    <td>1</td>
                    <td>{scores[0].winner}: {scores[0].score}</td>
                    <td>{scores[0].player2}: {scores[0].score2}</td>
                    <td>{scores[0].player3}: {scores[0].score3}</td>
                    <td>{scores[0].player4}: {scores[0].score4}</td>
                    <td>{scores[0].player5}: {scores[0].score5}</td>
                    <td>{scores[0].player6}: {scores[0].score6}</td>
                    <td>{scores[0].datePlayed}</td>
                </tr>
                <tr id="player2">
                    <td>2</td>
                    <td>{scores[1].winner}: {scores[1].score}</td>
                    <td>{scores[1].player2}: {scores[1].score2}</td>
                    <td>{scores[1].player3}: {scores[1].score3}</td>
                    <td>{scores[1].player4}: {scores[1].score4}</td>
                    <td>{scores[1].player5}: {scores[1].score5}</td>
                    <td>{scores[1].player6}: {scores[1].score6}</td>
                    <td>{scores[1].datePlayed}</td>
                </tr>
                <tr id="player3">
                    <td>3</td>
                    <td>{scores[2].winner}: {scores[2].score}</td>
                    <td>{scores[2].player2}: {scores[2].score2}</td>
                    <td>{scores[2].player3}: {scores[2].score3}</td>
                    <td>{scores[2].player4}: {scores[2].score4}</td>
                    <td>{scores[2].player5}: {scores[2].score5}</td>
                    <td>{scores[2].player6}: {scores[2].score6}</td>
                    <td>{scores[2].datePlayed}</td>
                </tr>
           </table>
           {loadingError && <p className="error-message">Failed to load scores. Please try again later.</p>}
        </main>
  );
}