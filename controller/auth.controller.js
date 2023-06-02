const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
// vedere se tornare ad usarlo o no
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");



exports.signup = (req, res) => {
  // Salvataggio dell'utente nel database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
  .then(() => {
    res.send({ message: "Utente registrato!" });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};
//da rivedere con MAX
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Utente non trovato." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Password errata!"
        });
      }

      // Generazione del token JWT appena faccio la login
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 604.800 // 7 giorni
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        // Invio delle info e del token di accesso
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.generateToken = (req, res) =>{
  const payload = {
    id: 123,
    userType: "Admin"
  };

  const token = jwt.sign(payload, config.secret, {
    expiresIn: '7d'
  });

  return token;
}

