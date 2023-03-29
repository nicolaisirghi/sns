import Notifications from "../Models/Notifications.js";
import { types } from "../Utils/Types/Notifications.js";
import { NotificationServiceInstance as NotificationService } from "../Services/notificationService.js";
import Users from "../Models/Users.js";
import { getData } from "../Utils/Paginator/paginator.js";

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const currentUser = req.user;
      const type = req.query.type?.toLowerCase();
      const page = req.query.page || 1;
      const itemsCount = req.query.itemsCount || 5;
      let notifications = {};
      if (!type) {
        notifications = await Notifications.find({ user: currentUser });
      } else if (types.includes(type)) {
        notifications = await Notifications.find({ user: currentUser, type });
      } else {
        throw new Error("Invalid type for notifications!");
      }
      const userInfo = await Users.findById(currentUser, {
        _id: 0,
        username: 1,
        photoURL: 1,
        name: 1,
      });
      notifications = notifications.map((notification) =>
        Object.assign(notification, { user: userInfo })
      );
      const notificationsData = getData(notifications, page, itemsCount);
      res.status(200).json({
        status: "SUCCESS",
        notificationsData,
        itemsCount: notifications.length,
      });
    } catch (e) {
      next(e);
    }
  }

  async readNotifications(req, res, next) {
    try {
      const notifications = await NotificationService.verifyNotification(req);
      const result = await Promise.all(
        notifications.map((notification) => {
          notification.isReaded = true;
          return notification.save();
        })
      );

      res.status(200).json({
        message: "SUCCESS",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteNotifications(req, res, next) {
    try {
      await NotificationService.verifyNotification(req);
      const { notificationsID } = req.body;

      await Promise.all(
        notificationsID.map((notification) =>
          Notifications.remove({
            _id: notification,
            user: req.user,
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
