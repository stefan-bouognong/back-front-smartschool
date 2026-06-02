const service = require('./auth.service');

exports.register = async (req, res) => {
  try {
    const user = await service.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await service.login(email, password);
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  try {
    // côté API on ne fait rien (JWT stateless)
    res.json({
      message: "Déconnexion réussie (supprime le token côté client)"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};