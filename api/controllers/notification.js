import Notification from '../Models/Notification.js';


export const createNotification = async (req, res) => {
  const { userId, type, message } = req.body;
  console.log(req.body);
  try {
      const notification = new Notification({
          userId,
          type,
          message,
      });

      await notification.save();
      return res.status(201).json(notification);
  } catch (error) {
      console.error('Failed to create notification:', error);
      return res.status(400).json({ error: 'Failed to create notification' });
  }
};

export const getNotifications = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const notifications = await Notification.find({ userId: id });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Failed to fetch notifications:', error); 
        res.status(500).json({ error: 'Failed to fetch notifications' }); 
    }
};


export const markAsRead = async (req, res) => {
    const id = req.params.id; 
    console.log(id);
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            { read: true },
            { new: true } 
        );

        if (!updatedNotification) {
            return res.status(404).json({ error: 'Notification not found' }); 
        }

        res.status(200).json(updatedNotification);
        console.log(updatedNotification);
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' }); 
    }
};
