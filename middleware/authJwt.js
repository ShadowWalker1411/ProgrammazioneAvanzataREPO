const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");


function generateToken() {
  const payload = {
    id: 123,
    userType: "admin"
  };

  const token = jwt.sign(payload, config.secret, {
    expiresIn: '7d'
  });

  return token;
}

function validateUser(req, res, next) {
  // Verifica l'autenticazione del token
  const token = req.headers.authorization; 
  if (token) {
    try {
      const decoded = jwt.verify(token, config.secret);
      if (decoded.userType === 'user') {
        next();
      } else {
        res.status(403).send({ message: 'Accesso negato. Non sei autorizzato a eseguire questa azione.' });
      }
    } catch (error) {
      res.status(401).send({ message: 'Token non valido.' });
    }
  } else {
    res.status(401).send({ message: 'Token non fornito.' });
  }
}

function validateAdmin(req, res, next) {
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ message: 'Non autorizzato' });
  }

  next();
}

module.exports = {
  generateToken,
  validateUser,
  validateAdmin
};

module.exports = authJwt;
