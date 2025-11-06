import gameStructure from '../classes/game';
import globalStats from '../classes/globalStats';

class simulateGameAdd {
    constructor() {
        this.intervalId = null;
    }

    start() {
        if (this.intervalId) {
            console.log("Game simulator already running");
            return;
        }
        this.intervalId = setInterval(() => {
            this.addRandomGame();
        }, 3600000); // Simulate every hour
        console.log("Game simulator started");
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log("Game simulator stopped");
        }
    }

    async addRandomGame() {
        const numPlayers = Math.floor(Math.random() * 2) + 5; // 4-5 players
        const { players, scores } = await generateScores();

        // Generate random players and scores
        async function generateScores() {
            const players = ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"];
            const scores = [];

            // Fetch multiple users in one request
            const response = await fetch(`/api/randomuser?results=${numPlayers}`);
            if (!response.ok) {
                console.error("Failed to fetch random users:", response.status);
                // Use fallback names
                for (let i = 0; i < numPlayers; i++) {
                    players[i] = "Player " + (i + 1);
                    scores.push(Math.floor(Math.random() * 50)+50);
                }
            } else {
                const data = await response.json();
                if (data.results && data.results.length >= numPlayers) {
                    for (let i = 0; i < numPlayers; i++) {
                        const firstName = data.results[i].name.first;
                        players[i] = firstName;
                        console.log("Generated player:", firstName);
                        scores.push(Math.floor(Math.random() * 50)+50);
                    }
                } else {
                    console.error("Invalid response format or insufficient results:", data);
                    // Use fallback names
                    for (let i = 0; i < numPlayers; i++) {
                        players[i] = "Player " + (i + 1);
                        scores.push(Math.floor(Math.random() * 50)+50);
                    }
                }
            }

        // Pad arrays to 6 players if needed
        while (scores.length < 6) {
            scores.push('N/A');
        }
        return { players, scores };
    }
    // Get existing scores from localStorage
    const existingScores = localStorage.getItem('scores')
        ? JSON.parse(localStorage.getItem('scores'))
        : [];

        // Create new game with incremented ID
        const newGame = new gameStructure({
            id: existingScores.length + 1,
            players: players,
            scores: scores,
            datePlayed: new Date().toLocaleDateString(),
            sheet: null
        });

        // Add new game to the array
        existingScores.push(newGame);

        // Save back to localStorage
        fetch('/api/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGame)
        }).then(response => {
            if (response.ok) {
                localStorage.setItem('scores', JSON.stringify(existingScores));
            }
        });

        // Update global stats with the new game
        const currentStats = localStorage.getItem('globalStats')
            ? JSON.parse(localStorage.getItem('globalStats'))
            : {};

        // Create globalStats instance from stored data
        const statsInstance = new globalStats(currentStats);

        // Add the new game and recalculate stats
        statsInstance.addGame(newGame);

        // Save updated stats back to localStorage
        localStorage.setItem('globalStats', JSON.stringify(statsInstance));

        console.log("Simulated game added:", newGame);
        console.log("Updated global stats:", statsInstance);

        // Trigger a storage event to notify other components
        window.dispatchEvent(new Event('storage'));
    }
}

// Create singleton instance
let instance = null;

export function getGameSimulator() {
    if (!instance) {
        instance = new simulateGameAdd();
    }
    return instance;
}

export default getGameSimulator();