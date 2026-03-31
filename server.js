const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ===== GAME CONFIG =====
const GAME_PIN = '1234';
const TIMER_DURATION = 30; // seconds per question

// ===== QUESTIONS =====
const questions = [
  {
    questionText: 'Waar staat GEO voor?',
    options: ['Google Engine Optimization', 'Global E-commerce Optimization', 'Generative Engine Optimization', 'General Evaluation Optimization'],
    correctIndex: 2,
  },
  {
    questionText: 'Wat is in de basis het grootste verschil tussen het doel van SEO en het doel van GEO?',
    options: ['SEO richt zich op posities in zoekmachines, GEO op vermeldingen in AI-antwoorden.', 'SEO is uitsluitend voor Google, GEO is uitsluitend voor Bing.', 'SEO richt zich op structuur, GEO uitsluitend op zoekwoorden.', 'SEO levert directe antwoorden, GEO levert een lijst met blauwe links.'],
    correctIndex: 0,
  },
  {
    questionText: 'Welke van de volgende KPI\'s hoort typisch bij GEO, in tegenstelling tot klassieke SEO?',
    options: ['Klikken naar de website', 'Citaties, mentions en zichtbaarheid', 'Impressies op een zoekwoord', 'Posities in de zoekresultaten'],
    correctIndex: 1,
  },
  {
    questionText: 'Wat is volgens het artikel het grootste misverstand rondom de opkomst van GEO?',
    options: ['Dat SEO door de komst van GEO volledig overbodig is geworden.', 'Dat AI-systemen elke website met veel links automatisch selecteren.', 'Dat je voor GEO uitsluitend korte teksten mag schrijven.', 'Dat GEO een compleet nieuw vakgebied is waarvoor je opnieuw moet beginnen.'],
    correctIndex: 3,
  },
  {
    questionText: 'Hoe zorg je er qua schrijfstijl voor dat je content goed werkt voor zówel SEO als GEO?',
    options: ['Door lange, ononderbroken alinea\'s te schrijven met veel vaktermen.', 'Door je content puur te optimaliseren op één specifiek zoekwoord.', 'Door antwoorden direct, expliciet en citeerbaar te formuleren.', 'Door structuur-elementen zoals lijstjes en tabellen te vermijden.'],
    correctIndex: 2,
  },
  {
    questionText: 'Hoeveel procent van de merkoriëntatie gebeurt er volgens recente cijfers al buiten de traditionele Google-zoekmachine om?',
    options: ['Maximaal 20%', 'Ongeveer 60%', 'Bijna 90%', 'Slechts 5%'],
    correctIndex: 1,
  },
  {
    questionText: 'Wat wordt de volgende grote evolutie in AI genoemd, waarbij de software autonoom het web afstruint en zélf een aankoop of boeking kan afronden?',
    options: ['Static AI', 'Passive AI', 'Offline AI', 'Agentic AI (AI-agenten)'],
    correctIndex: 3,
  },
  {
    questionText: 'Wat is veruit de meest voorkomende reden dat consumenten hun online winkelmandje verlaten?',
    options: ['Onverwacht hoge extra kosten (zoals verzendkosten) bij het afrekenen.', 'De website heeft geen donkere modus (dark mode).', 'Het ontbreken van een chatbot op de homepage.', 'De productafbeeldingen zijn te groot.'],
    correctIndex: 0,
  },
  {
    questionText: 'Je bezoekt een webshop voor schoenen, koopt niets, en ziet de dagen daarna overal op internet advertenties voor die specifieke schoenen. Hoe heet dit?',
    options: ['E-mail spoofing', 'Cold calling', 'Retargeting / Remarketing', 'Influencer marketing'],
    correctIndex: 2,
  },
  {
    questionText: 'Waarom hechten e-commerce managers zoveel waarde aan het verzamelen van \'Social Proof\'?',
    options: ['Het is een wettelijke verplichting vanuit de Europese Unie voor webshops.', 'Het verhoogt het vertrouwen bij nieuwe bezoekers, wat direct leidt tot een hogere conversieratio.', 'Het zorgt ervoor dat de webhosting goedkoper wordt.', 'Het verlaagt de verzendkosten bij pakketdiensten.'],
    correctIndex: 1,
  },
  {
    questionText: 'Welke betaalmethode is met ruime afstand het grootst en belangrijkst voor webshops in Nederland?',
    options: ['Creditcard (Mastercard/Visa)', 'PayPal', 'iDEAL', 'Klarna (Achteraf betalen)'],
    correctIndex: 2,
  },
  {
    questionText: 'Wat is over het algemeen het directe gevolg van een trage laadsnelheid (page speed) van een webshop?',
    options: ['Klanten kopen juist meer, omdat ze de tijd hebben om goed na te denken.', 'De webshop wordt automatisch door de server afgesloten.', 'Het heeft geen enkele invloed op het koopgedrag van de consument.', 'Het bouncepercentage stijgt en de conversie daalt aanzienlijk.'],
    correctIndex: 3,
  },
  {
    questionText: 'Een klant legt een smartphone in zijn winkelmandje en de webshop stelt direct voor om er een passend hoesje bij te kopen. Hoe heet deze techniek?',
    options: ['Upselling', 'Cross-selling', 'Downselling', 'Dropshipping'],
    correctIndex: 1,
  },
  {
    questionText: 'Wat is sinds 2024 de verrassende status van \'third-party cookies\' in de Google Chrome browser?',
    options: ['Google heeft de uitfasering geannuleerd; ze blijven voorlopig gewoon bestaan.', 'Ze zijn in 2024 definitief en volledig verboden in Europa.', 'Webshops moeten nu betalen aan Google om ze te mogen gebruiken.', 'Ze zijn vervangen door fysieke tracking-chips.'],
    correctIndex: 0,
  },
  {
    questionText: 'Omdat het volgen van consumenten steeds moeilijker wordt, focussen webshops op \'first-party data\'. Wat is dit?',
    options: ['Data die je anoniem inkoopt via grote databrokers.', 'Data die uitsluitend door Google en Meta wordt beheerd.', 'Data die een bedrijf direct en met toestemming van de eigen klanten verzamelt.', 'Data van concurrenten die je via speciale software kopieert.'],
    correctIndex: 2,
  },
  {
    questionText: 'Waarom is het \'scanbaar\' maken van je content zo belangrijk?',
    options: ['Mensen lezen online niet woord voor woord maar scannen; een goede structuur houdt ze op de pagina.', 'Het zorgt ervoor dat concurrenten de tekst niet meer zomaar kunnen kopiëren en plakken.', 'Google rekent af per gelezen alinea.', 'Scanbare teksten worden automatisch omgezet in video-advertenties.'],
    correctIndex: 0,
  },
  {
    questionText: 'Wat wordt er in e-commerce en content marketing bedoeld met UGC (User-Generated Content)?',
    options: ['Content die volledig door een AI-tool zoals ChatGPT is gegenereerd.', 'Content (zoals foto\'s, reviews of unboxing-video\'s) die door klanten zelf is gemaakt.', 'Verborgen tekst op een website die stiekem alleen voor zoekmachines is geschreven.', 'Gestandaardiseerde productteksten van de leverancier.'],
    correctIndex: 1,
  },
  {
    questionText: 'Wat is het fundamentele verschil tussen platformen als Shopify/Wix en een systeem als WordPress?',
    options: ['Shopify is gratis, voor WordPress moet je maandelijks betalen.', 'WordPress is uitsluitend voor blogs, met Wix verkoop je fysieke producten.', 'Shopify/Wix zijn SaaS (alles-in-één); WordPress is Open Source (eigen beheer).', 'Er is geen enkel verschil; het zijn andere merknamen voor exact dezelfde software.'],
    correctIndex: 2,
  },
  {
    questionText: 'Je hoort steeds vaker de term \'Headless Commerce\'. Wat wordt hiermee bedoeld in de wereld van websites?',
    options: ['Een webshop die volledig gerund wordt door AI-bots zonder mensen.', 'Een website waarop kledingmodellen zonder hoofd worden getoond.', 'Een versimpelde versie die uitsluitend via voice-assistenten (Alexa) werkt.', 'De \'voorkant\' is technisch losgekoppeld van de \'achterkant\', voor een razendsnelle webshop.'],
    correctIndex: 3,
  },
  {
    questionText: 'Welk e-commerce platform is onderdeel van Adobe en staat bekend om zijn enorme kracht maar ook technische complexiteit?',
    options: ['Magento (Adobe Commerce)', 'Wix', 'Shopify Starter', 'WordPress met WooCommerce'],
    correctIndex: 0,
  },
];

