import express from "express";
import { GroupControllerInstance as GroupController } from "../Controller/groupController.js";

export const router = express.Router()
router.get('/', GroupController.getGroups)
router.post("/addGroup", GroupController.createGroups)
router.post("/addUser",GroupController.addUser)
router.delete("/deleteGroup",GroupController.deleteGroups)