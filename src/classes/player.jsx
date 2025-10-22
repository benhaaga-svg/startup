import React from 'react';

class player {
    constructor(name, gamesWon, gamesLost, avgScore, highestScore) {
        this.name = name;
        this.gamesWon = gamesWon;
        this.gamesLost = gamesLost;
        this.avgScore = avgScore;
        this.highestScore = highestScore;
    }
}

export default player;