// ===== GAME STATE =====
const players = {}; // { socketId: { username, score, currentAnswer } }
let currentQuestionIndex = -1; // -1 = game not started
let timerInterval = null;
let timeRemaining = 0;
let questionStartTime = 0;
let answersReceived = 0;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ===== HELPER FUNCTIONS =====
function getPlayerCount() {
  return Object.keys(players).length;
}

function startTimer() {
  timeRemaining = TIMER_DURATION;
  questionStartTime = Date.now();
  answersReceived = 0;

  // Reset all player answers for new question
  Object.values(players).forEach((p) => {
    p.currentAnswer = null;
  });

  // Send initial timer
  io.to('game').emit('timerUpdate', { time: timeRemaining });

  // Countdown every second
  timerInterval = setInterval(() => {
    timeRemaining--;
    io.to('game').emit('timerUpdate', { time: timeRemaining });

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      handleTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function handleTimeUp() {
  stopTimer();

  const q = questions[currentQuestionIndex];

  // Calculate top 5 leaderboard
  const top5 = Object.values(players)
    .map((p) => ({ username: p.username, score: p.score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  // Send leaderboard + correct answer to ALL clients
  io.to('game').emit('showLeaderboard', {
    correctIndex: q.correctIndex,
    correctAnswer: q.options[q.correctIndex],
    top5,
    isLastQuestion,
    questionIndex: currentQuestionIndex,
    totalQuestions: questions.length,
  });

  console.log(`⏰ Time's up for question ${currentQuestionIndex + 1}`);
  console.log(`🏆 Top: ${top5.map((p, i) => `${i + 1}. ${p.username} (${p.score})`).join(', ')}`);

  if (isLastQuestion) {
    console.log(`\n🎉 GAME OVER! Winner: ${top5[0]?.username || 'nobody'} with ${top5[0]?.score || 0} points!\n`);
  }
}

function broadcastCurrentQuestion() {
  const q = questions[currentQuestionIndex];

  // CRITICAL: Do NOT send correctIndex to the frontend
  io.to('game').emit('newQuestion', {
    questionIndex: currentQuestionIndex,
    totalQuestions: questions.length,
    questionText: q.questionText,
    options: q.options,
  });

  console.log(`❓ Question ${currentQuestionIndex + 1}/${questions.length}: ${q.questionText}`);

  // Start the countdown
  startTimer();
}

// ===== SOCKET.IO =====
io.on('connection', (socket) => {
  console.log(`[+] New connection: ${socket.id}`);

  // --- Player joins with PIN + username ---
  socket.on('joinRoom', ({ pin, username }) => {
    if (!pin || !username) {
      socket.emit('joinError', { message: 'Vul zowel PIN als naam in.' });
      return;
    }

    if (pin !== GAME_PIN) {
      socket.emit('joinError', { message: 'Ongeldige PIN. Probeer opnieuw.' });
      return;
    }

    // Profanity Filter
    const PROHIBITED_WORDS = [
      'kanker', 'tyfus', 'tering', 'kut', 'hoer', 'slet', 'mongool', 'klootzak', 'bitch', 'fuck', 'shit', 'asshole', 'dick', 'cunt', 'pussy', 'whore', 'slut', 'fag', 'nigger', 'nigga', 'cancer', 'hitler', 'nazi', 'suck',
      'poep', 'sex', 'seks', 'porno', 'pik', 'lul', 'sneu', 'pedo'
    ];
    const lowerName = username.trim().toLowerCase();
    const isProfane = PROHIBITED_WORDS.some(word => lowerName.includes(word));
    if (isProfane) {
      socket.emit('joinError', { message: 'Deze naam bevat ongepast taalgebruik. Bedenk een leukere naam.' });
      return;
    }

    // Check for duplicate username (skip if same socket re-joining)
    const nameTaken = Object.entries(players).some(
      ([id, p]) => id !== socket.id && p.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (nameTaken) {
      socket.emit('joinError', { message: 'Deze naam is al bezet. Kies een andere.' });
      return;
    }

    // Join the game room
    socket.join('game');
    players[socket.id] = {
      username: username.trim(),
      score: 0,
      currentAnswer: null,
    };

    console.log(`🎮 ${username} joined the game (${getPlayerCount()} players)`);

    // Confirm to the player
    socket.emit('joinSuccess', { username: username.trim() });

    // Notify everyone about the updated player count
    io.to('game').emit('playerCount', { count: getPlayerCount() });

    // Also emit to admin (if connected)
    io.emit('playerList', {
      players: Object.values(players).map((p) => p.username),
      count: getPlayerCount(),
    });

    // If game already started, send current state to the late joiner
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      const q = questions[currentQuestionIndex];
      socket.emit('newQuestion', {
        questionIndex: currentQuestionIndex,
        totalQuestions: questions.length,
        questionText: q.questionText,
        options: q.options,
      });
      socket.emit('timerUpdate', { time: timeRemaining });
    }
  });

  // --- Admin joins ---
  socket.on('adminJoin', () => {
    socket.join('game');
    console.log('👑 Admin connected');
    socket.emit('adminConnected');

    // Send current player list
    socket.emit('playerList', {
      players: Object.values(players).map((p) => p.username),
      count: getPlayerCount(),
    });
  });

  // --- Admin starts the game / sends first question ---
  socket.on('adminStartQuestion', () => {
    if (currentQuestionIndex < 0) {
      currentQuestionIndex = 0;
    }

    if (currentQuestionIndex >= questions.length) {
      socket.emit('gameOver');
      return;
    }

    console.log('🚀 Admin started the game!');
    broadcastCurrentQuestion();
  });

  // --- Admin skips current question ---
  socket.on('adminSkipQuestion', () => {
    if (timerInterval) {
      console.log('⏭️ Admin skipped the question');
      timeRemaining = 0;
      io.to('game').emit('timerUpdate', { time: timeRemaining });
      handleTimeUp();
    }
  });

  // --- Admin resets the session ---
  socket.on('adminResetSession', () => {
    console.log('🔄 Admin triggered a reset. Wiping game data but keeping admin alive.');
    clearInterval(timerInterval);
    
    // Kick all players to the home screen context, but softly reset admins
    io.sockets.sockets.forEach((s) => {
      if (players[s.id]) {
        s.emit('forceReload'); // player reload
      } else {
        s.emit('adminSoftReset'); // admin soft UI reset
      }
    });

    players = {};
    currentQuestionIndex = -1;
    timeRemaining = 30;
  });

  // --- Admin forces game to end early ---
  socket.on('adminForceEndGame', () => {
    console.log('⏭️ Admin forced game to end early -> skipping to final leaderboard');
    clearInterval(timerInterval);
    currentQuestionIndex = questions.length; // Artificially mark as done
    
    // Calculate final scores
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    const top7 = leaderboard.slice(0, 7);

    io.to('game').emit('showLeaderboard', {
      correctAnswer: 'Afgesloten door Quizmaster',
      top5: top7, // rename logic maintained on client
      isLastQuestion: true,
      questionIndex: currentQuestionIndex,
      totalQuestions: questions.length,
    });
  });

  // --- Admin sends next question ---
  socket.on('adminNextQuestion', () => {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
      io.to('game').emit('gameOver');
      console.log('🏁 Game over! All questions done.');
      return;
    }

    broadcastCurrentQuestion();
  });

  // --- Player submits an answer ---
  socket.on('submitAnswer', ({ answerIndex }) => {
    const player = players[socket.id];
    if (!player) return;

    // Already answered this question
    if (player.currentAnswer !== null) return;

    // Game not in progress
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) return;

    const q = questions[currentQuestionIndex];
    const isCorrect = answerIndex === q.correctIndex;

    // Calculate score based on speed (max 1000, linear decrease over TIMER_DURATION)
    let pointsEarned = 0;
    if (isCorrect) {
      const elapsed = (Date.now() - questionStartTime) / 1000; // seconds elapsed
      const fraction = Math.max(0, 1 - elapsed / TIMER_DURATION);
      pointsEarned = Math.round(fraction * 1000);
    }

    player.currentAnswer = answerIndex;
    player.score += pointsEarned;
    answersReceived++;

    console.log(
      `📝 ${player.username} answered ${isCorrect ? '✅ correctly' : '❌ wrong'} (+${pointsEarned} pts, total: ${player.score})`
    );

    // Confirm to the player that their answer was received
    socket.emit('answerReceived', { pointsEarned });

    // Notify admin of answer count
    io.to('game').emit('playerAnswered', {
      count: answersReceived,
      total: getPlayerCount(),
    });

    // If ALL players have answered, trigger timeUp early
    if (answersReceived >= getPlayerCount()) {
      console.log('⚡ All players answered — ending round early');
      handleTimeUp();
    }
  });

  // --- Disconnect ---
  socket.on('disconnect', () => {
    if (players[socket.id]) {
      const wasAnswered = players[socket.id].currentAnswer !== null;
      console.log(`[-] ${players[socket.id].username} disconnected`);
      delete players[socket.id];

      // Update counts
      io.to('game').emit('playerCount', { count: getPlayerCount() });
      io.emit('playerList', {
        players: Object.values(players).map((p) => p.username),
        count: getPlayerCount(),
      });

      // Check if all remaining players have now answered
      if (
        !wasAnswered &&
        timerInterval &&
        getPlayerCount() > 0 &&
        answersReceived >= getPlayerCount()
      ) {
        console.log('⚡ All remaining players answered — ending round early');
        handleTimeUp();
      }
    } else {
      console.log(`[-] Disconnected: ${socket.id}`);
    }
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n🎮 Rody Quiz server running at http://localhost:${PORT}`);
  console.log(`📌 Game PIN: ${GAME_PIN}`);
  console.log(`👑 Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`📝 ${questions.length} questions loaded\n`);
});
