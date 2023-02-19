import Notifications from "../Models/Notifications.js";
import { types } from "../Utils/Types/Notifications.js";

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const currentUser = req.user;
      const type = req.query.type?.toLowerCase();
      let notifications = {};
      if (!type) {
        notifications = await Notifications.find({ user: currentUser });
      } else if (types.includes(type)) {
        notifications = await Notifications.find({ user: currentUser, type });
      } else {
        throw new Error("Invalid type for notifications!");
      }
      res.status(200).json(notifications);
    } catch (e) {
      next(e);
    }
  }

  async deleteNotifications(req, res, next) {
    try {
      const currentUser = req.user;
      const { notificationsID } = req.body;
      const currentUserNotifications = await Notifications.find({
        user: currentUser,
      });
      if (!currentUserNotifications.length)
        throw new Error("You haven't notifications !");
      const currentUserNotificationsID = currentUserNotifications.map(
        (notification) => notification.id
      );
      if (!notificationsID || !notificationsID.length)
        throw new Error("At least one notification should be specified!");
      const isAllCurrentUserNotifications = notificationsID.every(
        (notification) => currentUserNotificationsID.includes(notification)
      );
      if (!isAllCurrentUserNotifications)
        throw new Error("You can't remove other users notifications!");
      await Promise.all(
        notificationsID.map((notification) =>
          Notifications.remove({
            _id: notification,
            user: currentUser,
          })
        )
      );
      res.status(200).json({
        message: "SUCCESS",
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new NotificationController();
