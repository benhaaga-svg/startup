import React from 'react';
import './upload.css';
import gameStructure from '../classes/game';
import { UploadNotifier, UploadEvent } from '../classes/globalStatsNotifier';
import { authFetch } from '../utils/authFetch';

export function Upload({globalStatsUpdate, totalGamesPlayed}) {
  const [players, setPlayers] = React.useState(['', '', '', '', '', '']);
  const [scores, setScores] = React.useState(['', '', '', '', '', '']);
  const [datePlayed, setDatePlayed] = React.useState('');
  const [roundsPlayed, setRoundsPlayed] = React.useState('');
  const [gameSheet, setGameSheet] = React.useState(null);
  const [errors, setErrors] = React.useState({
    datePlayed: false,
    player1Score: false,
    player2Score: false,
    player3Score: false,
    player4Score: false,
    player5Score: false,
    player6Score: false,
    roundsPlayed: false
  });

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);

    // Clear error for this score if value is provided
    if (value && value.trim() !== '') {
      setErrors(prev => ({ ...prev, [`player${index + 1}Score`]: false }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGameSheet(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById('gameSheetPreview').src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = async () => {
    console.log("handleSubmit called");

    // Reset errors first
    const newErrors = {
      datePlayed: false,
      player1Score: false,
      player2Score: false,
      player3Score: false,
      player4Score: false,
      player5Score: false,
      player6Score: false,
      roundsPlayed: false
    };

    // Validate required fields
    if (!datePlayed) {
      newErrors.datePlayed = true;
    }
    if (!roundsPlayed || isNaN(parseInt(roundsPlayed)) || parseInt(roundsPlayed) < 4 || parseInt(roundsPlayed) > 13) {
      newErrors.roundsPlayed = true;
    }
    // Validate that each player has a corresponding score
    for (let i = 0; i < players.length; i++) {
      if (players[i] && players[i].trim() !== '' && (!scores[i] || scores[i].trim() === '')) {
        newErrors[`player${i + 1}Score`] = true;
      }
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(Boolean)) {
      console.log("Validation failed, errors:", newErrors);
      return;
    }

    console.log("Validation passed, proceeding with upload");

    // Get existing scores from localStorage
    let existingScores = localStorage.getItem('scores')
      ? JSON.parse(localStorage.getItem('scores'))
      : [];

    console.log("existingScores:", existingScores.length);
    // Generate new ID (max existing ID + 1)
    const newId = existingScores.length > 0
      ? Math.max(...existingScores.map(game => game.id)) + 1
      : 1;

    // Create new gameStructure object
    const newGame = new gameStructure({
      id: 0,
      players: players.map(p => p || 'N/A'),
      scores: scores.map(s => s || 'N/A'),
      datePlayed: datePlayed,
      sheet: gameSheet ? gameSheet.name : null,
      roundsPlayed: roundsPlayed
    });

    try {
      // Submit to API
      const response = await authFetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame)
      });

      if (response.ok) {
        // Update localStorage with the new game
        existingScores.push(newGame);
        localStorage.setItem('scores', JSON.stringify(existingScores));

        alert('Game uploaded successfully!');

        // Reset form
        setPlayers(['', '', '', '', '', '']);
        setScores(['', '', '', '', '', '']);
        setDatePlayed('');
        setRoundsPlayed('');
        setGameSheet(null);
        setErrors({
          datePlayed: false,
          player1Score: false,
          player2Score: false,
          player3Score: false,
          player4Score: false,
          player5Score: false,
          player6Score: false,
          roundsPlayed: false
        });
        document.getElementById('gameSheetPreview').src = 'placeholder.png';
        document.getElementById('gameSheetInput').value = '';
        // Notify upload end

        console.log("Fetching updated global stats after upload");
        async function fetchGlobalStats() {
    try {
      const response = await authFetch('/api/globalStats');
      if (response.ok) {
          const data = await response.json();
          return data;
      } else {
          console.error('Failed to fetch global stats');
          return {playerCount: 0, totalGamesPlayed: 0, averageScore: 0, dateUpdated: new Date()};
      }
    } catch (error) {
      console.error('Failed to fetch global stats:', error);
      return {playerCount: 0, totalGamesPlayed: 0, averageScore: 0, dateUpdated: new Date()};
    }
  }
        let newStats = await fetchGlobalStats();

        await globalStatsUpdate(newStats);
        console.log("Broadcasting upload end event with stats:", newStats);

        // Broadcast the event (non-blocking)
        try {
          UploadNotifier.broadcastEvent('Upload', UploadEvent.End, { msg: newStats });
        } catch (error) {
          console.error('Failed to broadcast upload event:', error);
        }
      } else {
        alert('Failed to upload game. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading game:', error);
      alert('Failed to upload game. Please try again.');
    }
  };

  return (
     <main>
           <h2>Upload a game</h2>
           <div className="sign-in-square">
           <div className={errors.player1Score === true ? "error" : ""}><p>Player 1: </p><input value={players[0]} onChange={(e) => handlePlayerChange(0, e.target.value)}></input><p>Player 1 Score: </p><input value={scores[0]} onChange={(e) => handleScoreChange(0, e.target.value)} type="number"></input></div>
           <div className={errors.player2Score === true ? "error" : ""}><p>Player 2: </p><input value={players[1]} onChange={(e) => handlePlayerChange(1, e.target.value)}></input><p>Player 2 Score: </p><input value={scores[1]} onChange={(e) => handleScoreChange(1, e.target.value)} type="number"></input></div>
           <div className={errors.player3Score === true ? "error" : ""}><p>Player 3: </p><input value={players[2]} onChange={(e) => handlePlayerChange(2, e.target.value)}></input><p>Player 3 Score: </p><input value={scores[2]} onChange={(e) => handleScoreChange(2, e.target.value)} type="number"></input></div>
           <div className={errors.player4Score === true ? "error" : ""}><p>Player 4: </p><input value={players[3]} onChange={(e) => handlePlayerChange(3, e.target.value)}></input><p>Player 4 Score: </p><input value={scores[3]} onChange={(e) => handleScoreChange(3, e.target.value)} type="number"></input></div>
           <div className={errors.player5Score === true ? "error" : ""}><p>Player 5: </p><input value={players[4]} onChange={(e) => handlePlayerChange(4, e.target.value)}></input><p>Player 5 Score: </p><input value={scores[4]} onChange={(e) => handleScoreChange(4, e.target.value)} type="number"></input></div>
           <div className={errors.player6Score === true ? "error" : ""}><p>Player 6: </p><input value={players[5]} onChange={(e) => handlePlayerChange(5, e.target.value)}></input><p>Player 6 Score: </p><input value={scores[5]} onChange={(e) => handleScoreChange(5, e.target.value)} type="number"></input></div>
           <div className={errors.datePlayed === true ? "error" : ""}><p>Date played:* </p><input value={datePlayed} type = "date" onChange={(e) => { setDatePlayed(e.target.value); if (e.target.value) setErrors(prev => ({ ...prev, datePlayed: false })); }}></input><p>Rounds Played: </p><input value={roundsPlayed} type="number" onChange={(e) => setRoundsPlayed(e.target.value)}></input></div>
           <div className="upload-image-area" onClick={() => document.getElementById('gameSheetInput').click()}>
               <p>Upload game sheet:*</p>
               <img src="placeholder.png" id="gameSheetPreview" alt="Game sheet preview"/>
               <input type="file" id="gameSheetInput" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange}></input>
           </div>

           <div><p>*required</p></div>
           </div>


           <button onClick={handleSubmit}>Submit</button>
        </main>
  );
}