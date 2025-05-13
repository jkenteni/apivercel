import authService from '../services/authService.js';

export default {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const result = await authService.login(email, senha);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
};
