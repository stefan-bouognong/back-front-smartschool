const app = require("./app");
const config = require("./config/env");
const { sequelize } = require("./database/models");

const startServer = async () => {
  try {
    // 🔥 Connexion DB
    // await sequelize.authenticate();
    console.log("📦 Connexion à la base OK");

    // 🔥 Création des tables automatiquement
    await sequelize.sync({});
    console.log("✅ Tables synchronisées");
    // await sequelize.sync({ alter: true });
    // console.log("✅ Tables synchronisées");

    // 🚀 Lancement serveur
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Erreur démarrage:", error);
  }
};

startServer();
