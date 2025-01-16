import Message from "../models/message.model.js";

//this function is used to send a message to a user
export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    //TODO: SEND NOTIFICATION TO RECEIVER IN REAL TIME => SOCKET.IO
    res
      .status(201)
      .json({ success: true, message: "Message sent", data: newMessage });
  } catch (error) {
    console.error("Error in sending message: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//this function is used to get the conversation between the logged in user and another user
export const getConversation = async (req, res) => {
  const { userId } = req.params;
  try {
    const message = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId }, //here sender send the message to the receiver
        { sender: userId, receiver: req.user._id }, //here receiver send the message to the sender
      ],
    }).sort({ createdAt: 1 }); //sort the messages in ascending order of time
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error in getting conversation: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
