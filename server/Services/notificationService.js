import Notifications from "../Models/Notifications.js";

class NotificationService {
  async verifyNotification(req)
  {
    const currentUser = req.user;
    const { notificationsID } = req.body;
    if(!notificationsID || !notificationsID.length)
      throw new Error("At least one notification should be specified !")
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
        return `${notification.name} has sent you a friend request ! `;
      }
      default: {
        return "Some message ... ";
      }
    }
  }

  async createNotification({ currentUser, requestedFriend }) {
    const notificationInfo = this.requestFriend(currentUser);
    const message = this.getNotificationMessage(notificationInfo);
    const notification = await new Notifications({
      message,
      type: notificationInfo.type,
      date: new Date(),
      user: requestedFriend,
    }).save();
    return { notification, notificationInfo };
  }

  requestFriend(fromUser) {
    return {
      name: fromUser.name,
      fromUserID: fromUser.id,
      type: "request",
    };
  }
}
export const NotificationServiceInstance = new NotificationService();
