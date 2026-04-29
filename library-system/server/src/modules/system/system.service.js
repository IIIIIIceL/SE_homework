import db from "../shared/store.js"

export function listUsers() {
  return db.users
}

export function listRoles() {
  return db.roles
}

export function backupData() {
  const snapshot = JSON.stringify(db)
  db.auditLogs.push({
    id: `A${db.auditLogs.length + 1}`,
    action: "backup",
    createdAt: new Date().toISOString()
  })
  return { size: snapshot.length, createdAt: new Date().toISOString() }
}
