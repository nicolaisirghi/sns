import Notifications from "../Models/Notifications.js";

class NotificationController {
    async getNotifications(req, res, next) {
        try {
            const currentUser = req.user;
            const notifications = await Notifications.find({user: currentUser});
            res.status(200).json(notifications);
        } catch (e) {
            next(e)
        }
    }
}

export default new NotificationController();