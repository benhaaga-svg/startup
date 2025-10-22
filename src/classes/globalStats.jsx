import React from 'react';

class globalStats {
    constructor({totalPlayers = 0, totalGamesPlayed = 0, highestScore = 0, averageScore = 0, totalScoreSum = 0, totalScoreCount = 0} = {}) {
        this.totalPlayers = totalPlayers;
        this.totalGamesPlayed = totalGamesPlayed;
        this.highestScore = highestScore;
        this.averageScore = averageScore;
        this.totalScoreSum = totalScoreSum;
        this.totalScoreCount = totalScoreCount;
        this.updatedAt = new Date('1970-01-01T00:00:00Z');
    }

    addGame(game) {
        // Increment total games played
        this.totalGamesPlayed++;

        // Process all scores in the game
        if (game.scores && Array.isArray(game.scores)) {
            game.scores.forEach(score => {
                if (typeof score === 'number' && !isNaN(score)) {
                    // Update highest score
                    if (score > this.highestScore) {
                        this.highestScore = score;
                    }

                    // Add to running sum for average calculation
                    this.totalScoreSum += score;
                    this.totalScoreCount++;
                    this.totalPlayers++;
                }
            });

            // Recalculate average score
            if (this.totalScoreCount > 0) {
                this.averageScore = Math.round(this.totalScoreSum / this.totalScoreCount);
            }
        }

        // Update the timestamp
        this.updatedAt = new Date();

        return this;
    }
}

export default globalStats;


export function globalStatsDisplay(statsinfo) {    
    return (<p>Total Players: {statsinfo.totalPlayers} | Games Played: {statsinfo.totalGamesPlayed} | Avg Score: {statsinfo.averageScore} | Last Updated: {new Date(statsinfo.updatedAt).toLocaleString()}</p>)
}