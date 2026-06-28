const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

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
app.get('/jouer', (req, res) => {
  res.json({ message: "⚽ Mode JEU : Lancez un match en direct !" });
});

// ⚠️ Correction : route /equipes (pas /club)
app.get('/equipes', (req, res) => {
  res.json({ equipes: ["Real Madrid", "Barça", "Liverpool", "PSG", "Monaco"] });
});

// TROPHÉES
app.get('/trophees', (req, res) => {
  res.json({ trophees: ["Coupe d'Europe", "Champion League"] });
});

// COMPÉTITIONS
app.get('/championnats', (req, res) => {
  res.json(championnats);
});

// BOUTIQUE
app.get('/boutique', (req, res) => {
  res.json({ joueurs: boutique });
});

// --- Monnaies ---
app.get('/currencies', (req, res) => {
  res.json({ diamonds: utilisateur.diamonds, coins: utilisateur.coins });
});

// --- Gagner un match ---
app.post('/match', (req, res) => {
  utilisateur.coins += 500;
  utilisateur.diamonds += 10;
  res.json({ message: "✅ Match gagné !", diamonds: utilisateur.diamonds, coins: utilisateur.coins });
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
