import { useEffect, useState } from "react"
import { apiRequest } from "../../shared/api/client"

export default function ReaderCenterPage() {
  const [form, setForm] = useState({
    name: "",
    gender: "女",
    idNumber: "",
    contact: "",
    issueDate: ""
  })
  const [editingCardNo, setEditingCardNo] = useState(null)
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [message, setMessage] = useState("")
  const [readers, setReaders] = useState([])
  const [loanMap, setLoanMap] = useState({})

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const resetForm = () => {
    setForm({ name: "", gender: "女", idNumber: "", contact: "", issueDate: "" })
    setEditingCardNo(null)
  }

  const fetchReaders = async (nextKeyword, nextStatus) => {
    const query = new URLSearchParams({ keyword: nextKeyword, status: nextStatus })
    const result = await apiRequest(`/readers?${query.toString()}`)
    return result.data || []
  }

  const refreshReaders = async () => {
    try {
      setReaders(await fetchReaders(keyword, statusFilter))
    } catch (error) {
      setMessage(error.message)
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchReaders(keyword, statusFilter)
      .then((data) => {
        if (!cancelled) setReaders(data)
      })
      .catch((error) => {
        if (!cancelled) setMessage(error.message)
      })
    return () => {
      cancelled = true
    }
  }, [keyword, statusFilter])

  const registerOrUpdateReader = async () => {
    const payload = {
      name: form.name.trim(),
      gender: form.gender,
      idNumber: form.idNumber.trim(),
      contact: form.contact.trim(),
      issueDate: form.issueDate
    }
    try {
      if (editingCardNo) {
        await apiRequest(`/readers/${editingCardNo}`, { method: "PUT", body: JSON.stringify(payload) })
        setMessage(`读者 ${editingCardNo} 信息已更新。`)
      } else {
        const result = await apiRequest("/readers", { method: "POST", body: JSON.stringify(payload) })
        setMessage(`读者登记成功，自动生成借阅证号：${result.data.cardNo}`)
      }
      resetForm()
      await refreshReaders()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const cancelReader = async (cardNo) => {
    try {
      await apiRequest(`/readers/${cardNo}`, { method: "DELETE" })
      setMessage(`读者 ${cardNo} 已注销。`)
      await refreshReaders()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const loadLoans = async (cardNo) => {
    try {
      const result = await apiRequest(`/readers/${cardNo}/loans`)
      setLoanMap((prev) => ({ ...prev, [cardNo]: result.data || [] }))
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <main className="page">
      <h1>欢迎使用图书管理系统</h1>
      <section className="panel">
        <h2>{editingCardNo ? `修改读者信息（${editingCardNo}）` : "读者信息登记"}</h2>
        <div className="form-grid">
          <label>姓名<input value={form.name} onChange={(e) => updateForm("name", e.target.value)} /></label>
          <label>性别<select value={form.gender} onChange={(e) => updateForm("gender", e.target.value)}><option value="女">女</option><option value="男">男</option></select></label>
          <label>证件号<input value={form.idNumber} onChange={(e) => updateForm("idNumber", e.target.value)} /></label>
          <label>联系方式<input value={form.contact} onChange={(e) => updateForm("contact", e.target.value)} /></label>
          <label>办证日期<input type="date" value={form.issueDate} onChange={(e) => updateForm("issueDate", e.target.value)} /></label>
        </div>
        <div className="row">
          <button type="button" onClick={registerOrUpdateReader}>{editingCardNo ? "保存修改" : "登记读者"}</button>
          <button type="button" className="secondary" onClick={resetForm}>清空</button>
        </div>
      </section>

      <section className="panel">
        <h2>读者信息查询</h2>
        <div className="row">
          <input className="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="按姓名 / 借阅证号 / 证件号 / 联系方式查询" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">全部状态</option><option value="active">有效</option><option value="cancelled">已注销</option>
          </select>
        </div>
      </section>

      {message && <p className="message">{message}</p>}
      <section className="panel">
        <h2>读者列表与借阅历史</h2>
        <table>
          <thead><tr><th>借阅证号</th><th>姓名</th><th>证件号</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {readers.map((reader) => (
              <tr key={reader.cardNo}>
                <td>{reader.cardNo}</td><td>{reader.name}</td><td>{reader.idNumber}</td><td>{reader.status}</td>
                <td>
                  <div className="actions">
                    <button type="button" onClick={() => { setForm({ name: reader.name, gender: reader.gender, idNumber: reader.idNumber, contact: reader.contact, issueDate: reader.issueDate }); setEditingCardNo(reader.cardNo) }}>修改</button>
                    <button type="button" className="danger" onClick={() => cancelReader(reader.cardNo)} disabled={reader.status === "cancelled"}>注销</button>
                  </div>
                  <details onToggle={(e) => e.target.open && loadLoans(reader.cardNo)}>
                    <summary>借阅历史（{(loanMap[reader.cardNo] || []).length}）</summary>
                    <ul>
                      {(loanMap[reader.cardNo] || []).map((loan) => (
                        <li key={loan.id}>《{loan.bookTitle}》 {loan.borrowDate} / {loan.returnDate || "未归还"}</li>
                      ))}
                    </ul>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
