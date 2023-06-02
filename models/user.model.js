module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    credits: {
      type: Sequelize.INTEGER,
      defaultValue: 5000,
      allowNull: false
    }
  });

  return User;
};
//non servono ulteriori tabelle, in quanto con jwt vado a passare a max nel payload idutente e usertype che ci permetterà poi 
//di definire i vari validate dove un utente semplice e un admin possono accedere con i vari errori