import express from "express";
import { GroupControllerInstance as controller } from "../Controller/groupController.js";

const router = express.Router();
router.get("/", controller.getGlobalGroups);
router.post("/addGroup", controller.createGroup);
router.post("/addUser", controller.addUser);
router.delete("/deleteGroup", controller.deleteGroups);
export default router;
