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

/**
 * Renders a game score row for the scores table
 * @param {Object} gameInfo - The game information object
 * @param {number} gameInfo.id - Game ID
 * @param {Array} gameInfo.players - Array of player names (or playerScores array)
 * @param {Array} gameInfo.scores - Array of scores
 * @param {string} gameInfo.datePlayed - Date the game was played
 */
export function game(gameInfo) {
    try {
        // Validate gameInfo structure
        if (!gameInfo) {
            throw new Error('Invalid game data structure');
        }

        let playerScores = [];

        // Handle two possible data structures:
        // 1. playerScores array (new format)
        // 2. separate players and scores arrays (legacy format)
        if (gameInfo.playerScores && Array.isArray(gameInfo.playerScores)) {
            playerScores = gameInfo.playerScores.map(ps => ({
                playerName: ps.playerName || 'N/A',
                score: ps.score || 'N/A'
            }));
        } else if (gameInfo.players && gameInfo.scores &&
                   Array.isArray(gameInfo.players) && Array.isArray(gameInfo.scores)) {
            // Combine players and scores arrays
            playerScores = gameInfo.players.map((player, index) => ({
                playerName: player || 'N/A',
                score: gameInfo.scores[index] || 'N/A'
            }));
        } else {
            throw new Error('Invalid game data structure');
        }

        // Ensure we have exactly 6 players (pad with empty if needed)
        while (playerScores.length < 6) {
            playerScores.push({ playerName: 'N/A', score: 'N/A' });
        }

        // Format the date if it's a valid date
        const formattedDate = gameInfo.datePlayed
            ? new Date(gameInfo.datePlayed).toLocaleDateString()
            : 'N/A';

        return (
            <tr>
                <td>{gameInfo.id}</td>
                {playerScores.slice(0, 6).map((player, index) => (
                    <td key={index}>
                        {player.playerName}: {player.score}
                    </td>
                ))}
                <td>{formattedDate}</td>
            </tr>
        );
    } catch (error) {
        console.error("Error rendering game:", error, gameInfo);
        return (
            <tr>
                <td colSpan="8">Error loading game data</td>
            </tr>
        );
    }
}


