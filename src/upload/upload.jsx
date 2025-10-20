import React from 'react';
import './upload.css';
import gameStructure from '../classes/game';

export function Upload() {
  const [players, setPlayers] = React.useState(['', '', '', '', '', '']);
  const [scores, setScores] = React.useState(['', '', '', '', '', '']);
  const [datePlayed, setDatePlayed] = React.useState('');
  const [gameName, setGameName] = React.useState('');
  const [gameSheet, setGameSheet] = React.useState(null);

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value || 'N/A';
    setPlayers(newPlayers);
  };

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    newScores[index] = value || 'N/A';
    setScores(newScores);
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

  const handleSubmit = () => {
    // Validate required fields
    if (!datePlayed) {
      alert('Date played is required');
      return;
    }

    // Get existing scores from localStorage
    const existingScores = JSON.parse(localStorage.getItem('scores')) || [];

    // Generate new ID (max existing ID + 1)
    const newId = existingScores.length > 0
      ? Math.max(...existingScores.map(game => game.id)) + 1
      : 1;

    // Create new gameStructure object

    const newGame = new gameStructure({
      id: newId,
      players: players.map(p => p || 'N/A'),
      scores: scores.map(s => s || 'N/A'),
      datePlayed: datePlayed,
      sheet: gameSheet ? gameSheet.name : null
    });

    // Add to existing scores and save
    const updatedScores = [...existingScores, newGame];
    localStorage.setItem('scores', JSON.stringify(updatedScores));

    // Reset form
    setPlayers(['', '', '', '', '', '']);
    setScores(['', '', '', '', '', '']);
    setDatePlayed('');
    setGameName('');
    setGameSheet(null);
    document.getElementById('gameSheetPreview').src = 'placeholder.png';
    document.getElementById('gameSheetInput').value = '';

    alert('Game uploaded successfully!');
  };

  return (
     <main>
           <h2>Upload a game</h2>
           <div className="sign-in-square">
           <div><p>Player 1: </p><input value={players[0]} onChange={(e) => handlePlayerChange(0, e.target.value)}></input><p>Player 1 Score: </p><input value={scores[0]} onChange={(e) => handleScoreChange(0, e.target.value)}></input></div>
           <div><p>Player 2: </p><input value={players[1]} onChange={(e) => handlePlayerChange(1, e.target.value)}></input><p>Player 2 Score: </p><input value={scores[1]} onChange={(e) => handleScoreChange(1, e.target.value)}></input></div>
           <div><p>Player 3: </p><input value={players[2]} onChange={(e) => handlePlayerChange(2, e.target.value)}></input><p>Player 3 Score: </p><input value={scores[2]} onChange={(e) => handleScoreChange(2, e.target.value)}></input></div>
           <div><p>Player 4: </p><input value={players[3]} onChange={(e) => handlePlayerChange(3, e.target.value)}></input><p>Player 4 Score: </p><input value={scores[3]} onChange={(e) => handleScoreChange(3, e.target.value)}></input></div>
           <div><p>Player 5: </p><input value={players[4]} onChange={(e) => handlePlayerChange(4, e.target.value)}></input><p>Player 5 Score: </p><input value={scores[4]} onChange={(e) => handleScoreChange(4, e.target.value)}></input></div>
           <div><p>Player 6: </p><input value={players[5]} onChange={(e) => handlePlayerChange(5, e.target.value)}></input><p>Player 6 Score: </p><input value={scores[5]} onChange={(e) => handleScoreChange(5, e.target.value)}></input></div>
           <div><p>Date played:* </p><input value={datePlayed} onChange={(e) => setDatePlayed(e.target.value)}></input><p>Game Name: </p><input value={gameName} onChange={(e) => setGameName(e.target.value)}></input></div>
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