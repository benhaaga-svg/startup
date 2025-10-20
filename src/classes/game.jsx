import React from 'react';

class gameStructure {
    constructor({id, players, scores, datePlayed, sheet = null}) {
        this.id = id;
        this.players = players;
        this.scores = scores;
        this.datePlayed = datePlayed;
        this.sheet = sheet;
    }


}


export default gameStructure;

export function game(gameInfo) {
        return (<tr id={gameInfo.id}>
                    <td>{gameInfo.id}</td>
                    <td>{gameInfo.players[0]}: {gameInfo.scores[0]}</td>
                    <td>{gameInfo.players[1]}: {gameInfo.scores[1]}</td>
                    <td>{gameInfo.players[2]}: {gameInfo.scores[2]}</td>
                    <td>{gameInfo.players[3]}: {gameInfo.scores[3]}</td>
                    <td>{gameInfo.players[4]}: {gameInfo.scores[4]}</td>
                    <td>{gameInfo.players[5]}: {gameInfo.scores[5]}</td>
                    <td>{gameInfo.datePlayed}</td>
                </tr>)
} 
