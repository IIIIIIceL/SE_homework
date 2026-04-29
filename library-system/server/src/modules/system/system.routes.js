import { Router } from "express"
import { getRoles, getUsers, postBackup } from "./system.controller.js"

const router = Router()

router.get("/users", getUsers)
router.get("/roles", getRoles)
router.post("/backup", postBackup)

export default router
