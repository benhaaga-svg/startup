const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const https = require('https');
const app = express();
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);




// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('userName', req.body.userName)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.userName, req.body.password, req.body.firstName, req.body.lastName, req.body.dob);

    setAuthCookie(res, user.token);
    res.send({ user: { userName: user.userName, firstName: user.firstName, lastName: user.lastName, dob: user.dob } });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('userName', req.body.userName);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ user: { userName: user.userName, firstName: user.firstName, lastName: user.lastName, dob: user.dob } });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});




// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    await DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};


apiRouter.get('/globalStats', verifyAuth, async (_req, res) => {
  try {
    console.log("Global stats requested");
    const globalStats = await DB.getGlobalStats();
    res.send(globalStats);
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).send({ msg: 'Error fetching global stats', error: error.message });
  }
});

// GetScores
apiRouter.get('/scores', verifyAuth, async (_req, res) => {
  const scores = await DB.getScores();
  res.send(scores);
});

// SubmitScore
apiRouter.post('/score', verifyAuth, async (req, res) => {
  const scores = updateScores(req.body);
  res.send(scores);
});



apiRouter.get('/leaderboard', verifyAuth, async (_req, res) => {
  try {
    console.log("Leaderboard requested");
    const leaderboard = await DB.getLeaderboard();
    res.send(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).send({ msg: 'Error fetching leaderboard', error: error.message });
  }
});

// Get player history - all games for a specific player
apiRouter.get('/player/:playerName/history', verifyAuth, async (req, res) => {
  try {
    const history = await DB.getPlayerHistory(req.params.playerName);
    res.send(history);
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching player history', error: error.message });
  }
});

// Get player statistics
apiRouter.get('/player/:playerName/stats', verifyAuth, async (req, res) => {
  try {
    const stats = await DB.getPlayerStats(req.params.playerName);
    res.send(stats);
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching player stats', error: error.message });
  }
});

// Get all players
apiRouter.get('/players', verifyAuth, async (_req, res) => {
  try {
    const players = await DB.getAllPlayers();
    res.send(players);
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching players', error: error.message });
  }
});



// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public'});
});

// updateScores considers a new score for inclusion in the high scores.
async function updateScores(newScore) {
  await DB.addScore(newScore);
  return DB.getHighScores();
}

async function createUser(userName, password, firstName, lastName, dob) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    userName: userName,
    password: passwordHash,
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    token: uuid.v4(),
  };
  await DB.addUser(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpServer = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpServer);
