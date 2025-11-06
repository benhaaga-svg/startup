const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const https = require('https');
const app = express();

const authCookieName = 'token';

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = [ {
    userName: 'a',
    password: '$2b$10$OYVj4l4nUmTk5vrKNbbL4u4g/g271xA7TQUDCvNdcjc2J4JDLk7qC',
    token: '8bd79524-cacf-4c0d-a029-bf844f4b8b82'
  }];

let leaderBoard = [{name: 'John Doe', position: '1st', gamesWon: 12, gamesLost: 2, avgScore: 83},
                {name: 'Jessie Terry', position: '2nd', gamesWon: 11, gamesLost: 4, avgScore: 75},
                {name: 'Marry Beth', position: '3rd', gamesWon: 10, gamesLost: 3, avgScore: 72},
                {name: 'Tabith Kim', position: '4th', gamesWon: 9, gamesLost: 6, avgScore: 67},
                {name: 'Jason Smith', position: '5th', gamesWon: 7, gamesLost: 7, avgScore: 65},
                {name: `(You)`, position: 'N/A', gamesWon: 0, gamesLost: 0, avgScore: 0}]

let scores = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());
app.use((req,res,next)=>{console.log(""); next();});

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
    const user = await createUser(req.body.userName, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ userName: user.userName });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('userName', req.body.userName);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ userName: user.userName });
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

// GetScores
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

// SubmitScore
apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});



apiRouter.get('/leaderboard', verifyAuth, (_req, res) => {
  console.log("Leaderboard requested");
  res.send(leaderBoard);
});

// GetRandomUser - Proxy endpoint for randomuser.me API
apiRouter.get('/randomuser', verifyAuth, (req, res) => {
  const results = req.query.results || 1;
  const url = `https://randomuser.me/api/?results=${results}`;

  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        res.send(jsonData);
      } catch (error) {
        res.status(500).send({ msg: 'Failed to parse response', error: error.message });
      }
    });
  }).on('error', (error) => {
    res.status(500).send({ msg: 'Failed to fetch random user', error: error.message });
  });
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// updateScores considers a new score for inclusion in the high scores.
function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    userName: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
