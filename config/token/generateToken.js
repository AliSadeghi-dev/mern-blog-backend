const JWT = require("jsonwebtoken");

const generateToken = (id) => {
  return JWT.sign(
    {
      id,
    },
    process.env.JWT_KEY,
    { expiresIn: "20d" }
  );
};

module.exports = generateToken;
