const authService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await authService.login(email, senha);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
