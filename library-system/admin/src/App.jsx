import { useState } from "react"
import BooksManagementPage from "./modules/books/pages/BooksManagementPage"

const MENUS = [
  { key: "dashboard", label: "仪表盘" },
  { key: "books", label: "图书管理" },
  { key: "readers", label: "读者管理" },
  { key: "circulation", label: "借还管理" },
  { key: "reports", label: "查询与统计" },
  { key: "system", label: "系统管理" }
]

function App() {
  const [active, setActive] = useState("dashboard")
  const activeLabel = MENUS.find((item) => item.key === active)?.label || "模块"

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>管理员端</h1>
        <p className="sub">Library Admin Console</p>
        <nav>
          {MENUS.map((menu) => (
            <button
              key={menu.key}
              type="button"
              className={menu.key === active ? "menu active" : "menu"}
              onClick={() => setActive(menu.key)}
            >
              {menu.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="content">
        {active === "books" ? (
          <BooksManagementPage />
        ) : (
          <>
            <h2>{activeLabel}</h2>
            <p className="desc">该模块已预留，后续按模块继续开发。</p>
          </>
        )}
      </main>
    </div>
  )
}

export default App
