const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    const room = socket.invoiceId;

    // join invoice room
    socket.join(room);

    socket.emit("role", socket.role);

    // SEND MESSAGE
    socket.on("send_message", async (data) => {
      try {
        if (!data.text || !data.text.trim()) return;

        const message = await Message.create({
          invoiceId: room,
          senderType: socket.role,
          senderId: socket.user?._id || null,
          text: data.text,
        });

        // emit to everyone in that invoice room
        io.to(room).emit("receive_message", message);
      } catch (err) {
        console.error(err);
      }
    });
  });
};
