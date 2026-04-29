import cors from "cors"
import express from "express"
import readerRoutes from "./modules/readers/reader.routes.js"
import loanRoutes from "./modules/loans/loan.routes.js"
import {
  deleteBook,
  getBooks,
  patchBookStatus,
  postBook,
  putBook
} from "./modules/books/book.controller.js"
import {
  getLoans,
  postBorrow,
  postReturn
} from "./modules/circulation/circulation.controller.js"
import { borrowDaily, hotBooks } from "./modules/reports/report.controller.js"
import { getRoles, getUsers, postBackup } from "./modules/system/system.controller.js"
import categoryRoutes from "./modules/categories/category.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({ ok: true })
})

app.use("/api/readers", readerRoutes)
app.use("/api/loans", loanRoutes)
app.use("/api/categories", categoryRoutes)
app.get("/api/books", getBooks)
app.post("/api/books", postBook)
app.put("/api/books/:bookId", putBook)
app.delete("/api/books/:bookId", deleteBook)
app.patch("/api/books/:bookId/status", patchBookStatus)

app.get("/api/circulation/loans", getLoans)
app.post("/api/circulation/borrow", postBorrow)
app.post("/api/circulation/return", postReturn)

app.get("/api/reports/borrow-daily", borrowDaily)
app.get("/api/reports/hot-books", hotBooks)

app.get("/api/system/users", getUsers)
app.get("/api/system/roles", getRoles)
app.post("/api/system/backup", postBackup)

export default app
