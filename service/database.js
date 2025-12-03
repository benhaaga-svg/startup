const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('trackyourbids');
const userCollection = db.collection('user');
const scoreCollection = db.collection('score');
const globalStatsCollection = db.collection('globalStats');
const leaderboardCollection = db.collection('leaderboard');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(userName) {
  return userCollection.findOne({ userName: userName });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ userName: user.userName }, { $set: user });
}

async function updateDate(date) {
  await globalStatsCollection.updateOne({}, { $set: { dateUpdated: date } }, { upsert: true });
}

async function addScore(score) {
  try {
    await updateDate(new Date());
    console.log("Adding score to database");

    // Get the highest existing ID
    const lastScore = await scoreCollection.findOne(
      {},
      { sort: { id: -1 }, projection: { id: 1 } }
    );

    // Set the new ID to be one higher than the current max (or 1 if no scores exist)
    const newId = lastScore && lastScore.id ? lastScore.id + 1 : 1;
    score.id = newId;

    const result = await scoreCollection.insertOne(score);
    console.log("Score added, now updating leaderboard");
    await LeaderboardUpdate(); // Update leaderboard stats after adding the new score
    console.log("Leaderboard update completed");
    return result;
  } catch (error) {
    console.error("Error in addScore:", error);
    throw error;
  }
}


async function updateLeaderboard(leaderboardData) {
    console.log("Updating leaderboard with data:", leaderboardData);
    const result = await leaderboardCollection.updateOne({}, { $set: { players: leaderboardData } }, { upsert: true });
    console.log("Leaderboard update result:", result);
}



async function updateGlobalStats(stats) {
  console.log("Updating global stats with:", stats);
  const result = await globalStatsCollection.updateOne({}, { $set: stats }, { upsert: true });
  console.log("Global stats update result:", result);
}

function getScores() {
  const options = {
    sort: { id: 1 }
  };
  return scoreCollection.find({}, options).toArray();
}

function getHighScores() {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

// Get all games for a specific player
async function getPlayerHistory(playerName) {
  const query = {
    'playerScores.playerName': playerName
  };
  const options = {
    sort: { id: -1 } // Most recent games first
  };
  return scoreCollection.find(query, options).toArray();
}

// Get player statistics (games played, average score, etc.)
async function getPlayerStats(playerName) {
  const games = await getPlayerHistory(playerName);
  if (games.length === 0 || !games) {
    return {
      playerName,
      gamesPlayed: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      totalScore: 0
    };
  }

 

  // Extract this player's scores from all games
  const scores = games
    .map(game => {
      const playerScore = game.playerScores?.find(ps => ps.playerName === playerName);
      return playerScore ? playerScore.score : null;
    })
    .filter(score => {
      // Filter out null, undefined, 'N/A', and non-numeric values
      if (score === null || score === undefined || score === 'N/A') return false;
      const numScore = typeof score === 'number' ? score : parseFloat(score);
      return !isNaN(numScore) && numScore > 0;
    })
    .map(score => typeof score === 'number' ? score : parseFloat(score));

  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  return {
    playerName,
    gamesPlayed: scores.length || 0, // Count only games with valid scores
    averageScore: Math.round(averageScore * 10) / 10,
    highestScore,
    lowestScore,
    totalScore
  };
}

// Get all unique players who have played
async function getAllPlayers() {
  const distinctPlayers = await scoreCollection.distinct('playerScores.playerName');
  return distinctPlayers.filter(name => name && name !== 'N/A');
}


async function getGlobalStats() {
  const stats = await globalStatsCollection.findOne({});
  return stats || {
    totalPlayers: 0,
    totalGamesPlayed: 0,
    highestScore: 0,
    averageScore: 0,
  };
}


async function getLeaderboard() {
  const stats = await leaderboardCollection.findOne({});
  return stats || {
    players: []
  };
}

// Calculate leaderboard based on wins (highest score in each game)
async function LeaderboardUpdate() {
  console.log("LeaderboardUpdate: Starting update...");
  const allGames = await scoreCollection.find({}).toArray();
  console.log(`LeaderboardUpdate: Found ${allGames.length} games`);
  const playerStats = {};
  let globalStats = {
    highestScore: 0,
    totalScoreSum: 0,
    playerCount: 0,
    totalGamesPlayed: allGames.length,
    averageScore: 0,
  };



  // Process each game to determine winners
  allGames.forEach(game => {
    if (!game.playerScores || game.playerScores.length === 0) return;

    // Filter out invalid scores and find the highest valid score
    const validScores = game.playerScores
      .filter(ps => {
        if (!ps.score || ps.score === 'N/A' || ps.playerName === 'N/A') return false;
        const num = typeof ps.score === 'number' ? ps.score : parseFloat(ps.score);
        return !isNaN(num) && num > 0;
      })
      .map(ps => ({
        playerName: ps.playerName,
        score: typeof ps.score === 'number' ? ps.score : parseFloat(ps.score)
      }));

    if (validScores.length === 0) return;

    const highestScore = Math.max(...validScores.map(ps => ps.score));
    if (highestScore > globalStats.highestScore) {
      globalStats.highestScore = highestScore;
    }

    // Process all players in this game
    validScores.forEach(ps => {
      if (!playerStats[ps.playerName]) {
        playerStats[ps.playerName] = {
          name: ps.playerName,
          gamesWon: 0,
          gamesLost: 0,
          totalScore: 0,
          gameCount: 0
        };
      }

      playerStats[ps.playerName].totalScore += ps.score;
      playerStats[ps.playerName].gameCount += 1;

      // Check if this player won (had the highest score)
      if (ps.score === highestScore) {
        playerStats[ps.playerName].gamesWon += 1;
      } else {
        playerStats[ps.playerName].gamesLost += 1;
      }
    });
  });

  // Calculate global stats totals
  const totalScoreSum = Object.values(playerStats).reduce((sum, player) => sum + player.totalScore, 0);
  const playerCount = Object.keys(playerStats).length;

  globalStats.totalScoreSum = totalScoreSum;
  globalStats.playerCount = playerCount;
  globalStats.averageScore = totalScoreSum > 0 && playerCount > 0
    ? Math.round((totalScoreSum / playerCount) * 10) / 10
    : 0;

  // Update global stats in the database
  console.log("LeaderboardUpdate: Updating global stats...");
  await updateGlobalStats(globalStats);
  console.log("LeaderboardUpdate: Global stats updated, building leaderboard...");
  // Convert to array and calculate average scores
  const leaderboard = Object.values(playerStats)
    .map(player => ({
      name: player.name,
      gamesWon: player.gamesWon,
      gamesLost: player.gamesLost,
      avgScore: player.gameCount > 0 ? Math.round((player.totalScore / player.gameCount) * 10) / 10 : 0
    }))
    .sort((a, b) => {
      // Sort by wins first, then by average score
      if (b.gamesWon !== a.gamesWon) {
        return b.gamesWon - a.gamesWon;
      }
      return b.avgScore - a.avgScore;
    })
    .slice(0, 10); // Top 10 players

  // Add position labels
  const positions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
  console.log(`LeaderboardUpdate: Updating leaderboard with ${leaderboard.length} players...`);
  await updateLeaderboard(leaderboard.map((player, index) => ({
    ...player,
    position: positions[index] || `${index + 1}th`
  })));
  console.log("LeaderboardUpdate: Leaderboard update complete!");

}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addScore,
  getHighScores,
  getScores,
  getPlayerHistory,
  getPlayerStats,
  getAllPlayers,
  getLeaderboard,
  getGlobalStats,
};
