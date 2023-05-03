import express from "express";
import { accessMiddleware } from "../Middleware/accessMiddleware.js";
import { conferenceController as controller } from "../Controller/conferenceController.js";
import { VideoMeetingControllerInstance as meetingController } from "../Controller/videoMeetingController.js";
const router = express.Router();
router.post("/addConference", controller.addConference);
router.get("/getConference", controller.getConference);
router.delete("/removeConference", controller.removeConference);
router.post("/online/createRoom", meetingController.createRoom);
router.get("/online/verifyRoom", meetingController.validateRoom);
router.get("/online/meteredDomain", meetingController.getMeteredDomain);

export default router;
