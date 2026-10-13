const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token manquant ou format invalide",
      });
    }

    const token = authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.userId;

    req.auth = {
      userId: userId,
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Requête non authentifiée !",
    });
  }
};
