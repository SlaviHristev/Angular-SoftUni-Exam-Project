import Chat from "../Models/Chat.js";
import Message from "../Models/Message.js";


export const sendMessage = async(req,res) =>{
    const {chatId,senderId, text} = req.body;

    try {
        const message = new Message({chatId, senderId, text});
        await message.save();
        await Chat.findByIdAndUpdate(chatId, {$push:{messages:message._id}});
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({message: 'Failed to send message', error})
    }
}