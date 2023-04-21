import express from "express";
import { accessMiddleware } from "../Middleware/accessMiddleware.js";
import { conferenceController as controller } from "../Controller/conferenceController.js";

const router = express.Router();
router.post("/addConference", controller.addConference);
router.get("/getConference", controller.getConference);
router.delete("/removeConference",controller.removeConference)

export default router;
