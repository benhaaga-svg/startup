import React from 'react';

class globalStats {
    constructor({totalPlayers = 0, totalGamesPlayed = 0, highestScore = 0, averageScore = 0} = {}) {
        this.totalPlayers = totalPlayers;
        this.totalGamesPlayed = totalGamesPlayed;
        this.highestScore = highestScore;
        this.averageScore = averageScore;
        this.updatedAt = new Date('1970-01-01T00:00:00Z');
    }
}

export default globalStats;


export function globalStatsDisplay(statsinfo) {    
    return (<p>Total Players: {statsinfo.totalPlayers} | Games Played: {statsinfo.totalGamesPlayed} | Avg Score: {statsinfo.averageScore} | Last Updated: {new Date(statsinfo.updatedAt).toLocaleString()}</p>)
}