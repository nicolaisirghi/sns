import Notifications from "../Models/Notifications.js";
import {
  followUser,
  publicatePost,
  requestFriend,
} from "../Utils/Notifications/GenerateNotifications.js";
import { sendNotification } from "../Connection/sendData.js";

class NotificationService {
  async verifyNotification(req) {
    const currentUser = req.user;
    const { notificationsID } = req.body;
    if (!notificationsID || !notificationsID.length)
      throw new Error("At least one notification should be specified !");
    const [currentUserNotifications] = await Promise.all(
      notificationsID.map((notification) =>
        Notifications.find({
          _id: notification,
          user: currentUser,
        })
      )
    );
    if (!currentUserNotifications.length)
      throw new Error("You haven't notifications !");

    return currentUserNotifications;
  }

  getNotificationMessage(notification) {
    switch (notification.type) {
      case "request": {
        return {
          message: `${notification.currentUser.name} has sent you a friend request ! `,
          notificationInfo: requestFriend(notification.currentUser),
        };
      }
      case "publish": {
        return {
          message: `${notification.currentUser.name} has published a new publication`,
          notificationInfo: publicatePost(notification.currentUser),
        };
      }
      case "following":
        return {
          message: `${notification.currentUser.name} has started following you`,
          notificationInfo: followUser(notification.currentUser),
        };
      default: {
        return "Some message ... ";
      }
    }
  }

  async createNotification(notification) {
    const { notificationInfo, message } =
      this.getNotificationMessage(notification);
    console.log("Notification : ", notification);
    console.log("Notification Info", notificationInfo);

    const notificationData = await Promise.all(
      notification?.toUsers?.map((user) => {
        return new Notifications({
          message,
          type: notificationInfo.type,
          date: new Date(),
          user,
        }).save();
      })
    );
    notification?.toUsers?.map((user) => {
      const notificationsForUser = notificationData.filter(
        (notification) => notification.user.toString() === user.toString()
      );
      return sendNotification({
        to: user,
        event: notification.type,
        data: notificationsForUser,
      });
    });

    return notificationData;
  }
}

export const NotificationServiceInstance = new NotificationService();
