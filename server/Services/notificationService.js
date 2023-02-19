import Notifications from "../Models/Notifications.js";

class NotificationService {
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
