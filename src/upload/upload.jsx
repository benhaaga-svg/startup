import React from 'react';
import './upload.css';

export function Upload() {
  return (
     <main>
           <h2>Upload a game</h2>
           <div class="sign-in-square">
           <div><p>Player 1: </p><input></input><p>Player 1 Score: </p><input></input></div>
           <div><p>Player 2: </p><input></input><p>Player 2 Score: </p><input></input></div>
           <div><p>Player 3: </p><input></input><p>Player 3 Score: </p><input></input></div>
           <div><p>Player 4: </p><input></input><p>Player 4 Score: </p><input></input></div>
           <div><p>Player 5: </p><input></input><p>Player 5 Score: </p><input></input></div>
           <div><p>Player 6: </p><input></input><p>Player 6 Score: </p><input></input></div>
           <div><p>Date played:* </p><input></input><p>Game Name: </p><input></input></div>
           <div class="upload-image-area" onclick="document.getElementById('gameSheetInput').click();">
               <p>Upload game sheet:*</p>
               <img src="placeholder.png" id="gameSheetPreview"/>
               <input type="file" id="gameSheetInput" style="display:none" accept="image/*"></input>
           </div>
        
           <div><p>*required</p></div>
           </div>
          

           <button>Submit</button>
        </main>
  );
}