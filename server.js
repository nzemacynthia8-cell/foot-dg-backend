const express = require('express');
const cors = require('cors');

const app = express();
// ⚠️ Render impose process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Exemple utilisateur avec solde et équipe ---
let utilisateur = {
  nom: "Cynthia",
  diamonds: 250,   // 💎
  coins: 7500,     // 🪙
  equipe: []
};

// --- Exemple boutique ---
const boutique = [
  { id: 1, nom: "Joueur faible", prixCoins: 50, prixDiamonds: 0 },
  { id: 2, nom: "Joueur moyen", prixCoins: 120, prixDiamonds: 2 },
  { id: 3, nom: "Joueur fort", prixCoins: 210, prixDiamonds: 5 }
];

// --- Championnats avec équipes ---
const championnats = {
  "Ligue des Champions": [
    { nom: "Real Madrid", logo: "real.png" },
    { nom: "FC Barcelona", logo: "barca.png" },
    { nom: "Liverpool", logo: "liverpool.png" },
    { nom: "PSG", logo: "psg.png" }
  ],
  "Premier League": [
    { nom: "Arsenal", logo: "arsenal.png" },
    { nom: "Chelsea", logo: "chelsea.png" },
    { nom: "Manchester City", logo: "mancity.png" },
    { nom: "Tottenham", logo: "tottenham.png" }
  ]
};

// --- Routes principales ---
app.get('/', (req, res) => {
  res.send("✅ Backend Foot-DG en ligne !");
});

app.get('/jouer', (req, res) => {
  res.json({ message: "⚽ Mode JEU : Lancez un match en direct !" });
});

app.get('/equipes', (req, res) => {
  res.json({ equipes: ["Real Madrid", "Barça", "Liverpool", "PSG", "Monaco"] });
});

app.get('/trophees', (req, res) => {
  res.json({ trophees: ["Coupe d'Europe", "Champion League"] });
});

app.get('/championnats', (req, res) => {
  res.json(championnats);
});

app.get('/boutique', (req, res) => {
  res.json({ joueurs: boutique });
});

// --- Monnaies ---
app.get('/currencies', (req, res) => {
  res.json({ diamonds: utilisateur.diamonds, coins: utilisateur.coins });
});

// --- Gagner un match avec simulation ---
app.post('/match', (req, res) => {
  const toutesEquipes = ["Real Madrid", "Barça", "Liverpool", "PSG", "Monaco", "Chelsea", "Arsenal"];
  const equipe1 = toutesEquipes[Math.floor(Math.random() * toutesEquipes.length)];
  const equipe2 = toutesEquipes[Math.floor(Math.random() * toutesEquipes.length)];

  const score1 = Math.floor(Math.random() * 5);
  const score2 = Math.floor(Math.random() * 5);

  let message;
  if (score1 > score2) {
    message = `✅ Victoire de ${equipe1} contre ${equipe2} (${score1} - ${score2}) !`;
    utilisateur.coins += 500;
    utilisateur.diamonds += 10;
  } else if (score2 > score1) {
    message = `❌ Défaite de ${equipe1} contre ${equipe2} (${score1} - ${score2})...`;
  } else {
    message = `🤝 Match nul entre ${equipe1} et ${equipe2} (${score1} - ${score2}) !`;
    utilisateur.coins += 200;
  }

  res.json({
    message,
    diamonds: utilisateur.diamonds,
    coins: utilisateur.coins
  });
});

// --- Acheter un joueur ---
app.post('/acheter', (req, res) => {
  const joueurId = req.body.id;
  const joueur = boutique.find(j => j.id === joueurId);

  if (!joueur) {
    return res.status(404).json({ message: "❌ Joueur introuvable" });
  }

  if (utilisateur.coins >= joueur.prixCoins && utilisateur.diamonds >= joueur.prixDiamonds) {
    utilisateur.coins -= joueur.prixCoins;
    utilisateur.diamonds -= joueur.prixDiamonds;
    utilisateur.equipe.push(joueur);
    res.json({
      message: `✅ Tu as acheté ${joueur.nom} !`,
      diamonds: utilisateur.diamonds,
      coins: utilisateur.coins,
      equipe: utilisateur.equipe
    });
  } else {
    res.status(400).json({ message: "❌ Solde insuffisant pour acheter ce joueur." });
  }
});

// --- Lancement du serveur ---
app.listen(PORT, () => {
  console.log(`🚀 Serveur Football Game lancé sur http://localhost:${PORT}`);
});
