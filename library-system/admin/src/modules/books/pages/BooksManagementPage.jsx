import { useEffect, useState } from "react"
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook
} from "../api/books.api"
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory
} from "../api/categories.api"

const initialBookForm = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  publishDate: "",
  price: "",
  categoryId: "",
  shelf: ""
}

export default function BooksManagementPage() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState("all")
  const [bookForm, setBookForm] = useState(initialBookForm)
  const [editingBookId, setEditingBookId] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: "", parentId: "", shelfPrefix: "" })
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [message, setMessage] = useState("")

  const loadBooks = async () => {
    const result = await fetchBooks({ keyword, status })
    setBooks(result.data || [])
  }

  const loadCategories = async () => {
    const result = await fetchCategories()
    setCategories(result.data || [])
  }

  useEffect(() => {
    let cancelled = false
    fetchBooks({ keyword, status })
      .then((result) => {
        if (!cancelled) {
          setBooks(result.data || [])
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage(error.message)
        }
      })
    return () => {
      cancelled = true
    }
  }, [keyword, status])

  useEffect(() => {
    let cancelled = false
    fetchCategories()
      .then((result) => {
        if (!cancelled) {
          setCategories(result.data || [])
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage(error.message)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const submitBook = async () => {
    try {
      const payload = { ...bookForm, price: Number(bookForm.price || 0) }
      if (editingBookId) {
        await updateBook(editingBookId, payload)
        setMessage("图书信息已更新")
      } else {
        await createBook(payload)
        setMessage("图书新增成功")
      }
      setBookForm(initialBookForm)
      setEditingBookId(null)
      await loadBooks()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const startEditBook = (book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher || "",
      publishDate: book.publishDate || "",
      price: String(book.price || ""),
      categoryId: book.categoryId || "",
      shelf: book.shelf || ""
    })
    setEditingBookId(book.bookId)
  }

  const submitCategory = async () => {
    try {
      const payload = {
        name: categoryForm.name,
        parentId: categoryForm.parentId || null,
        shelfPrefix: categoryForm.shelfPrefix
      }
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, payload)
        setMessage("分类已更新")
      } else {
        await createCategory(payload)
        setMessage("分类新增成功")
      }
      setCategoryForm({ name: "", parentId: "", shelfPrefix: "" })
      setEditingCategoryId(null)
      await loadCategories()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const startEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      parentId: category.parentId || "",
      shelfPrefix: category.shelfPrefix || ""
    })
    setEditingCategoryId(category.categoryId)
  }

  return (
    <div>
      <h2>图书与分类管理</h2>
      <p className="desc">A 任务：图书信息管理 + 图书分类管理（前后端联动）。</p>
      {message && <p className="msg">{message}</p>}

      <section className="card">
        <h3>{editingBookId ? `编辑图书 ${editingBookId}` : "新增图书"}</h3>
        <div className="grid">
          <input placeholder="书名" value={bookForm.title} onChange={(e) => setBookForm((p) => ({ ...p, title: e.target.value }))} />
          <input placeholder="作者" value={bookForm.author} onChange={(e) => setBookForm((p) => ({ ...p, author: e.target.value }))} />
          <input placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm((p) => ({ ...p, isbn: e.target.value }))} />
          <input placeholder="出版社" value={bookForm.publisher} onChange={(e) => setBookForm((p) => ({ ...p, publisher: e.target.value }))} />
          <input type="date" value={bookForm.publishDate} onChange={(e) => setBookForm((p) => ({ ...p, publishDate: e.target.value }))} />
          <input placeholder="价格" value={bookForm.price} onChange={(e) => setBookForm((p) => ({ ...p, price: e.target.value }))} />
          <select value={bookForm.categoryId} onChange={(e) => setBookForm((p) => ({ ...p, categoryId: e.target.value }))}>
            <option value="">选择分类</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
          <input placeholder="书架位置" value={bookForm.shelf} onChange={(e) => setBookForm((p) => ({ ...p, shelf: e.target.value }))} />
        </div>
        <div className="row">
          <button type="button" onClick={submitBook}>{editingBookId ? "保存图书" : "新增图书"}</button>
          <button type="button" className="ghost" onClick={() => { setBookForm(initialBookForm); setEditingBookId(null) }}>清空</button>
        </div>
      </section>

      <section className="card">
        <h3>{editingCategoryId ? `编辑分类 ${editingCategoryId}` : "新增分类"}</h3>
        <div className="grid">
          <input placeholder="分类名称" value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} />
          <select value={categoryForm.parentId} onChange={(e) => setCategoryForm((p) => ({ ...p, parentId: e.target.value }))}>
            <option value="">无父级</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
          <input placeholder="书架前缀" value={categoryForm.shelfPrefix} onChange={(e) => setCategoryForm((p) => ({ ...p, shelfPrefix: e.target.value }))} />
        </div>
        <div className="row">
          <button type="button" onClick={submitCategory}>{editingCategoryId ? "保存分类" : "新增分类"}</button>
          <button type="button" className="ghost" onClick={() => { setCategoryForm({ name: "", parentId: "", shelfPrefix: "" }); setEditingCategoryId(null) }}>清空</button>
        </div>
      </section>

      <section className="card">
        <h3>图书列表</h3>
        <div className="row">
          <input placeholder="按书名/作者/ISBN查询" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">全部状态</option>
            <option value="in_library">在馆</option>
            <option value="borrowed">借出</option>
            <option value="discarded">报废</option>
          </select>
        </div>
        <table>
          <thead>
            <tr><th>编号</th><th>书名</th><th>作者</th><th>ISBN</th><th>分类</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId}>
                <td>{book.bookId}</td><td>{book.title}</td><td>{book.author}</td><td>{book.isbn}</td><td>{book.category}</td><td>{book.status}</td>
                <td className="row">
                  <button type="button" onClick={() => startEditBook(book)}>编辑</button>
                  <button type="button" className="danger" onClick={() => deleteBook(book.bookId).then(loadBooks).catch((e) => setMessage(e.message))}>报废</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>分类列表</h3>
        <table>
          <thead><tr><th>分类ID</th><th>名称</th><th>父级</th><th>书架前缀</th><th>操作</th></tr></thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td><td>{category.name}</td><td>{category.parentId || "-"}</td><td>{category.shelfPrefix || "-"}</td>
                <td className="row">
                  <button type="button" onClick={() => startEditCategory(category)}>编辑</button>
                  <button type="button" className="danger" onClick={() => deleteCategory(category.categoryId).then(loadCategories).catch((e) => setMessage(e.message))}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
