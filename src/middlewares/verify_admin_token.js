const jwt = require("jsonwebtoken");


function verifyAdminToken (req, res, next) {
    const authHeader = req.headers.authorization;
     if (!authHeader) {
       return res.status(401).json({ message: "Token não fornecido." });
     }
     const token = authHeader.split(" ")[1];
     try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_ADMIN);
    req.admin = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

module.exports = verifyAdminToken;

