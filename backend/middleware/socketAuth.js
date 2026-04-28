const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
  try {
    const { token, invoiceId } = socket.handshake.auth;

    if (!invoiceId) {
      return next(new Error("invoiceId required"));
    }

    socket.invoiceId = invoiceId;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      socket.role = "businessOwner";
    } else {
      socket.user = null;
      socket.role = "customer";
    }

    next();
  } catch (err) {
    return next(new Error("Authentication failed"));
  }
};