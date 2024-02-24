const jwt = require('jsonwebtoken');


function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
    };
    const secret = process.env.JWT_SECRET || "shh"; // Using fallback secret "shh"
    const options = {
      expiresIn: '1d',
    };

    return jwt.sign(payload, secret, options);
  }


  module.exports = {
    generateToken, // Export the generateToken function
  };
