import { backupData, listRoles, listUsers } from "./system.service.js"

export function getUsers(req, res) {
  res.json({ data: listUsers() })
}

export function getRoles(req, res) {
  res.json({ data: listRoles() })
}

export function postBackup(req, res) {
  res.json({ data: backupData() })
}
