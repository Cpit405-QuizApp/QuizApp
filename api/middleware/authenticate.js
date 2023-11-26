const jwt = require('jsonwebtoken');
const jwtSecret = "JHjksG678gJKslj7gslJISP8hulSLIjl8j9";

const authenticate = (req, res, next) => {
  const token = req.cookies.token || '';

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(401).send('Invalid Token');
      }
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};

module.exports = authenticate;
