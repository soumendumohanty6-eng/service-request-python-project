import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TYPES = ["Lead Generation", "Email Campaign", "Social Campaign", "Other"];
const EMPTY = { name: "", email: "", requestType: "", description: "" };

export default function App() {
  const [form, setForm] = useState(EMPTY);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = async () => {
    try {
      const res = await fetch(`${API}/service-requests`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to load records");
      setRecords(data.data);
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    }
  };

  useEffect(() => { load(); }, []);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!form.name.trim() || !form.email.trim() || !form.requestType || !form.description.trim()) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/service-requests`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), email: form.email.trim(), description: form.description.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setMessage({ type: "success", text: data.message });
      setForm(EMPTY);
      await load();
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally { setLoading(false); }
  };

  return <main className="page"><section className="card">
    <header><p>FULL STACK SERVICE</p><h1>Service Request</h1><span>Submit your request and our team will have the details ready.</span></header>
    <form onSubmit={submit}>
      <label>Name<input name="name" value={form.name} onChange={change} placeholder="Enter your name" /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" /></label>
      <label>Request Type<select name="requestType" value={form.requestType} onChange={change}><option value="">Select request type</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select></label>
      <label>Description<textarea name="description" value={form.description} onChange={change} placeholder="Describe your request" rows="5" /></label>
      <button disabled={loading}>{loading ? "Submitting..." : "Submit Request"}</button>
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
    </form>
    <section className="records"><div className="heading"><h2>Submitted Requests</h2><span>{records.length} total</span></div>
      {records.length === 0 ? <p>No requests submitted yet.</p> :
      records.map(r => <article key={r.id}><div><h3>{r.name}</h3><small>{r.email}</small></div><b>{r.requestType}</b><p>{r.description}</p><small>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</small></article>)}
    </section>
  </section></main>;
}
