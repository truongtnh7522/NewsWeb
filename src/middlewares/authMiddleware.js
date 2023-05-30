const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  let token = req.headers['authorization'] || (req.cookies && req.cookies.token) || '';

  if (!token) {
    return res.status(401).send({ error: 'Unauthorized', message: 'Missing token' });
  }

  jwt.verify(token, 'asadsfsdfxcv232142335', (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Unauthorized', message: 'Invalid token' });
    }

    req.user = decoded.user;
    req.token = token;
    next();
  });
};
