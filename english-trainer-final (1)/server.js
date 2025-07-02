const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static('public'));

let players = [];
let readyCount = 0;
let currentQuestion = null;
const questions = [
  { question: "What is the English word for 'Hund'?", answer: "dog" },
  { question: "What is the English word for 'Katze'?", answer: "cat" },
  { question: "What is the English word for 'Apfel'?", answer: "apple" },
  { question: "What is the English word for 'Haus'?", answer: "house" }
];

function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

function sendNewQuestion() {
  currentQuestion = getRandomQuestion();
  io.emit('newQuestion', currentQuestion.question);
}

io.on('connection', (socket) => {
  socket.on('joinGame', (name) => {
    players.push({ id: socket.id, name, score: 0 });
    io.emit('updateScores', players);
    io.emit('gameMessage', `${name} ist beigetreten.`);
  });

  socket.on('playerReady', () => {
    readyCount++;
    if (readyCount >= 2) {
      readyCount = 0;
      sendNewQuestion();
    }
  });

  socket.on('submitAnswer', (answer) => {
    const player = players.find(p => p.id === socket.id);
    if (!player || !currentQuestion) return;
    if (answer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
      player.score += 1;
      io.emit('gameMessage', `${player.name} hat richtig geantwortet!`);
      sendNewQuestion();
    } else {
      socket.emit('gameMessage', 'Leider falsch!');
    }
    io.emit('updateScores', players);
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('updateScores', players);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server läuft auf Port 3000");
});
